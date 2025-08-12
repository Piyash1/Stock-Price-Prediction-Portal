from django.contrib.auth.tokens import default_token_generator
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.utils.encoding import force_bytes
from django.contrib.auth.models import User
from django.conf import settings
from django.core.mail import send_mail
from rest_framework import generics, status
from rest_framework.permissions import AllowAny
from rest_framework.exceptions import APIException
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from django.db import transaction
from .serializers import UserSerializer

class Register_view(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]

    def perform_create(self, serializer):
        # Ensure that if email sending fails, the user is not persisted
        with transaction.atomic():
            user = serializer.save()
            try:
                self.send_activation_email(user)
            except Exception as exc:
                # Any failure sending email will rollback user creation
                raise APIException("Failed to send activation email. Please try again.") from exc

    def send_activation_email(self, user: User) -> None:
        token = default_token_generator.make_token(user)
        uid = urlsafe_base64_encode(force_bytes(user.pk))
        activate_url = f"{getattr(settings, 'FRONTEND_BASE_URL', 'http://localhost:5173')}/activate/{uid}/{token}"

        subject = "Activate your account"
        message = (
            "Welcome! Please confirm your email to activate your account.\n\n"
            f"Activation link: {activate_url}\n\n"
            "If you did not sign up, you can ignore this email."
        )
        send_mail(subject, message, getattr(settings, 'DEFAULT_FROM_EMAIL', 'no-reply@example.com'), [user.email], fail_silently=False)


class ActivateAccountView(generics.GenericAPIView):
    permission_classes = [AllowAny]

    def get(self, request, uidb64, token):
        try:
            uid = urlsafe_base64_decode(uidb64).decode()
            user = get_object_or_404(User, pk=uid)
        except Exception:
            return Response({"detail": "Invalid activation link."}, status=status.HTTP_400_BAD_REQUEST)

        if user.is_active:
            return Response({"detail": "Account already activated."})

        if default_token_generator.check_token(user, token):
            user.is_active = True
            user.save(update_fields=["is_active"])
            return Response({"detail": "Account activated successfully."})
        return Response({"detail": "Invalid or expired token."}, status=status.HTTP_400_BAD_REQUEST)

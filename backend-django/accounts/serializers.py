from django.contrib.auth.models import User
from rest_framework import serializers

class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8, style={'input_type': 'password'})

    class Meta:
        model = User
        fields = ['username', 'email', 'password']

    def validate_username(self, value):
        if User.objects.filter(username=value).exists():
            raise serializers.ValidationError("Username is already taken.")
        return value

    def validate_email(self, value):
        email_lower = value.strip().lower()
        if User.objects.filter(email=email_lower).exists():
            raise serializers.ValidationError("Email is already registered.")

        # Only allow Gmail addresses
        allowed_domains = {"gmail.com", "googlemail.com"}
        try:
            domain = email_lower.split("@", 1)[1]
        except IndexError:
            raise serializers.ValidationError("Enter a valid email address.")
        if domain not in allowed_domains:
            raise serializers.ValidationError("Only Gmail addresses are allowed.")

        return email_lower

    def create(self, validated_data):
        # Create the user as inactive until email confirmation
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password']
        )
        user.is_active = False
        user.save(update_fields=["is_active"])
        return user

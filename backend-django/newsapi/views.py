import json
import requests
from datetime import datetime, timedelta
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from decouple import config  # use python-decouple

@csrf_exempt
def stock_news_api(request):
    if request.method != 'POST':
        return JsonResponse({'message': 'Use POST with {"symbol": "AAPL"}'}, status=405)

    try:
        body = json.loads(request.body)
        symbol = body.get('symbol', '').upper()

        if not symbol:
            return JsonResponse({'error': 'Symbol is required'}, status=400)

        FINNHUB_API_KEY = config('FINNHUB_API_KEY')  # using decouple here

        to_date = datetime.now().date()
        from_date = to_date - timedelta(days=7)

        url = (
            f"https://finnhub.io/api/v1/company-news?"
            f"symbol={symbol}&from={from_date}&to={to_date}&token={FINNHUB_API_KEY}"
        )

        response = requests.get(url)
        if response.status_code != 200:
            return JsonResponse({'error': 'Failed to fetch news from Finnhub'}, status=response.status_code)

        news_data = response.json()
        if not isinstance(news_data, list):
            return JsonResponse({'error': 'Unexpected response from Finnhub'}, status=500)

        headlines = [
            {
                'headline': item['headline'],
                'source': item['source'],
                'url': item['url'],
                'datetime': datetime.fromtimestamp(item['datetime']).strftime('%Y-%m-%d %H:%M')
            }
            for item in news_data[:5]
        ]

        return JsonResponse({'symbol': symbol, 'news': headlines})

    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)

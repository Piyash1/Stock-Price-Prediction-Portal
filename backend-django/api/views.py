import json
import base64
from io import BytesIO
import os
import numpy as np
import pandas as pd
import yfinance as yf
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
from keras.models import load_model
from sklearn.preprocessing import MinMaxScaler
from datetime import datetime
from django.conf import settings
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse


def plot_to_base64(fig):
    buf = BytesIO()
    fig.savefig(buf, format="png")
    plt.close(fig)
    buf.seek(0)
    return base64.b64encode(buf.read()).decode('utf-8')


def plot_graph(figsize, values, full_data, extra_data=False, extra_dataset=None):
    fig = plt.figure(figsize=figsize)
    plt.plot(values, 'orange')
    plt.plot(full_data['Close'], 'b')
    if extra_data and extra_dataset is not None:
        plt.plot(extra_dataset)
    return plot_to_base64(fig)


@csrf_exempt
def stock_plot_api(request):
    if request.method != 'POST':
        return JsonResponse({'message': 'Use POST with {"symbol": "GOOG"}'}, status=405)

    try:
        body = json.loads(request.body)
        symbol = body.get('symbol', '').upper()

        if not symbol:
            return JsonResponse({'error': 'Symbol is required'}, status=400)

        # Load stock data
        end = datetime.now()
        start = datetime(end.year - 20, end.month, end.day)
        google_data = yf.download(symbol, start=start, end=end)

        # Debug prints - comment out in production
        print("Columns before processing:", google_data.columns)
        print("Columns type:", type(google_data.columns))

        # Handle multi-index columns and flatten if necessary
        if isinstance(google_data.columns, pd.MultiIndex):
            if symbol in google_data.columns.levels[0]:
                google_data = google_data[symbol]
            else:
                # Flatten multi-index columns
                google_data.columns = ['_'.join(col).strip() for col in google_data.columns.values]
                print("Columns after flattening:", google_data.columns)

                # Find the close column dynamically
                close_cols = [col for col in google_data.columns if 'close' in col.lower()]
                if not close_cols:
                    return JsonResponse({'error': f'Close column not found after flattening columns for {symbol}'}, status=404)

                # Use first close column found
                google_data['Close'] = google_data[close_cols[0]]

        else:
            # Single-level columns, verify 'Close' exists
            if 'Close' not in google_data.columns:
                return JsonResponse({'error': f"'Close' column not found for symbol {symbol}"}, status=404)

        if google_data.empty:
            return JsonResponse({'error': f'No data found for symbol: {symbol}'}, status=404)

        # Calculate moving averages
        google_data['MA_for_100_days'] = google_data['Close'].rolling(100).mean()
        google_data['MA_for_200_days'] = google_data['Close'].rolling(200).mean()
        google_data['MA_for_250_days'] = google_data['Close'].rolling(250).mean()

        splitting_len = int(len(google_data) * 0.7)
        x_test = pd.DataFrame(google_data['Close'][splitting_len:])

        # Load your trained Keras model
        MODEL_PATH = os.path.join(settings.BASE_DIR, 'stock_models', 'Latest_stock_price_model.keras')
        model = load_model(MODEL_PATH)

        # Scale and prepare test data for prediction
        scaler = MinMaxScaler(feature_range=(0, 1))
        scaled_data = scaler.fit_transform(x_test[['Close']])

        x_data = []
        y_data = []
        for i in range(100, len(scaled_data)):
            x_data.append(scaled_data[i - 100:i])
            y_data.append(scaled_data[i])

        x_data, y_data = np.array(x_data), np.array(y_data)

        # Make predictions and invert scaling
        predictions = model.predict(x_data)
        inv_pred = scaler.inverse_transform(predictions)
        inv_y = scaler.inverse_transform(y_data)

        plot_data = pd.DataFrame({
            'original_test_data': inv_y.reshape(-1),
            'predictions': inv_pred.reshape(-1)
        }, index=google_data.index[splitting_len + 100:])

        # Generate plots encoded in base64
        ma_250 = plot_graph((15, 5), google_data['MA_for_250_days'], google_data)
        ma_200 = plot_graph((15, 5), google_data['MA_for_200_days'], google_data)
        ma_100 = plot_graph((15, 5), google_data['MA_for_100_days'], google_data)
        ma_100_250 = plot_graph((15, 5), google_data['MA_for_100_days'], google_data, True, google_data['MA_for_250_days'])

        fig = plt.figure(figsize=(15, 6))
        plt.plot(pd.concat([google_data['Close'][:splitting_len + 100], plot_data], axis=0))
        plt.legend(["Data - not used", "Original Test data", "Predicted Test data"])
        pred_vs_actual = plot_to_base64(fig)

        return JsonResponse({
            'symbol': symbol,
            'plots': {
                'ma_100': ma_100,
                'ma_200': ma_200,
                'ma_250': ma_250,
                'ma_100_250': ma_100_250,
                'prediction_vs_actual': pred_vs_actual
            }
        })

    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)

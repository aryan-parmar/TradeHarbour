from datetime import timedelta
from flask import Flask, request, jsonify
import pandas as pd
import yfinance as yf
from flask_cors import CORS
from sklearn.preprocessing import MinMaxScaler
from sklearn.metrics import mean_squared_error, mean_absolute_error, r2_score, mean_absolute_percentage_error
from tensorflow.keras.models import load_model
from sklearn.linear_model import LinearRegression
from sklearn.model_selection import train_test_split
import numpy as np
from arch import arch_model

app = Flask(__name__)
CORS(app)
lstm_model_path = './models/lstm_model_adam.h5'
lstm_model = load_model(lstm_model_path)


def load_data(ticker, start_date, end_date):
    df = yf.download(ticker, start=start_date, end=end_date)
    df = df[['Close']]
    return df

def prepare_data(data, look_back):
    scaler = MinMaxScaler(feature_range=(0, 1))
    scaled_data = scaler.fit_transform(data.values.reshape(-1, 1))
    X, y = [], []
    for i in range(look_back, len(scaled_data)):
        X.append(scaled_data[i-look_back:i, 0])
        y.append(scaled_data[i, 0])
    X, y = np.array(X), np.array(y)
    X = X.reshape(X.shape[0], X.shape[1], 1)
    return X, y, scaler

@app.route('/predict-lstm', methods=['POST'])
def predict():
    content = request.json
    ticker = content['ticker']
    start_date = content['start_date']
    end_date = content['end_date']
    look_back = 100  # Fixed look_back period

    df = load_data(ticker, start_date, end_date)
    if df.isnull().any().any():
        df = df.dropna()  # Drop any rows with NaN values

    if df.empty:
        return jsonify({"error": "No data available for the given ticker and date range."})

    # X, y, scaler = prepare_data(df['Close'], look_back)
    # predictions = lstm_model.predict(X)
    # predictions_rescaled = scaler.inverse_transform(predictions)
    # y_rescaled = scaler.inverse_transform(y.reshape(-1, 1))
    # mse = mean_squared_error(y_rescaled, predictions_rescaled)
    # mae = mean_absolute_error(y_rescaled, predictions_rescaled)
    # r2 = r2_score(y_rescaled, predictions_rescaled)
    # mape = mean_absolute_percentage_error(y_rescaled, predictions_rescaled)

     # Convert Timestamp to string

    # accuracy = 100-mape
    # print(len(y_rescaled.flatten().tolist()), len(predictions_rescaled.flatten().tolist()), len(dates))
    
        # try:
        #     stock_list.append([dates[i], x1[i], x2[i]])
        # except:
        #     stock_list.append([i-len(y_rescaled.flatten().tolist()), None, x2[i]])
    # response = {
    #     "ticker": ticker,
    #     # "dates": dates,
    #     # "actual_prices": y_rescaled.flatten().tolist(),
    #     # "predicted_prices": predictions_rescaled.flatten().tolist(),
    #     "stock_data": stock_list,
    #     "mse": mse,
    #     "mae": mae,
    #     "r2": r2,
    #     "mape": mape,
    #     "accuracy": accuracy
    # }
    # return jsonify(response)
    future_days = 10
    X, y, scaler = prepare_data(df['Close'], look_back=100)
    predictions = lstm_model.predict(X)
    predictions_rescaled = scaler.inverse_transform(predictions)
    y_rescaled = scaler.inverse_transform(y.reshape(-1, 1))

    dates = df.index[look_back:].tolist()  # List of dates corresponding to the predictions
    dates = [date.strftime('%Y-%m-%d') for date in dates] 

    mse = mean_squared_error(y_rescaled, predictions_rescaled)
    mae = mean_absolute_error(y_rescaled, predictions_rescaled)
    r2 = r2_score(y_rescaled, predictions_rescaled)
    mape = mean_absolute_percentage_error(y_rescaled, predictions_rescaled)
    accuracy = 100 - mape
    last_batch = X[-1:].reshape(1, 100, -1)
    future_predictions = []

    stock_list = []
    x1 = y_rescaled.flatten().tolist()
    x2 = predictions_rescaled.flatten().tolist()
    for i in range(len(x2)):
        stock_list.append([dates[i], x1[i], x2[i]])

    for _ in range(future_days):
        current_pred = lstm_model.predict(last_batch)
        current_pred_rescaled = scaler.inverse_transform(current_pred).flatten()[0]
        future_predictions.append(float(current_pred_rescaled))  # Convert NumPy float to Python float
        last_batch = np.append(last_batch[:, 1:, :], current_pred.reshape(1, 1, -1), axis=1)

    final_dates = [pd.to_datetime(end_date) + timedelta(days=i+1) for i in range(future_days)]
    final_dates_str = [date.strftime('%Y-%m-%d') for date in final_dates]
    stock_l = [[date, None, pred] for date, pred in zip(final_dates_str, future_predictions)]
    stock_list.extend(stock_l)
    response = {
        "ticker": ticker,
        "stock_data": stock_list,
        "mse": mse,
        "mae": mae,
        "r2": r2,
        "mape": mape,
        "accuracy": accuracy
    }
    return jsonify(response)



@app.route('/get_stock_data', methods=['POST'])
def get_stock_data():
    request_data = request.get_json()
    ticker = request_data.get('ticker')
    period = request_data.get('period')
    if not ticker or not period:
        return jsonify({"error": "Please provide both 'ticker' and 'period'"}), 400
    data = yf.Ticker(ticker)
    hist = data.history(period=period)
    hist['DateTime'] = hist.index.strftime('%Y-%m-%d')
    if hist.empty:
        return jsonify({"error": "No data found"}), 404
    columns_order = ['DateTime', 'Low', 'Open', 'Close', 'High']
    ordered_data = hist.reset_index()[columns_order].values.tolist()
    return jsonify({"data": ordered_data})

@app.route('/sip-calculator', methods=['POST'])
def sip_calculator():
    request_data = request.get_json()
    sip_amount = float(request_data.get('sip_amount'))
    sip_period = int(request_data.get('sip_period'))
    sip_rate = float(request_data.get('sip_rate'))
    monthly_rate = sip_rate / 12 / 100
    months = sip_period * 12
    future_value = 0
    for _ in range(months):
        future_value = (future_value + sip_amount) * (1 + monthly_rate)
    invested_amount = sip_amount * months
    return jsonify({"returns": [invested_amount, future_value-invested_amount]})


def fetch_stock_data(ticker_symbol, start_date, end_date):
    stock_data = yf.download(ticker_symbol, start=start_date, end=end_date)
    return stock_data

def train_linear_regression_model(X, y):
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42, train_size=0.8)
    model = LinearRegression()
    model.fit(X_train, y_train)
    return model, X_test, y_test


@app.route('/predict-linear', methods=['POST'])
def predict_and_plot_stock():
    request_data = request.get_json()
    ticker_symbol = request_data['ticker']
    start_date = request_data['start_date']
    end_date = request_data['end_date']
    look_back = 100

    stock_data = fetch_stock_data(ticker_symbol, start_date, end_date)
    dates = stock_data.index.tolist()  # List of dates corresponding to the predictions
    X = np.arange(len(stock_data)).reshape(-1, 1)  # Using index as a feature
    y = stock_data['Close'].values  # Target variable

    model, X_test, y_test = train_linear_regression_model(X, y)
    predictions = model.predict(X_test)
    mse = mean_squared_error(y_test, predictions)
    dates = [date.strftime('%Y-%m-%d') for date in dates]
    stock_list = [[dates[i], y[i], predictions[i]] for i in range(len(X_test))]
    print(stock_list)
    return jsonify({
        'mean_squared_error': mse,
        "stock_data": stock_list
    })

@app.route('/predict-garch', methods=['POST'])
def predict_garch():
    request_data = request.get_json()
    ticker_symbol = request_data['ticker']
    start_date = request_data['start_date']
    end_date = request_data['end_date']
    stock_data = fetch_stock_data(ticker_symbol, start_date, end_date)
    returns = 100 * stock_data['Close'].pct_change().dropna()
    model = arch_model(returns, vol='Garch', p=1, q=1)
    model_fit = model.fit(disp='off')
    forecast = model_fit.forecast(horizon=5)
    return jsonify({
        'forecast': forecast.mean.iloc[-1].values.tolist()
    })


if __name__ == '__main__':
    app.run(debug=True)

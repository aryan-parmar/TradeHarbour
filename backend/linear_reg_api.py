# from flask import Flask, request, jsonify
# import yfinance as yf
# import numpy as np
# from sklearn.linear_model import LinearRegression
# from sklearn.model_selection import train_test_split
# from sklearn.metrics import mean_squared_error
# import matplotlib.pyplot as plt

# app = Flask(__name__)

# # Define a function to fetch stock data


# def fetch_stock_data(ticker_symbol, start_date, end_date):
#     stock_data = yf.download(ticker_symbol, start=start_date, end=end_date)
#     return stock_data

# # Define a function for training linear regression model


# def train_linear_regression_model(X, y):
#     X_train, X_test, y_train, y_test = train_test_split(
#         X, y, test_size=0.2, random_state=42)
#     model = LinearRegression()
#     model.fit(X_train, y_train)
#     return model, X_test, y_test


# @app.route('/predict_and_plot_stock', methods=['POST'])
# def predict_and_plot_stock():
#     request_data = request.get_json()
#     ticker_symbol = request_data['ticker_symbol']
#     start_date = request_data['start_date']
#     end_date = request_data['end_date']

#     stock_data = fetch_stock_data(ticker_symbol, start_date, end_date)

#     X = np.arange(len(stock_data)).reshape(-1, 1)  # Using index as a feature
#     y = stock_data['Close'].values  # Target variable

#     model, X_test, y_test = train_linear_regression_model(X, y)
#     predictions = model.predict(X_test)
#     mse = mean_squared_error(y_test, predictions)

#     # Plotting the data
#     plt.figure(figsize=(10, 6))
#     plt.scatter(X_test, y_test, color='blue', label='Actual Price')
#     plt.plot(X_test, predictions, color='red', label='Predicted Price')
#     plt.xlabel('Time')
#     plt.ylabel('Price')
#     plt.title('True vs. Predicted Stock Prices (Linear Regression)')
#     plt.legend()
#     plt.grid(True)

#     # Saving the plot to a file
#     plot_file = 'plot.png'
#     plt.savefig(plot_file)

#     return jsonify({
#         'plot_file': plot_file,
#         'mean_squared_error': mse
#     })


# if __name__ == '__main__':
#     app.run(debug=True)
# # Run the Flask app by executing the following command in the terminal:
# # python linear_reg_api.py


from flask import Flask, request, jsonify
import yfinance as yf
import numpy as np
from sklearn.linear_model import LinearRegression
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_squared_error
import matplotlib.pyplot as plt
import os

app = Flask(__name__)

# Define a function to fetch stock data


def fetch_stock_data(ticker_symbol, start_date, end_date):
    stock_data = yf.download(ticker_symbol, start=start_date, end=end_date)
    return stock_data

# Define a function for training linear regression model


def train_linear_regression_model(X, y):
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42)
    model = LinearRegression()
    model.fit(X_train, y_train)
    return model, X_test, y_test


@app.route('/predict_and_plot_stock', methods=['POST'])
def predict_and_plot_stock():
    request_data = request.get_json()
    ticker_symbol = request_data['ticker_symbol']
    start_date = request_data['start_date']
    end_date = request_data['end_date']

    stock_data = fetch_stock_data(ticker_symbol, start_date, end_date)

    X = np.arange(len(stock_data)).reshape(-1, 1)  # Using index as a feature
    y = stock_data['Close'].values  # Target variable

    model, X_test, y_test = train_linear_regression_model(X, y)
    predictions = model.predict(X_test)
    mse = mean_squared_error(y_test, predictions)
    stock_data = [[X_test[i][0], y_test[i], predictions[i]] for i in range(len(X_test))]
    return jsonify({
        'mean_squared_error': mse,
        "stock_data": stock_data
    })


if __name__ == '__main__':
    app.run(debug=True)

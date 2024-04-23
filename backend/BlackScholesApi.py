from flask import Flask, request, jsonify
import yfinance as yf
from scipy.stats import norm
import numpy as np

app = Flask(__name__)

def fetch_dividend_yield(ticker):
    stock = yf.Ticker(ticker)
    info = stock.info
    dividend_yield = info.get('dividendYield', 0)  # Get dividend yield, 0 if not found
    current_price = info.get('regularMarketPrice', None)

    # If the dividend yield is not available, try to calculate it from dividends and price
    if not dividend_yield and current_price:
        dividends = stock.dividends.last('1y').sum()  # Total dividends in the last year
        dividend_yield = dividends / current_price  # Calculate yield

    return dividend_yield, current_price

def black_scholes_dividends(S0, K, r, T, sigma, q):
    d1 = (np.log(S0 / K) + (r - q + 0.5 * sigma**2) * T) / (sigma * np.sqrt(T))
    d2 = d1 - sigma * np.sqrt(T)
    C = S0 * np.exp(-q * T) * norm.cdf(d1) - K * np.exp(-r * T) * norm.cdf(d2)
    return C

def calculate_annualized_volatility(ticker):
    stock_data = yf.download(ticker, start="2023-01-01", end="2023-12-31")
    stock_data['Daily Return'] = stock_data['Adj Close'].pct_change()
    daily_volatility = stock_data['Daily Return'].std()
    annualized_volatility = daily_volatility * np.sqrt(252)
    return annualized_volatility

@app.route('/finance', methods=['POST'])
def finance():
    data = request.json
    ticker = data['ticker']
    K = data['strike_price']
    r = data['risk_free_rate']
    T = data['time_to_maturity']
    sigma = data['volatility']

    q, S0 = fetch_dividend_yield(ticker)
    if S0 is None:
        return jsonify({"error": "Failed to fetch stock price."}), 400

    call_option_price = black_scholes_dividends(S0, K, r, T, sigma, q)
    annualized_volatility = calculate_annualized_volatility(ticker)

    return jsonify({
        "ticker": ticker,
        "call_option_price": call_option_price,
        "annualized_volatility": annualized_volatility * 100  # Convert to percentage
    })

if __name__ == '__main__':
    app.run(debug=True)

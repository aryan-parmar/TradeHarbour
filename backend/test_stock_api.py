import requests

def get_stock_data(ticker, period):
    url = 'http://127.0.0.1:5000/get_stock_data'
    data = {
        'ticker': ticker,
        'period': period
    }
    headers = {
        'Content-Type': 'application/json'
    }
    response = requests.post(url, json=data, headers=headers)
    if response.status_code == 200:
        # Print the entire JSON response
        print("Received JSON response:")
        print(response.json())
    else:
        print(f"Failed to fetch data: {response.status_code}")
        print(response.json())

if __name__ == '__main__':
    ticker = 'AAPL'
    period = '1mo'
    get_stock_data(ticker, period)

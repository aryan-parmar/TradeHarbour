from flask import Flask, request, jsonify
import numpy as np
import pandas as pd
import yfinance as yf
from sklearn.preprocessing import MinMaxScaler
from sklearn.metrics import mean_squared_error, mean_absolute_error, r2_score
from tensorflow.keras.models import load_model
import matplotlib.pyplot as plt

app = Flask(__name__)

if __name__ == '__main__':
    app.run(debug=True)

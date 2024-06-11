import yfinance as yf
import pandas as pd


emptydf = pd.DataFrame()

def price_range(global_df=None, price=None):
    if (global_df is None or price is None):
        return 0

    filtered_df = global_df.Close.map(lambda x: x if x <= price else None)
    
    # Drop columns where all values are None
    stocks_df = filtered_df.dropna(axis=1, how='all')

    return stocks_df



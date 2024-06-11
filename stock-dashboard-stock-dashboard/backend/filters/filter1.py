import yfinance as yf
import pandas as pd


emptydf = pd.DataFrame()

def consecutive_positive_3(global_df=None, days=None):
    if (global_df is None or days is None):
        return 0

    emptydf = global_df.tail(days+2).Close.pct_change()

    # Check if the percentage change is positive for all 5 days
    positive_mask = emptydf[2:].map(lambda x: (x > 0)).all()
    #print(positive_mask)

    # Filter stocks meeting the criteria
    up_stocks = positive_mask[positive_mask].index.tolist()
    #print(up_stocks, hist.Close[up_stocks][2:])

    #hist.Close[up_stocks][2:].to_excel("output.xlsx")

    return up_stocks, global_df.tail(days)

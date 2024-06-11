import requests_cache
import yfinance as yf
import pandas as pd
import json

import filters.filter1 as filter1
import filters.filter2 as filter2


class StocksData:
    def __init__(self) -> None:
        self.session = requests_cache.CachedSession('yfinance.cache')
        self.session.headers['User-agent'] = 'my-program/1.0'

        self.aus_stocs = ["BHP", "CBA", "CSL", "NAB", "WBC", "JTL", "NGS", "T3D", "MSG", "SAN"]
        self.exchange = "AX"
        self.sybmols = " ".join([f"{i}.{self.exchange}" for i in self.aus_stocs])
        self.global_df = pd.DataFrame()

    def get_all(self) -> dict:
        print("getting all data")
        ticks = yf.Tickers(self.sybmols, session=self.session)

        # get historical market data
        hist_df = ticks.history(period="1y")
        self.global_df = hist_df.copy(deep=True)

        return json.loads(self.global_df.to_json())
    
    def consecutive_filter(self, days=3) -> list:
        stocks, stocks_df = filter1.consecutive_positive_3(self.global_df, days)

        # Create a list of tuples for the MultiIndex columns you want to keep
        cols_to_keep = [(main_col, sub_col) for main_col in stocks_df.columns.get_level_values(0).unique() for sub_col in stocks if (main_col, sub_col) in stocks_df.columns]
        self.global_df = stocks_df.loc[:, cols_to_keep].copy(deep=True)
        
        stocks_data = []; up_stocks_dict = json.loads(self.global_df.Close.to_json())
        for stock in stocks:
            data = {}
            data["symbol"] = stock
            data["closingPrices"] = up_stocks_dict[stock]
            stocks_data.append(data)

        return stocks_data

    def price_filter(self, price=0.1):
        print(self.global_df)
        stocks_df = filter2.price_range(self.global_df, price)

        self.global_df = stocks_df.copy(deep=True)
        
        return json.loads(stocks_df.to_json())
    
    def download(self):
        self.global_df.to_excel("output.xlsx")

# def pricerange_filter(range=0.1):
#     stocks, stocks_df = filter2.pricerange(range=0.1)
#     globaldf = up_stocks_df.copy(deep=True)

#     stocks_data = []; up_stocks_dict = json.loads(up_stocks_df.to_json())
#     for stock in up_stocks:
#         data = {}
#         data["symbol"] = stock
#         data["closingPrices"] = up_stocks_dict[stock]
#         stocks_data.append(data)

#     return stocks_data

# get all stock info
#print(msft.info)


# # show meta information about the history (requires history() to be called first)
# msft.history_metadata

# # show actions (dividends, splits, capital gains)
# msft.actions
# msft.dividends
# msft.splits
# msft.capital_gains  # only for mutual funds & etfs

# # show share count
# msft.get_shares_full(start="2022-01-01", end=None)

# # show financials:
# # - income statement
# msft.income_stmt
# msft.quarterly_income_stmt
# # - balance sheet
# msft.balance_sheet
# msft.quarterly_balance_sheet
# # - cash flow statement
# msft.cashflow
# msft.quarterly_cashflow
# # see `Ticker.get_income_stmt()` for more options

# # show holders
# msft.major_holders
# msft.institutional_holders
# msft.mutualfund_holders
# msft.insider_transactions
# msft.insider_purchases
# msft.insider_roster_holders

# # show recommendations
# msft.recommendations
# msft.recommendations_summary
# msft.upgrades_downgrades

# # Show future and historic earnings dates, returns at most next 4 quarters and last 8 quarters by default.
# # Note: If more are needed use msft.get_earnings_dates(limit=XX) with increased limit argument.
# msft.earnings_dates

# # show ISIN code - *experimental*
# # ISIN = International Securities Identification Number
# msft.isin

# # show options expirations
# msft.options

# # show news
# msft.news

# # get option chain for specific expiration
# opt = msft.option_chain('YYYY-MM-DD')
# # data available via: opt.calls, opt.puts
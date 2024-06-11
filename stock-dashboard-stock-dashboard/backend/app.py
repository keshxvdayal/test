from flask import Flask, jsonify
from flask_cors import CORS
from flask_caching import Cache
import json

import main

app = Flask(__name__)
cache = Cache(app, config={'CACHE_TYPE': 'simple'})
CORS(app)

stocks_data_class = main.StocksData()
stocks_data_class.get_all()
#stocks_data_class.download()

@app.route('/get_consecutive', methods=['GET'])
#@cache.cached(timeout=60*60)
def get_consecutive():
    stocks_data = stocks_data_class.consecutive_filter()

    # Return the list as JSON
    return jsonify(stocks_data), 200

@app.route('/get_inprice', methods=['GET'])
def get_inprice():
    stocks_data = stocks_data_class.price_filter()

    # Return the list as JSON
    return jsonify(stocks_data), 200


if __name__ == '__main__':
    app.run(debug=True, port=8082)

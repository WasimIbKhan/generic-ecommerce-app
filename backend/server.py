from flask import Flask, jsonify, request
from flask_cors import CORS
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import sklearn
from sklearn.decomposition import TruncatedSVD

app = Flask(__name__)
CORS(app) 
@app.route('/recommendations', methods=['GET', 'POST'])
def recommendations():
    # %matplotlib inline
    if request.method == 'GET':
        print("Received GET request")
    
    e_commerce_products = pd.read_pickle('e_commerce_products.pkl')

    e_commerce_products.columns = ["id", "title", "imageUrl", "description", "price"]

    e_commerce_products["ownerId"] = "JNZXkAnWtWMAkDchdhdWLQCx3Ox2"

    recommendations = e_commerce_products.to_dict(orient='records')
    return jsonify(recommendations)

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)

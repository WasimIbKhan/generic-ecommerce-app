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
    
    e_commerce_products = pd.read_csv('marketing_sample_for_myntra_com-ecommerce__20190601_20190831__15k_data.csv')
    e_commerce_ratings = pd.read_csv('ratings_Electronics (1).csv')
    e_commerce_ratings.columns = ["UserId", "ProductId", "Rating", "Timestamp"]
    e_commerce_ratings.head()

    e_commerce_products = e_commerce_products.sample(frac=1, random_state=42)

    recomendation_order= pd.DataFrame(e_commerce_ratings.groupby('ProductId')['Rating'].count())
    recomendation_order = recomendation_order.sort_values('Rating', ascending=False).reset_index()

    recomendation_order = recomendation_order.iloc[:1649]

    final_assignment_df = recomendation_order.join(e_commerce_products)

    final_assignment_df.drop(final_assignment_df.columns[[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 12, 13, 14, 16, 18, 19, 20, 22, 23, 24, 25, 26, 27]], axis = 1, inplace=True)

    final_assignment_df.columns = ["id", "title", "imageUrl", "description", "price"]

    final_assignment_df["ownerId"] = "JNZXkAnWtWMAkDchdhdWLQCx3Ox2"

    recommendations = final_assignment_df.to_dict(orient='records')
    return jsonify(recommendations)

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)

import numpy as np
import pandas as pd
import matplotlib.pyplot as plt

from sklearn.decomposition import TruncatedSVD

def generate_recommendations():
    plt.style.use("ggplot")

    e_commerce_products = pd.read_csv('backend/marketing_sample_for_myntra_com-ecommerce__20190601_20190831__15k_data.csv')
    e_commerce_ratings = pd.read_csv('backend/ratings_Electronics (1).csv')
    e_commerce_ratings.columns = ["UserId", "ProductId", "Rating", "Timestamp"]

    e_commerce_products = e_commerce_products.sample(frac=1, random_state=42)

    recomendation_order = pd.DataFrame(e_commerce_ratings.groupby('ProductId')['Rating'].count())
    recomendation_order = recomendation_order.sort_values('Rating', ascending=False).reset_index()

    recomendation_order = recomendation_order.iloc[:1649]

    final_assignment_df = recomendation_order.join(e_commerce_products)
    final_assignment_df.drop(final_assignment_df.columns[[3, 4, 5, 6, 7, 8, 9, 10, 13, 14, 22, 23, 24, 25, 26, 27]], axis = 1, inplace=True)
    print("step 2")
    return final_assignment_df

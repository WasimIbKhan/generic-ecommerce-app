import Product from '../../models/product';

export const DELETE_PRODUCT = 'DELETE_PRODUCT';
export const CREATE_PRODUCT = 'CREATE_PRODUCT';
export const UPDATE_PRODUCT = 'UPDATE_PRODUCT';
export const SET_PRODUCTS = 'SET_PRODUCTS';

import {getFirestore, getDocs, deleteDoc, updateDoc } from "firebase/firestore"; 

export const fetchProducts = () => {
  return async (dispatch, getState) => {
    // any async code you want!
    const db = getFirestore()

    const loadedProducts = []

    try {
      await getDocs(collection(db, `products`)).then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          loadedProducts.push(
              new Product(
                doc.id,
                doc.data().ownerId,
                doc.data().title,
                doc.data().imageUrl,
                doc.data().description,
                doc.data().price
              )
            );
        });
      });

      dispatch({ type: SET_ORDERS, orders: loadedProducts});
    } catch (err) {
      throw err;
    }
  };
};

export const deleteProduct = productId => {
  return async (dispatch, getState) => {
    const token = getState().auth.token;
    const response = await fetch(
      `https://ng-prj-test.firebaseio.com/products/${productId}.json?auth=${token}`,
      {
        method: 'DELETE'
      }
    );

    if (!response.ok) {
      throw new Error('Something went wrong!');
    }
    dispatch({ type: DELETE_PRODUCT, pid: productId });
  };
};

export const createProduct = (title, description, imageUrl, price) => {
  return async (dispatch, getState) => {
    // any async code you want!
    const token = getState().auth.token;
    const userId = getState().auth.userId;
    const response = await fetch(
      `https://ng-prj-test.firebaseio.com/products.json?auth=${token}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          title,
          description,
          imageUrl,
          price,
          ownerId: userId
        })
      }
    );

    const resData = await response.json();

    dispatch({
      type: CREATE_PRODUCT,
      productData: {
        id: resData.name,
        title,
        description,
        imageUrl,
        price,
        ownerId: userId
      }
    });
  };
};

export const updateProduct = (id, title, description, imageUrl) => {
  return async (dispatch, getState) => {

    const db = getFirestore()

    await updateDoc(doc(db, `products/${id}`), {
      title: title,
      description: description,
      imageUrl: imageUrl
    })
    
    dispatch({
      type: UPDATE_PRODUCT,
      pid: id,
      productData: {
        title,
        description,
        imageUrl
      }
    });
  };
};

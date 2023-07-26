import Product from '../../models/product';

export const DELETE_PRODUCT = 'DELETE_PRODUCT';
export const CREATE_PRODUCT = 'CREATE_PRODUCT';
export const UPDATE_PRODUCT = 'UPDATE_PRODUCT';
export const SET_PRODUCTS = 'SET_PRODUCTS';

import {getFirestore, getDocs, deleteDoc, updateDoc, addDoc, doc, collection } from "firebase/firestore"; 

export const fetchProducts = () => {
  return async (dispatch, getState) => {
    // any async code you want!
    const userId = getState().auth.userId;
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
      dispatch({ type: SET_PRODUCTS,
        products: loadedProducts,
        userProducts: loadedProducts.filter(prod => prod.ownerId === userId)
      });
    } catch (err) {
      throw err;
    }
  };
};

export const deleteProduct = productId => {
  return async (dispatch, getState) => {
    const db = getFirestore()
    await deleteDoc(doc(db, "products", productId))
    
    dispatch({ type: DELETE_PRODUCT, pid: productId });
  };
};

export const createProduct = (title, description, imageUrl, price) => {
  return async (dispatch, getState) => {
    // any async code you want!
    const userId = getState().auth.userId;
    let newId; 
    const db = getFirestore()
    await addDoc(collection(db, `products`), {
      ownerId: userId,
      title: title,
      description: description,
      imageUrl: imageUrl,
      price: price
    }).then(async(ref) => {
      newId = ref.id
    })


    dispatch({
      type: CREATE_PRODUCT,
      productData: {
        id: newId,
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

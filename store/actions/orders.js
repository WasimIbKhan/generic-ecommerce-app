import {getFirestore, getDocs, collection, doc, setDoc, addDoc } from "firebase/firestore"; 
import Order from '../../models/order';

export const ADD_ORDER = 'ADD_ORDER';
export const SET_ORDERS = 'SET_ORDERS';

import firebase from 'firebase/app';
import 'firebase/functions';

export const fetchOrders = () => {
  return async (dispatch, getState) => {
    const userId = getState().auth.userId;

    const db = getFirestore()

    const loadedOrders = []
  
    try {
      await getDocs(query(collection(db, "orders"), where("userId", "==", userId))).then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          loadedOrders.push(
              new Order(
                doc.id,
                doc.data().cartItems,
                doc.data().totalAmount,
                doc.data().date
              )
            );
        });
      });
      dispatch({ type: SET_ORDERS, orders: loadedOrders});
    } catch (err) {
      throw err;
    }
  };
};

export const addOrder = (cartItems, totalAmount) => {
  return async (dispatch, getState) => {
    const userId = getState().auth.userId;

    const db = getFirestore()

    const date = new Date();

    let newId;
    

    await addDoc(collection(db, `users/${userId}/orders`), {
      cartItems: cartItems,
      totalAmount: totalAmount,
      date: date.toISOString()
    }).then(async(ref) => {
      newId = ref.id
    })

    await setDoc(doc(db, `orders/${newId}`), {
      userId: userId,
      cartItems: cartItems,
      totalAmount: totalAmount,
      date: date.toISOString()
    })

    /* cartItems.map(cartItem => 
      subject.) */
      try {
        const sendEmailFunction = firebase.functions().httpsCallable('sendAutomaticEmail');
        const { data } = await sendEmailFunction({
          recipientEmail: 'wasimibkhan@gmail.com', // Replace with the recipient's email address
          subject: 'Automatic Email from React Native',
          body: 'This is an automatic email sent from a React Native app using Firebase Cloud Functions!',
        });
  
      } catch (error) {
        console.log('Error', 'An error occurred. Please try again later.');
      }
      dispatch({
        type: ADD_ORDER,
        orderData: {
          id: newId,
          items: cartItems,
          amount: totalAmount,
          date: date
        }
      });

  };
};

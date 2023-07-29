import {getFirestore, getDocs, collection, doc, setDoc, addDoc, query, where } from "firebase/firestore"; 
import Order from '../../models/order';

export const ADD_ORDER = 'ADD_ORDER';
export const SET_ORDERS = 'SET_ORDERS';

import { httpsCallable, getFunctions } from 'firebase/functions';


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
    const functions = getFunctions()
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

    addDoc(collection(db, `mail`), {
      to: "wasimibkhan@gmail.com",
      message: {
        subject: `Your e-commerce order (${newId})`,
        text: "Your order will be arriving soon \n ",
      },
    }).then(async(ref) => {
      newId = ref.id
    })

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

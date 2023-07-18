import {getFirestore, getDocs, collection, addDoc, setDoc } from "firebase/firestore"; 
import Order from '../../models/order';

export const ADD_ORDER = 'ADD_ORDER';
export const SET_ORDERS = 'SET_ORDERS';

export const fetchOrders = () => {
  return async (dispatch, getState) => {
    const userId = getState().auth.userId;

    const db = getFirestore()

    const loadedOrders = []
    try {
      await getDocs(collection(db, `orders/${userId}`)).then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          loadedOrders.push(
              new Order(
                doc.id,
                doc.data().cardItems,
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

    await setDoc(collection(db, `orders/${userId}`), {
      cartItems: cartItems,
      totalAmount: totalAmount,
      date: date.toISOString()
    })

      dispatch({
        type: ADD_ORDER,
        orderData: {
          id: ordersRef.id,
          items: cartItems,
          amount: totalAmount,
          date: date
        }
      });

  };
};

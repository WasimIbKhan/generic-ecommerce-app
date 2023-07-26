import AsyncStorage from '@react-native-async-storage/async-storage';
import { initializeApp } from 'firebase/app';
import {getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, doc, setDoc } from 'firebase/firestore';

export const AUTHENTICATE = 'AUTHENTICATE';
export const LOGOUT = 'LOGOUT';
export const SET_DID_TRY_AL = 'SET_DID_TRY_AL';

let timer;




export const setDidTryAL = () => {
  return { type: SET_DID_TRY_AL };
};

export const authenticate = (userId, token) => {
  return dispatch => {
    dispatch({ type: AUTHENTICATE, userId: userId, token: token });
  };
};

export const signup = (email, fullname, phoneNumber, address, password) => {
  return async dispatch => {
    try {
      const auth = getAuth();
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;
      const userId = firebaseUser.uid;
      const idToken = await firebaseUser.getIdToken();

      const db = getFirestore()

      await setDoc(doc(db, 'users', userId), {
        email: email,
        phoneNumber: phoneNumber,
        fullName: fullname,
        address: address, 
        dateJoined: new Date().toString(),
      });

      dispatch(authenticate(userId, idToken));
      await saveDataToStorage(idToken, userId);
    } catch (error) {
      // Handle signup error
      console.log(error);
    }
  };
};

export const login = (email, password) => {
  return async dispatch => {
    try {
      const auth = getAuth();
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;
      const idToken = await firebaseUser.getIdToken();

      dispatch(authenticate(firebaseUser.uid, idToken));
      await saveDataToStorage(idToken, firebaseUser.uid);
    } catch (error) {
      // Handle login error
      console.log(error);
    }
  };
};

export const logout = () => {
  clearLogoutTimer();
  AsyncStorage.removeItem('userData');
  return { type: LOGOUT };
};

const clearLogoutTimer = () => {
  if (timer) {
    clearTimeout(timer);
  }
};

const setLogoutTimer = expirationTime => {
  return dispatch => {
    timer = setTimeout(() => {
      dispatch(logout());
    }, expirationTime);
  };
};

const saveDataToStorage = async(token, userId, expirationDate) => {
  const jsonValue = JSON.stringify({
    token: token,
    userId: userId
  });
  await AsyncStorage.setItem('userData', jsonValue);
};

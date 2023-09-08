import React, { useState } from 'react';
import AppLoading from "expo-app-loading";
import * as Font from "expo-font";
import { createStore, combineReducers, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import ReduxThunk from 'redux-thunk';
import productsReducer from './store/reducers/products';
import cartReducer from './store/reducers/cart';
import ordersReducer from './store/reducers/orders';
import authReducer from './store/reducers/auth';
import AppNavigator from './navigation/AppNavigator';
import ApiKeys from "./constants/ApiKeys";
import { initializeApp } from "firebase/app";
import "firebase/app"

const rootReducer = combineReducers({
  products: productsReducer,
  cart: cartReducer,
  orders: ordersReducer,
  auth: authReducer
});

const fetchFonts = () => {
  return Font.loadAsync({
    "open-sans": require("./assets/fonts/OpenSans-Regular.ttf"),
    "open-sans-bold": require("./assets/fonts/OpenSans-Bold.ttf"),
    "helvetica" : require("./assets/fonts/helvetica.ttf"),
    "arial" : require("./assets/fonts/arial.ttf"),
    "ionicons" : require('./node_modules/@expo/vector-icons/build/vendor/react-native-vector-icons/Fonts/Ionicons.ttf'),
  });
};

const store = createStore(rootReducer, applyMiddleware(ReduxThunk));

export default function App() {

  const [fontLoaded, setFontLoaded] = useState(false);

  if (!fontLoaded) {
    return (
      <AppLoading
        startAsync={fetchFonts}
        onFinish={() => setFontLoaded(true)}
        onError={console.warn}
      />
    );
  }

  initializeApp(ApiKeys.FirebaseConfig)
  return (
    <Provider store={store}>
      <AppNavigator />
    </Provider>
  );
}

import "../styles/globals.css";
import { configureStore } from "@reduxjs/toolkit";
import { Provider } from "react-redux";
import authReducer from "../state/authStates";

const store = configureStore({
  reducer: {
    auth: authReducer,
  },
});

import React from "react";

function MyApp({ Component, pageProps }) {
  return (
    <Provider store={store}>
      <Component {...pageProps} />
    </Provider>
  );
}

export default MyApp;

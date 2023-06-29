import "../styles/globals.css";
import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { PersistGate } from 'redux-persist/integration/react';
import authReducer from '../state/authStates';
import timerReducer from '../state/cacheStates';
import { FC } from 'react';

const persistConfig = {
  timeout: 2000,
  key: 'root',
  storage,
  whitelist: ['auth'],
};

const persistedAuthReducer = persistReducer(persistConfig, authReducer);
const persistedTimerReducer = persistReducer(persistConfig, timerReducer);

const store = configureStore({
  reducer: {
    auth: persistedAuthReducer,
    timer: persistedTimerReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // Disable serializability checks
    }),
});

const MyApp = ({ Component, pageProps }) => {
  const persistor = persistStore(store, { timeout: 43200 }); // Increase timeout to 10 seconds

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <Component {...pageProps} />
      </PersistGate>
    </Provider>
  );
};

export default MyApp;

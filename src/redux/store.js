import { combineReducers, configureStore, getDefaultMiddleware } from '@reduxjs/toolkit';
import { 
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER
} from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { persistStore } from 'redux-persist';

import authReducer from './authSlice';
import asyncListenerMiddleware from './asyncListenerMiddleware';
import authALM from './authALM';


export const makeStore = ({
  reducers = {},
  persistWhitelist = [],
  loadingComponent = null,
  postAuthFn = () => null,
} = {}) => {
  const persistConfig = {
    key: 'root',
    storage: storage,
    whitelist: ['auth'].concat(persistWhitelist),
    timeout: 2,
  }; 

  const rootReducer = combineReducers({
    ...reducers,
    auth: authReducer,
  });

  const store = configureStore({
    reducer: persistReducer(persistConfig, rootReducer),
    middleware: getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER]
      }
    }).concat(asyncListenerMiddleware(authALM(postAuthFn)))
  });
  const persistor = persistStore(store);
  return [store, persistor]
}
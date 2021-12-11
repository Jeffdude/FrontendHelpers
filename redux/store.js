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

import authReducer from './authSlice.js';
import inventoryReducer from './inventorySlice.js';

import asyncListenerMiddleware from './asyncListenerMiddleware.js';
import authALM from './authALM.js';

const persistConfig = {key: 'root', storage: storage, whitelist: ['auth'], timeout: 2}; 
const rootReducer = combineReducers({
  auth: authReducer,
  inventory: inventoryReducer,
});

export default configureStore({
  reducer: persistReducer(persistConfig, rootReducer),
  middleware: getDefaultMiddleware({
    serializableCheck: {
      ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER]
    }
  }).concat(asyncListenerMiddleware(authALM))
});

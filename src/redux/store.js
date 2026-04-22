import { configureStore } from "@reduxjs/toolkit";
import taskReducer from "../redux/taskSlice";
import { persistStore, persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

const persistConfig = {
    key: 'root',
    storage: storage.default ? storage.default : storage,
  };
  
  const persistedReducer = persistReducer(persistConfig, taskReducer);
  
  export const store = configureStore({
    reducer: {
      tasks: persistedReducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: {  
          ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
        },
      }),
  });
  
  export const persistor = persistStore(store);
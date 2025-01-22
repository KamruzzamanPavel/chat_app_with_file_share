import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { thunk } from "redux-thunk"; // Import thunk correctly
import authReducer from "./authSlice";
import messagesReducer from "./messageSlice";
import contactReducer from "./contactsSlice";
import {
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";

const persistConfig = {
  key: "root",
  storage,
 // blacklist: ["yourReducerContainingNonSerializableData"],
  // or use whitelist to explicitly persist only certain reducers
  whitelist: ["auth", "messages","contacts"],
};

const rootReducer = combineReducers({
  auth: authReducer,
  contacts: contactReducer,
  messages: messagesReducer,
  // Add other reducers as needed
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

// Configure middleware including redux-thunk
const customizedMiddleware = (getDefaultMiddleware) =>
  getDefaultMiddleware({
    serializableCheck: {
      ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      // Custom function to handle non-serializable values
      isSerializable: (value) => {
        // Check for non-serializable values, log and return false if found
        if (typeof value === "function") {
          console.error("Non-serializable value detected:", value);
          return false;
        }
        return true;
      },
    },
  }).concat(thunk); // Concatenate thunk middleware correctly

const store = configureStore({
  reducer: persistedReducer,
  middleware: customizedMiddleware,
});

const persistor = persistStore(store);

export { store, persistor };

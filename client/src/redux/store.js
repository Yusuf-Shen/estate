import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./user/userSlice.js"; // dont add {}

export default configureStore({
  reducer: { user: userReducer },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

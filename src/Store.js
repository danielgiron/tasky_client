import { configureStore } from "@reduxjs/toolkit";

import tasksReducer from "./features/TaskSlice.js";
// import userReducer from "./features/UserSlice.js";

export const store = configureStore({
  reducer: {
    tasks: tasksReducer,
    // user: userReducer,
  },
});

// import { configureStore } from '@reduxjs/toolkit';
// import todosReducer from './todosSlice';

// const store = configureStore({
//   reducer: {
//     todos: todosReducer,
//   },
// });

// // Export types for hooks
// export type RootState = ReturnType<typeof store.getState>;
// export type AppDispatch = typeof store.dispatch;

// export default store;


import { configureStore } from "@reduxjs/toolkit";
import todosReducer from "./todosSlice";

const store = configureStore({
  reducer: {
    todos: todosReducer,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export default store;


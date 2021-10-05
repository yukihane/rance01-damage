import { configureStore } from "@reduxjs/toolkit";
import { commonReducer } from "./commonSlice";
import { playerReducer } from "./playerSlice";

export const store = configureStore({
  reducer: {
    common: commonReducer,
    player: playerReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;

import { configureStore } from "@reduxjs/toolkit";
import { commonReducer } from "./commonSlice";
import { enemyReducer } from "./enemySlice";
import { playerReducer } from "./playerSlice";
import { remoteReducer } from "./remoteSlice";

export const store = configureStore({
  reducer: {
    common: commonReducer,
    player: playerReducer,
    enemy: enemyReducer,
    remote: remoteReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;

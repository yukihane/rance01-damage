import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export const PLAYER_CHIPS_LENGTH = 10;

export interface PlayerState {
  chips: string[];
  oneShot: boolean;
}

const initialState: PlayerState = {
  chips: Array(PLAYER_CHIPS_LENGTH).fill(""),
  oneShot: false,
};

type ChipStateChange = {
  row: number;
  value: string;
};

type OneShotChange = {
  oneShot: boolean;
};

export const playerSlice = createSlice({
  name: "player",
  initialState,
  reducers: {
    setPlayerChip: (state, action: PayloadAction<ChipStateChange>) => {
      state.chips[action.payload.row] = action.payload.value;
    },
    setOneShot: (state, action: PayloadAction<OneShotChange>) => {
      state.oneShot = action.payload.oneShot;
    },
  },
});

// Action creators are generated for each case reducer function
export const { setPlayerChip, setOneShot } = playerSlice.actions;

export const playerReducer = playerSlice.reducer;

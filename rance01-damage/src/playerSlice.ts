import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export const PLAYER_CHIPS_LENGTH = 10;

export interface PlayerState {
  chips: string[];
}

const initialState: PlayerState = {
  chips: Array(PLAYER_CHIPS_LENGTH).fill(""),
};

type ActionType = {
  row: number;
  value: string;
};

export const playerSlice = createSlice({
  name: "player",
  initialState,
  reducers: {
    setPlayerChip: (state, action: PayloadAction<ActionType>) => {
      state.chips[action.payload.row] = action.payload.value;
    },
  },
});

// Action creators are generated for each case reducer function
export const { setPlayerChip } = playerSlice.actions;

export const playerReducer = playerSlice.reducer;

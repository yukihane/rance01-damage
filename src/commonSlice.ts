import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface CommonState {
  turn: number;
}

const initialState: CommonState = {
  turn: 1,
};

export const commonSlice = createSlice({
  name: "common",
  initialState,
  reducers: {
    setTurn: (state, action: PayloadAction<number>) => {
      state.turn = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { setTurn } = commonSlice.actions;

export const commonReducer = commonSlice.reducer;

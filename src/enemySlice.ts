import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface EnemyState {
  attack: string;
  defense: string;
  honeyFlash: boolean;
}

const initialState: EnemyState = {
  attack: "",
  defense: "",
  honeyFlash: false,
};

type AttackChange = {
  value: string;
};

type DefenceChange = AttackChange;

type HoneyFlashChange = {
  value: boolean;
};

export const enemySlice = createSlice({
  name: "enemy",
  initialState,
  reducers: {
    setEnemyAttack: (state, action: PayloadAction<AttackChange>) => {
      state.attack = action.payload.value;
    },
    setEnemyDefense: (state, action: PayloadAction<DefenceChange>) => {
      state.defense = action.payload.value;
    },
    setHoneyFlash: (state, action: PayloadAction<HoneyFlashChange>) => {
      state.honeyFlash = action.payload.value;
    },
  },
});

// Action creators are generated for each case reducer function
export const { setEnemyAttack, setEnemyDefense, setHoneyFlash } =
  enemySlice.actions;

export const enemyReducer = enemySlice.reducer;

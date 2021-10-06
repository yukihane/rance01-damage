import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { invoke } from "@tauri-apps/api";
import { RootState } from "./store";

type Param = {
  common: {
    turn: number;
  };
  player: {
    chips: string[];
    oneShot: boolean;
  };
  enemy: {
    atack: string;
    defense: string;
    honeyFlash: boolean;
  };
};

type Damage = {
  min: number;
  max: number;
};

type Result = {
  playerDamege: Damage;
  enemyDamage: Damage;
};

// https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/Math/random#getting_a_random_integer_between_two_values
const getRandomInt = (min: number, max: number): number => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
};

export const calculateDamege = createAsyncThunk<
  Result,
  void,
  { state: RootState }
>("remote/calculateDamege", async (_: void, { getState }) => {
  const state = getState();
  //   return await invoke<Result>("calculate_damege", { param });
  console.log(state.player.oneShot);
  return new Promise<Result>((resolve, reject) => {
    const player = getRandomInt(0, 100);
    const enemy = getRandomInt(5, 1000);
    console.log("resolve");
    resolve({
      playerDamege: { min: player, max: player + 10 },
      enemyDamage: { min: enemy, max: enemy + 50 },
    });
  });
});

interface RemoteState {
  result: Result;
}

const initialState: RemoteState = {
  result: { playerDamege: { min: 0, max: 0 }, enemyDamage: { min: 0, max: 0 } },
};

const remoteSlice = createSlice({
  name: "remote",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(calculateDamege.fulfilled, (state, action) => {
      console.log("fullfilled");
      state.result = action.payload;
    });
  },
});

export const remoteReducer = remoteSlice.reducer;

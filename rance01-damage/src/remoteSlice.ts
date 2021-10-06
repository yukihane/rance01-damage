import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { invoke } from "@tauri-apps/api";
import { RootState } from "./store";
import { Damage } from "./types";

type Param = {
  common: {
    turn: number;
  };
  player: {
    chips: string[];
    oneShot: boolean;
  };
  enemy: {
    attack: string;
    defense: string;
    honeyFlash: boolean;
  };
};

type Result = {
  playerDamage: Damage;
  enemyDamage: Damage;
};

// https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/Math/random#getting_a_random_integer_between_two_values
const getRandomInt = (min: number, max: number): number => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
};

export const calculateDamage = createAsyncThunk<
  Result,
  void,
  { state: RootState }
>("remote/calculateDamage", async (_: void, { getState }) => {
  const param: Param = getState();

  return invoke<Result>("calculate_damage", { param });
  // console.log(state.player.oneShot);
  // return new Promise<Result>((resolve, reject) => {
  //   const player = getRandomInt(0, 100);
  //   const enemy = getRandomInt(5, 1000);
  //   console.log("resolve");
  //   resolve({
  //     playerDamage: { min: player, max: player + 10 },
  //     enemyDamage: { min: enemy, max: enemy + 50 },
  //   });
  // });
});

interface RemoteState {
  result: Result;
}

const initialState: RemoteState = {
  result: { playerDamage: { min: 0, max: 0 }, enemyDamage: { min: 0, max: 0 } },
};

const remoteSlice = createSlice({
  name: "remote",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(calculateDamage.fulfilled, (state, action) => {
      console.log("fullfilled");
      state.result = action.payload;
    });
  },
});

export const remoteReducer = remoteSlice.reducer;

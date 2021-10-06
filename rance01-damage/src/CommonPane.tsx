import { ChangeEvent } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setTurn } from "./commonSlice";
import { calculateDamege } from "./remoteSlice";
import { RootState } from "./store";

export const CommonPane = () => {
  const turn = useSelector((state: RootState) => state.common.turn);
  const dispatch = useDispatch();

  const handleTurnChanged = (e: ChangeEvent<HTMLInputElement>) => {
    const turn = parseInt(e.target.value);
    dispatch(setTurn(turn));
    dispatch(calculateDamege());
  };

  return (
    <div>
      <label>
        ターン
        <input
          type="number"
          name="turn"
          id="turn"
          value={turn}
          onChange={handleTurnChanged}
        />
      </label>
    </div>
  );
};

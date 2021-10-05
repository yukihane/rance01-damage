import { ChangeEvent } from "react";
import { useDispatch, useSelector } from "react-redux";
import { PLAYER_CHIPS_LENGTH, setOneShot, setPlayerChip } from "./playerSlice";
import { RootState } from "./store";

export const PlayerPane = () => {
  const { chips, oneShot } = useSelector((state: RootState) => state.player);
  const dispatch = useDispatch();

  const handleChipChanged = (e: ChangeEvent<HTMLInputElement>, row: number) => {
    dispatch(setPlayerChip({ row, value: e.target.value }));
  };

  const handleOneShotClicked = () => {
    dispatch(setOneShot({ oneShot: !oneShot }));
  };

  const chipRow = Array(PLAYER_CHIPS_LENGTH)
    .fill(0)
    .map((_, i) => (
      <div key={i}>
        <label>
          {i}
          <input
            type="text"
            name={"playerChips" + i}
            id={"playerChips" + i}
            value={chips[i]}
            onChange={(e) => handleChipChanged(e, i)}
          />
        </label>
      </div>
    ));
  return (
    <>
      <div>{chipRow}</div>
      <div>
        <label>
          一発屋
          <input
            type="checkbox"
            name="oneShot"
            id="oneShot"
            checked={oneShot}
            onClick={handleOneShotClicked}
          />
        </label>
      </div>
    </>
  );
};

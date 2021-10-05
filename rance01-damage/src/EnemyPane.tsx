import { ChangeEvent } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setEnemyAttack, setEnemyDefense, setHoneyFlash } from "./enemySlice";
import { RootState } from "./store";

export const EnemyPane = () => {
  const { attack, defense, honeyFlash } = useSelector(
    (state: RootState) => state.enemy
  );
  const dispatch = useDispatch();

  const handleAttackChanged = (e: ChangeEvent<HTMLInputElement>) => {
    dispatch(setEnemyAttack({ value: e.target.value }));
  };

  const handleDefenseChanged = (e: ChangeEvent<HTMLInputElement>) => {
    dispatch(setEnemyDefense({ value: e.target.value }));
  };

  const handleHoneyFlashClicked = () => {
    dispatch(setHoneyFlash({ value: !honeyFlash }));
  };

  return (
    <div>
      <div>
        <label>
          攻
          <input
            type="text"
            name="enemyAtack"
            id="enemyAtack"
            value={attack}
            onChange={handleAttackChanged}
          />
        </label>
      </div>
      <div>
        <label>
          防
          <input
            type="text"
            name="enemyDefense"
            id="enemyDefense"
            value={defense}
            onChange={handleDefenseChanged}
          />
        </label>
      </div>
      <div>
        <label>
          ハニーフラッシュ
          <input
            type="checkbox"
            name="honeyFlash"
            id="honeyFlash"
            checked={honeyFlash}
            onChange={handleHoneyFlashClicked}
          />
        </label>
      </div>
    </div>
  );
};

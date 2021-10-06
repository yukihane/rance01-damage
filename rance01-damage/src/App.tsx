import { useSelector } from "react-redux";
import { CommonPane } from "./CommonPane";
import { EnemyPane } from "./EnemyPane";
import { PlayerPane } from "./PlayerPane";
import { ResultPane } from "./ResultPane";
import { RootState } from "./store";

export const App = () => {
  const { playerDamege, enemyDamage } = useSelector(
    (state: RootState) => state.remote.result
  );

  return (
    <div>
      <div id="commonPane">
        <CommonPane />
      </div>
      <div id="playerPane">
        <PlayerPane />
      </div>
      <div id="enemyPane">
        <EnemyPane />
      </div>
      <div id="playerDamagePane">
        <ResultPane title="プレーヤー" value={playerDamege} />
      </div>
      <div id="enemyDamagePane">
        <ResultPane title="敵" value={enemyDamage} />
      </div>
    </div>
  );
};

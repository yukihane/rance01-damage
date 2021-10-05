import { CommonPane } from "./CommonPane";
import { EnemyPane } from "./EnemyPane";
import { PlayerPane } from "./PlayerPane";
import logo from "./logo.svg";

export const App = () => {
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
    </div>
  );
};

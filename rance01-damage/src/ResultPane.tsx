import { FC } from "react";
import { useSelector } from "react-redux";
import { RootState } from "./store";
import { Damage } from "./types";

type Props = {
  title: string;
  value: Damage;
};

export const ResultPane: FC<Props> = ({ title, value }) => {
  const damage = useSelector(
    (state: RootState) => state.remote.result.playerDamage
  );

  return (
    <div>
      <label>
        {title}
        <table>
          <tr>
            <th>最小</th>
            <th>最大</th>
          </tr>
          <tr>
            <td>{value.min}</td>
            <td>{value.max}</td>
          </tr>
        </table>
      </label>
    </div>
  );
};

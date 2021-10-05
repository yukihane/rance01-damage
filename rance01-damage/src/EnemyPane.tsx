export const EnemyPane = () => {
  return (
    <div>
      <div>
        <label>
          攻<input type="text" name="enemyAtack" id="enemyAtack" />
        </label>
      </div>
      <div>
        <label>
          防<input type="text" name="enemyDefense" id="enemyDefense" />
        </label>
      </div>
      <div>
        <label>
          ハニーフラッシュ
          <input type="checkbox" name="honeyFlash" id="honeyFlash" />
        </label>
      </div>
    </div>
  );
};

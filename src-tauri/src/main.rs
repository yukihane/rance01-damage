// http://alice.xfu.jp/doku.php?id=%E3%83%A9%E3%83%B3%E3%82%B901:%E6%88%A6%E9%97%98
// を参考に計算処理を行う

#![cfg_attr(
  all(not(debug_assertions), target_os = "windows"),
  windows_subsystem = "windows"
)]

use std::collections::HashMap;

use anyhow::{Context, Result};
use regex::Regex;
use serde::{Deserialize, Serialize};
use std::cmp::max;

#[derive(Deserialize, Debug)]
#[serde(rename_all = "camelCase")]
struct Common {
  turn: i32,
}

#[derive(Deserialize, Debug)]
#[serde(rename_all = "camelCase")]
struct Player {
  chips: Vec<String>,
  one_shot: bool,
}

#[derive(Deserialize, Debug)]
#[serde(rename_all = "camelCase")]
struct Enemy {
  attack: String,
  defense: String,
  honey_flash: bool,
}

#[derive(Deserialize, Debug)]
#[serde(rename_all = "camelCase")]
struct Param {
  common: Common,
  player: Player,
  enemy: Enemy,
}

#[derive(Serialize, Debug)]
#[serde(rename_all = "camelCase")]
struct Damage {
  min: i32,
  normal: i32,
  max: i32,
}

#[derive(Serialize, Debug)]
#[serde(rename_all = "camelCase")]
struct Response {
  player_damage: Damage,
  enemy_damage: Damage,
}

#[derive(Debug, PartialEq)]
struct PlayerChip {
  /// 攻撃値なら true, 防御値なら false
  is_attack: bool,
  /// 値
  value: i32,
  /// 弱点属性なら true (本来なら攻撃に対してのみ付与される属性だがチェックしていない)
  is_weak: bool,
}

/// player のチップ情報をパースします。
fn parse_player_chip_text(text: &str) -> Result<PlayerChip> {
  let re = Regex::new(r"([ad]?)(\d+)(w?)")?;
  let cap = re.captures(text).with_context(|| "not match")?;
  let is_attack = &cap[1] != "d";
  let value = cap[2].parse::<i32>()?;
  let is_weak = !cap[3].is_empty();

  Ok(PlayerChip {
    is_attack,
    value,
    is_weak,
  })
}

fn calculate_player_chips(chips: &Vec<String>) -> Option<(i32, i32)> {
  chips
    .iter()
    .map(|chip| parse_player_chip_text(chip))
    .map(|r| {
      r.and_then(|c| {
        let value = if c.is_weak { c.value * 3 } else { c.value };
        if c.is_attack {
          Ok((value, 0))
        } else {
          Ok((0, value))
        }
      })
    })
    .filter_map(Result::ok)
    .reduce(|x, y| (x.0 + y.0, x.1 + y.1))
}

fn calculate_damage_internal(param: &Param) -> Result<Response> {
  let player_chips_total = calculate_player_chips(&param.player.chips).unwrap_or((0, 0));

  let player_attack_min = (player_chips_total.0 as f64 * 0.95) as i32;

  // 一発屋が有るなら x2.4, 無いなら 1.6
  let critical = if param.player.one_shot { 2.4 } else { 1.6 };
  let player_attack_max = (player_chips_total.0 as f64 * 1.05 * critical) as i32;

  // 敵のハニーフラッシュ属性攻撃は防御値 x0.05
  let honey_flash = if param.enemy.honey_flash { 0.05 } else { 1.0 };
  let player_defense_min = (player_chips_total.1 as f64 * 0.95 * honey_flash) as i32;

  let player_defense_max = (player_chips_total.1 as f64 * 1.05) as i32;

  let mut enemy_strongness = HashMap::new();
  enemy_strongness.insert(
    "D".to_string(),
    Damage {
      min: 0,
      normal: 20,
      max: 39,
    },
  );
  enemy_strongness.insert(
    "D+".to_string(),
    Damage {
      min: 40,
      normal: 60,
      max: 79,
    },
  );
  enemy_strongness.insert(
    "C".to_string(),
    Damage {
      min: 80,
      normal: 100,
      max: 119,
    },
  );
  enemy_strongness.insert(
    "C+".to_string(),
    Damage {
      min: 120,
      normal: 155,
      max: 189,
    },
  );
  enemy_strongness.insert(
    "B".to_string(),
    Damage {
      min: 190,
      normal: 220,
      max: 249,
    },
  );
  enemy_strongness.insert(
    "B+".to_string(),
    Damage {
      min: 250,
      normal: 295,
      max: 339,
    },
  );
  enemy_strongness.insert(
    "A".to_string(),
    Damage {
      min: 340,
      normal: 375,
      max: 409,
    },
  );
  enemy_strongness.insert(
    "A+".to_string(),
    Damage {
      min: 410,
      normal: 475,
      max: 539,
    },
  );
  enemy_strongness.insert(
    "S".to_string(),
    Damage {
      min: 540,
      normal: 590,
      max: 639,
    },
  );
  enemy_strongness.insert(
    "S+".to_string(),
    Damage {
      min: 640,
      normal: 715,
      max: 789,
    },
  );

  let damage0 = Damage {
    min: 0,
    normal: 0,
    max: 0,
  };

  let enemy_attack = enemy_strongness
    .get(&param.enemy.attack)
    .unwrap_or(&damage0);

  let enemy_defense = enemy_strongness
    .get(&param.enemy.defense)
    .unwrap_or(&damage0);

  Ok(Response {
    enemy_damage: Damage {
      min: max(player_attack_min - enemy_defense.max, 0),
      normal: max(player_chips_total.0 - enemy_defense.normal, 0),
      max: max(player_attack_max - enemy_defense.min, 0),
    },
    player_damage: Damage {
      min: max(enemy_attack.min - player_defense_max, 0),
      normal: max(enemy_attack.normal - player_chips_total.1, 0),
      max: max(enemy_attack.max - player_defense_min, 0),
    },
  })
}

#[tauri::command]
fn calculate_damage(param: Param) -> Response {
  println!("param: {:?}", param);

  let response = calculate_damage_internal(&param);

  match response {
    Ok(res) => res,
    Err(e) => {
      println!("{:?}", e);
      Response {
        player_damage: Damage {
          min: 0,
          normal: 0,
          max: 0,
        },
        enemy_damage: Damage {
          min: 0,
          normal: 0,
          max: 0,
        },
      }
    }
  }
}

fn main() {
  tauri::Builder::default()
    .invoke_handler(tauri::generate_handler![calculate_damage])
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}

#[cfg(test)]
mod tests {
  use super::*;

  #[test]
  fn test_parse() {
    let res = parse_player_chip_text("100");
    assert_eq!(
      res.unwrap(),
      PlayerChip {
        is_attack: true,
        value: 100,
        is_weak: false
      }
    );

    let res = parse_player_chip_text("a1");
    assert_eq!(
      res.unwrap(),
      PlayerChip {
        is_attack: true,
        value: 1,
        is_weak: false
      }
    );

    let res = parse_player_chip_text("d33w");
    assert_eq!(
      res.unwrap(),
      PlayerChip {
        is_attack: false,
        value: 33,
        is_weak: true
      }
    );
  }
}

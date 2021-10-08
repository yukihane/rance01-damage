#![cfg_attr(
  all(not(debug_assertions), target_os = "windows"),
  windows_subsystem = "windows"
)]

use anyhow::{Context as _, Result};
use regex::Regex;
use serde::{Deserialize, Serialize};
use std::error::Error;

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
  max: i32,
}

#[derive(Serialize, Debug)]
#[serde(rename_all = "camelCase")]
struct Response {
  player_damage: Damage,
  enemy_damage: Damage,
}

struct Total {
  attack: i32,
  defense: i32,
}

fn parse(text: &str) -> Result<(bool, i32, bool)> {
  let re = Regex::new(r"([ad]?)(\d+)(w?)")?;
  let cap = re.captures(text).with_context(|| "not match")?;
  let is_attack = &cap[1] != "d";
  let num = cap[2].parse::<i32>()?;
  let is_weak = !cap[3].is_empty();

  Ok((is_attack, num, is_weak))
}

fn calculate_damage_internal(param: &Param) -> Result<Response> {
  Ok(Response {
    enemy_damage: Damage { min: 0, max: 0 },
    player_damage: Damage { min: 0, max: 0 },
  })
}

#[tauri::command]
fn calculate_damage(param: Param) /*-> Response*/
{
  println!("param: {:?}", param);

  let response = calculate_damage_internal(&param);

  let re = Regex::new(r"(a|d)?(\d+)(w)?").unwrap();

  // const res = RE.is_match("a10w");

  // let iter = param.player.chips.iter().map(|x| {
  //   if x.contains("d") {
  //   } else {
  //   }
  // });
  // Response {
  //   player_damage: Damage { min: 10, max: 20 },
  //   enemy_damage: Damage { min: 30, max: 40 },
  // }
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
    let res = parse("100");
    assert_eq!(res.unwrap(), (true, 100, false));

    let res = parse("a1");
    assert_eq!(res.unwrap(), (true, 1, false));

    let res = parse("d33w");
    assert_eq!(res.unwrap(), (false, 33, true));
  }
}

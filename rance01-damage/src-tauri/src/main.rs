#![cfg_attr(
  all(not(debug_assertions), target_os = "windows"),
  windows_subsystem = "windows"
)]

use serde::{Deserialize, Serialize};

use lazy_static::lazy_static;
use regex::Regex;

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

fn calcurate_damage_internal(param: &Param) -> std::result::Result<Response, std::io::Error> {
  let re = Regex::new(r"(a|d)?(\d+)(w)?")?;
}

#[tauri::command]
fn calculate_damage(param: Param) /*-> Response*/
{
  println!("param: {:?}", param);

  let response = calcurate_damage_internal(&param);

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

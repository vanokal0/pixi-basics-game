import { Ticker } from "pixi.js";

export interface MovableCharacter {
  move(dt: Ticker): void;
}

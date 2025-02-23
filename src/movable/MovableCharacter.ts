import { Point, Ticker } from "pixi.js";

export interface MovableCharacter {
  get position(): Point;
  getNextPosition(dt: Ticker): Point;
  moveTo(point: Point): void;
  play(): void;
}

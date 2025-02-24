import { Point } from "pixi.js";

export interface MovableCharacter {
  get position(): Point;
  getNextPosition(dt: number): Point;
  moveTo(point: Point): void;
}

import { Point } from "pixi.js";

export interface Movable {
  get position(): Point;
  getNextPosition(dt: number): Point;
  moveTo(point: Point): void;
}

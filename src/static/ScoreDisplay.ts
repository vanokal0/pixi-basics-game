import { Container, Point, Text } from "pixi.js";
import {
  StyleInitializer,
  StyleType,
} from "../utils/initializers/StyleInitializer";

export class ScoreDisplay extends Container {
  private _scoreText: Text;
  private _levelScore: number = 0;

  constructor(position: Point) {
    super();

    this._scoreText = new Text({
      text: `Score: ${this._levelScore}`,
      style: StyleInitializer.getStyle(StyleType.TEXT_HEADING),
    });
    this.addChild(this._scoreText);
    this.position.set(position.x / 2 - this.width / 2, 0);
  }

  get levelScore(): number {
    return this._levelScore;
  }

  set levelScore(value: number) {
    this._levelScore = value;
    this._scoreText.text = `Score: ${this._levelScore}`;
  }
}

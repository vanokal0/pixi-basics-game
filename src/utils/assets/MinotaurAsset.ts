import { AnimatedSpriteFrames } from "pixi.js";

export interface MinotaurAsset {
  animations: {
    idle: AnimatedSpriteFrames;
    walk: AnimatedSpriteFrames;
    attack: AnimatedSpriteFrames;
  };
}

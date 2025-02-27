import { AnimatedSpriteFrames } from "pixi.js";

export interface CitizenAsset {
  animations: {
    citizen_front_idle: AnimatedSpriteFrames;
    citizen_front_walk: AnimatedSpriteFrames;
    citizen_back_idle: AnimatedSpriteFrames;
    citizen_back_walk: AnimatedSpriteFrames;
    citizen_side_idle: AnimatedSpriteFrames;
    citizen_side_walk: AnimatedSpriteFrames;
    citizen_front_greeting: AnimatedSpriteFrames;
  };
}

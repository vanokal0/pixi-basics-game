import {
  AnimatedSprite,
  Container,
  AnimatedSpriteFrames,
  Point,
  Ticker,
} from "pixi.js";
import { MovableCharacter } from "./MovableCharacter";

export class MovableCitizen extends Container implements MovableCharacter {
  static readonly INITIAL_SCALE: number = 0.15;
  static readonly INITIAL_POSITION: Point = new Point(50, 50);
  static readonly INITIAL_SPEED: number = 30;
  static readonly INITIAL_ANIMATION_SPEED: number = 0.6;

  static readonly ASSETS_PATH: string = "../../resources/citizen/citizen.json";

  static _citizenAsset: CitizenAsset | undefined;

  private _speed: number;
  private _activeSprite: AnimatedSprite;
  private _animatedSpriteMap: Map<AnimationType, AnimatedSprite>;
  private _userInputMap: Map<string, boolean>;

  public constructor(
    animatedSpriteMap: Map<AnimationType, AnimatedSprite>,
    initialAnimation: AnimationType
  ) {
    super();
    this.x = MovableCitizen.INITIAL_POSITION.x;
    this.y = MovableCitizen.INITIAL_POSITION.y;
    this._speed = MovableCitizen.INITIAL_SPEED;
    this.scale = MovableCitizen.INITIAL_SCALE;
    this._animatedSpriteMap = animatedSpriteMap;

    this._userInputMap = new Map<string, boolean>();
    this.attachKeyInputListeners(this._userInputMap);

    const initialAnimatedSprite: AnimatedSprite | undefined =
      animatedSpriteMap.get(initialAnimation);
    if (!initialAnimatedSprite) {
      throw new Error("Initial animation is missing in animatedSpriteMap.");
    }
    this._activeSprite = animatedSpriteMap.get(initialAnimation)!;
    this.addChild(this._activeSprite);
  }

  public play(): void {
    this._activeSprite.play();
  }

  public move(dt: Ticker): void {
    let hasMoved: boolean = false;

    if (this._userInputMap.get("ArrowLeft")) {
      // if (!this._activeSprite.texture.label?.includes("side_walk"))
      this.replaceAnimation(AnimationType.LEFT_WALK);
      this._activeSprite.position.x -= dt.deltaTime * this._speed;
      hasMoved = true;
    }
    if (this._userInputMap.get("ArrowRight")) {
      this.replaceAnimation(AnimationType.RIGHT_WALK);
      this._activeSprite.position.x += dt.deltaTime * this._speed;
      hasMoved = true;
    }
    if (this._userInputMap.get("ArrowDown")) {
      this.replaceAnimation(AnimationType.FRONT_WALK);
      this._activeSprite.position.y += dt.deltaTime * this._speed;
      hasMoved = true;
    }
    if (this._userInputMap.get("ArrowUp")) {
      this.replaceAnimation(AnimationType.BACK_WALK);
      this._activeSprite.position.y -= dt.deltaTime * this._speed;
      hasMoved = true;
    }

    if (!hasMoved) {
      this.replaceAnimation(AnimationType.FRONT_IDLE);
    }
  }

  private replaceAnimation(animationType: AnimationType) {
    const newSprite: AnimatedSprite | undefined =
      this._animatedSpriteMap.get(animationType);

    if (!newSprite) {
      throw new Error("Animation is missing in animatedSpriteMap.");
    }

    this.removeChild(this._activeSprite);
    newSprite.position.x = this._activeSprite.position.x;
    newSprite.position.y = this._activeSprite.position.y;

    this.addChild(newSprite);
    newSprite.play();
    this._activeSprite = newSprite;
  }

  private attachKeyInputListeners(keymap: Map<string, boolean>) {
    document.addEventListener("keydown", (e) => {
      keymap.set(e.code, true);
    });

    document.addEventListener("keyup", (e) => {
      keymap.set(e.code, false);
    });
  }
}

export interface CitizenAsset {
  animations: {
    citizen_front_idle: AnimatedSpriteFrames;
    citizen_front_walk: AnimatedSpriteFrames;
    citizen_back_idle: AnimatedSpriteFrames;
    citizen_back_walk: AnimatedSpriteFrames;
    citizen_side_idle: AnimatedSpriteFrames;
    citizen_side_walk: AnimatedSpriteFrames;
  };
}

export enum AnimationType {
  FRONT_IDLE,
  FRONT_WALK,

  BACK_IDLE,
  BACK_WALK,

  LEFT_IDLE,
  LEFT_WALK,

  RIGHT_IDLE,
  RIGHT_WALK,
}

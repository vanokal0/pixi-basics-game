import { AnimatedSprite, Container, Point, Ticker } from "pixi.js";
import { MovableCharacter } from "./MovableCharacter";

export class MovableCitizen extends Container implements MovableCharacter {
  static readonly INITIAL_SCALE: number = 0.15;
  static readonly INITIAL_POSITION: Point = new Point(100, 100);
  static readonly INITIAL_SPEED: number = 30;
  static readonly INITIAL_ANIMATION_SPEED: number = 0.3;

  static readonly ASSETS_PATH: string = "../../resources/citizen/citizen.json";

  private _speed: number;
  private _activeSprite: AnimatedSprite;
  private _animatedSpriteMap: Map<CitizenAnimationType, AnimatedSprite>;
  private _userInputMap: Map<string, boolean>;

  public constructor(
    animatedSpriteMap: Map<CitizenAnimationType, AnimatedSprite>,
    initialAnimation: CitizenAnimationType
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
      throw new Error("Initial animation is missing in a sprite map.");
    }
    this._activeSprite = animatedSpriteMap.get(initialAnimation)!;
    this._activeSprite.animationSpeed = MovableCitizen.INITIAL_ANIMATION_SPEED;
    this.addChild(this._activeSprite);
  }

  public play(): void {
    this._activeSprite.play();
  }

  public move(dt: Ticker): void {
    let hasMoved: boolean = false;

    if (this._userInputMap.get("ArrowLeft")) {
      this.replaceAnimation(CitizenAnimationType.LEFT_WALK);
      this._activeSprite.position.x -= dt.deltaTime * this._speed;
      hasMoved = true;
    }
    if (this._userInputMap.get("ArrowRight")) {
      this.replaceAnimation(CitizenAnimationType.RIGHT_WALK);
      this._activeSprite.position.x += dt.deltaTime * this._speed;
      hasMoved = true;
    }
    if (this._userInputMap.get("ArrowDown")) {
      this.replaceAnimation(CitizenAnimationType.FRONT_WALK);
      this._activeSprite.position.y += dt.deltaTime * this._speed;
      hasMoved = true;
    }
    if (this._userInputMap.get("ArrowUp")) {
      this.replaceAnimation(CitizenAnimationType.BACK_WALK);
      this._activeSprite.position.y -= dt.deltaTime * this._speed;
      hasMoved = true;
    }

    if (!hasMoved) {
      this.replaceAnimation(CitizenAnimationType.FRONT_IDLE);
    }
  }

  private replaceAnimation(animationType: CitizenAnimationType) {
    const newSprite: AnimatedSprite | undefined =
      this._animatedSpriteMap.get(animationType);

    if (!newSprite) {
      throw new Error("Animation is missing in a sprite map.");
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

export enum CitizenAnimationType {
  FRONT_IDLE,
  FRONT_WALK,

  BACK_IDLE,
  BACK_WALK,

  LEFT_IDLE,
  LEFT_WALK,

  RIGHT_IDLE,
  RIGHT_WALK,
}

import { AnimatedSprite, Point } from "pixi.js";
import { MovableCharacter } from "./MovableCharacter";

export class MovableCitizen extends MovableCharacter<CitizenAnimationType> {
  static readonly DEFAULT_SCALE: number = 0.15;
  static readonly DEFAULT_POSITION: Point = new Point(200, 200);
  static readonly DEFAULT_SPEED: number = 3;
  static readonly DEFAULT_ANIMATION_SPEED: number = 0.5;
  static readonly DEFAULT_Z_INDEX: number = 2;

  private _userInputMap: Map<string, boolean>;
  private _canMove;

  public constructor(
    animatedSpriteMap: Map<CitizenAnimationType, AnimatedSprite>
  ) {
    super();

    this.position.set(
      MovableCitizen.DEFAULT_POSITION.x,
      MovableCitizen.DEFAULT_POSITION.y
    );

    this._speed = MovableCitizen.DEFAULT_SPEED;
    this.scale = MovableCitizen.DEFAULT_SCALE;
    this._animatedSpriteMap = animatedSpriteMap;

    this._userInputMap = new Map<string, boolean>();
    this.attachKeyInputListeners(this._userInputMap);

    const initialAnimatedSprite: AnimatedSprite | undefined =
      animatedSpriteMap.get(CitizenAnimationType.FRONT_IDLE);
    if (!initialAnimatedSprite) {
      throw new Error("Initial animation is missing in a sprite map.");
    }
    this._activeSprite = initialAnimatedSprite;
    this._activeSprite.animationSpeed = MovableCitizen.DEFAULT_ANIMATION_SPEED;
    this.zIndex = MovableCitizen.DEFAULT_Z_INDEX;
    this._canMove = true;
    this._activeSprite.play();
    this.addChild(this._activeSprite);
  }

  public getNextPosition(dt: number): Point {
    if (!this._canMove) {
      return this._position;
    }

    let hVelocity: number = 0;
    let vVelocity: number = 0;

    if (this._userInputMap.get("ArrowLeft")) {
      this.replaceAnimation(CitizenAnimationType.LEFT_WALK);
      hVelocity = -1;
    }
    if (this._userInputMap.get("ArrowRight")) {
      this.replaceAnimation(CitizenAnimationType.RIGHT_WALK);
      hVelocity = 1;
    }
    if (this._userInputMap.get("ArrowDown")) {
      this.replaceAnimation(CitizenAnimationType.FRONT_WALK);
      vVelocity = 1;
    }
    if (this._userInputMap.get("ArrowUp")) {
      this.replaceAnimation(CitizenAnimationType.BACK_WALK);
      vVelocity = -1;
    }

    const length = Math.hypot(hVelocity, vVelocity);
    if (length > 0) {
      hVelocity = (hVelocity / length) * this._speed;
      vVelocity = (vVelocity / length) * this._speed;
    } else {
      this.replaceAnimation(CitizenAnimationType.FRONT_IDLE);
    }

    const nextPosition = new Point(
      this.position.x + hVelocity * dt,
      this.position.y + vVelocity * dt
    );
    return nextPosition;
  }

  public kill() {
    this._canMove = false;
    this.replaceAnimation(CitizenAnimationType.DEAD);
    if (this._activeSprite) this._activeSprite.stop();
  }

  public notify(event: string): void {
    switch (event) {
      case "gameOver":
        this._canMove = false;
        this.replaceAnimation(CitizenAnimationType.FRONT_IDLE);
    }
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

  DEAD,
}

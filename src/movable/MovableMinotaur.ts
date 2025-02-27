import { AnimatedSprite, Container, Point } from "pixi.js";
import { MovableCitizen } from "./MovableCitizen";
import { MovableCharacter } from "./MovableCharacter";

export class MovableMinotaur extends MovableCharacter<MinotaurAnimationType> {
  static readonly DEFAULT_SCALE: number = 0.3;
  static readonly DEFAULT_SPEED: number = 2;
  static readonly DEFAULT_ANIMATION_SPEED: number = 0.5;
  static readonly DEFAULT_Z_INDEX: number = 1;
  static readonly DEFAULT_ATTACK_DISTANCE = 50;

  private _isInRange: boolean;
  private _isAttacking: boolean;
  private _activeTarget: Container | undefined;

  constructor(
    animatedSpriteMap: Map<MinotaurAnimationType, AnimatedSprite>,
    initialAnimation: MinotaurAnimationType,
    initialPosition: Point
  ) {
    super();
    this.position.set(initialPosition.x, initialPosition.y);

    this._speed = MovableMinotaur.DEFAULT_SPEED;
    this.scale = MovableMinotaur.DEFAULT_SCALE;
    this._animatedSpriteMap = animatedSpriteMap;

    const initialAnimatedSprite: AnimatedSprite | undefined =
      animatedSpriteMap.get(initialAnimation);
    if (!initialAnimatedSprite) {
      throw new Error("Initial animation is missing in a sprite map.");
    }
    this._activeSprite = animatedSpriteMap.get(initialAnimation)!;
    this._activeSprite.animationSpeed = MovableMinotaur.DEFAULT_ANIMATION_SPEED;
    this.zIndex = MovableMinotaur.DEFAULT_Z_INDEX;
    this._isInRange = false;
    this._isAttacking = false;
    this._activeSprite.play();
    this.addChild(this._activeSprite);
  }

  public getNextPosition(dt: number): Point {
    if (!this._activeTarget) {
      return this.position;
    }
    const directionX = this._activeTarget.x - this.x;
    const directionY = this._activeTarget.y - this.y;
    const distance = Math.sqrt(directionX ** 2 + directionY ** 2);

    if (distance < MovableMinotaur.DEFAULT_ATTACK_DISTANCE) {
      this._isInRange = true;
      return new Point(this.x, this.y);
    }

    if (directionX > 0) {
      this.replaceAnimation(MinotaurAnimationType.WALK_RIGHT);
    } else {
      this.replaceAnimation(MinotaurAnimationType.WALK_LEFT);
    }

    return new Point(
      this.x + (directionX / distance) * this._speed * dt,
      this.y + (directionY / distance) * this._speed * dt
    );
  }

  public attack(): void {
    const target = this._activeTarget;
    if (this._isAttacking || !target) {
      return;
    }

    this._isAttacking = true;

    if (target.x - this.x < 0) {
      this.replaceAnimation(MinotaurAnimationType.ATTACK_LEFT);
    } else {
      this.replaceAnimation(MinotaurAnimationType.ATTACK_RIGHT);
    }

    if (!this._activeSprite) return;
    this._activeSprite.loop = false;
    this._activeSprite.play();
    this._activeSprite.onComplete = () => {
      if (target && "kill" in target) {
        const killableTarget = target as MovableCitizen;
        killableTarget.kill();
      }
      this._isInRange = false;
      this._isAttacking = false;

      if (this._activeSprite) this._activeSprite.currentFrame = 0;
      this.replaceAnimation(MinotaurAnimationType.IDLE);
    };
  }

  public get activeTarget(): Container | undefined {
    return this._activeTarget;
  }
  public set activeTarget(target: Container | undefined) {
    this._activeTarget = target;
  }

  public get isInRange(): boolean {
    return this._isInRange;
  }

  public get isAttacking() {
    return this._isAttacking;
  }
}

export enum MinotaurAnimationType {
  IDLE,
  WALK_RIGHT,
  WALK_LEFT,
  ATTACK_RIGHT,
  ATTACK_LEFT,
}

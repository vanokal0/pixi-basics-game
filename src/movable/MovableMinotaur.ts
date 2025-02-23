import { AnimatedSprite, Container, Point, Ticker } from "pixi.js";
import { MovableCharacter } from "./MovableCharacter";

export class MovableMinotaur extends Container implements MovableCharacter {
  static readonly INITIAL_SCALE: number = 0.3;
  static readonly INITIAL_SPEED: number = 2;
  static readonly INITIAL_ANIMATION_SPEED: number = 0.5;
  static readonly INITIAL_Z_INDEX: number = 1;
  static readonly DEFAULT_ATTACK_DISTANCE = 30;

  private _isInRange: boolean;
  private _isAttacking: boolean;
  private _speed: number;
  private _activeSprite: AnimatedSprite;
  private _animatedSpriteMap: Map<MinotaurAnimationType, AnimatedSprite>;
  private _activeTarget: Container | undefined;

  constructor(
    animatedSpriteMap: Map<MinotaurAnimationType, AnimatedSprite>,
    initialAnimation: MinotaurAnimationType,
    initialPosition: Point
  ) {
    super();
    this.position.set(initialPosition.x, initialPosition.y);

    this._speed = MovableMinotaur.INITIAL_SPEED;
    this.scale = MovableMinotaur.INITIAL_SCALE;
    this._animatedSpriteMap = animatedSpriteMap;

    const initialAnimatedSprite: AnimatedSprite | undefined =
      animatedSpriteMap.get(initialAnimation);
    if (!initialAnimatedSprite) {
      throw new Error("Initial animation is missing in a sprite map.");
    }
    this._activeSprite = animatedSpriteMap.get(initialAnimation)!;
    this._activeSprite.animationSpeed = MovableMinotaur.INITIAL_ANIMATION_SPEED;
    this.zIndex = MovableMinotaur.INITIAL_Z_INDEX;
    this._isInRange = false;
    this._isAttacking = false;
    this.addChild(this._activeSprite);
  }

  public play(): void {
    this._activeSprite.play();
  }

  public getNextPosition(dt: Ticker): Point {
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
      this.x + (directionX / distance) * this._speed * dt.deltaTime,
      this.y + (directionY / distance) * this._speed * dt.deltaTime
    );
  }

  public moveTo(point: Point): void {
    this.position.set(point.x, point.y);
  }

  public attack(): void {
    if (this._isAttacking) {
      return;
    }
    this._isAttacking = true;
    this.replaceAnimation(MinotaurAnimationType.ATTACK_LEFT);
    this._activeSprite.loop = false;
    this._activeSprite.play();

    this._activeSprite.onComplete = () => {
      this._isInRange = false;
      this._isAttacking = false;
      this._activeSprite.currentFrame = 0;
      this.replaceAnimation(MinotaurAnimationType.IDLE);
    };
  }

  private replaceAnimation(animationType: MinotaurAnimationType) {
    const newSprite: AnimatedSprite | undefined =
      this._animatedSpriteMap.get(animationType);

    if (!newSprite) {
      throw new Error("Animation is missing in a sprite map.");
    }

    this.removeChild(this._activeSprite);
    newSprite.position.x = this._activeSprite.position.x;
    newSprite.position.y = this._activeSprite.position.y;
    newSprite.animationSpeed = this._activeSprite.animationSpeed;

    this.addChild(newSprite);
    newSprite.play();
    this._activeSprite = newSprite;
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

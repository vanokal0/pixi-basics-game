import { AnimatedSprite, Container, Point } from "pixi.js";
import { Movable } from "./Movable";

export abstract class MovableCharacter<MovableAnimationType>
  extends Container
  implements Movable
{
  protected _speed: number;
  protected _animatedSpriteMap: Map<MovableAnimationType, AnimatedSprite>;
  protected _activeSprite: AnimatedSprite | undefined;

  constructor() {
    super();
    this._speed = 1;
    this._animatedSpriteMap = new Map<MovableAnimationType, AnimatedSprite>();
  }
  abstract getNextPosition(dt: number): Point;

  public moveTo(point: Point): void {
    this.position.set(point.x, point.y);
  }

  protected replaceAnimation(animationType: MovableAnimationType): void {
    const newSprite: AnimatedSprite | undefined =
      this._animatedSpriteMap.get(animationType);

    if (!newSprite) {
      throw new Error("Animation is missing in a sprite map.");
    }

    if (!this._activeSprite) throw new Error("No active sprite to replace");
    this.removeChild(this._activeSprite);
    newSprite.position.x = this._activeSprite.position.x;
    newSprite.position.y = this._activeSprite.position.y;
    newSprite.animationSpeed = this._activeSprite.animationSpeed;

    this.addChild(newSprite);
    newSprite.play();
    this._activeSprite = newSprite;
  }
}

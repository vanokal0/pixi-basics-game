import {
  AnimatedSprite,
  Assets,
  Container,
  Point,
  Size,
  Ticker,
  TilingSprite,
} from "pixi.js";
import {
  CitizenAnimationType,
  MovableCitizen,
} from "../movable/MovableCitizen";
import { SpriteInitializer } from "../utils/SpriteInitializer";
import { MovableCharacter } from "../movable/MovableCharacter";
import { RectangleBarrier } from "../static/RectangleBarrier";
import {
  MinotaurAnimationType,
  MovableMinotaur,
} from "../movable/MovableMinotaur";

export class LevelContainer extends Container {
  static readonly DEFAULT_COIN_AMOUNT = 10;

  static readonly DEFAULT_LEVEL_SIZE = {
    width: window.innerWidth,
    height: window.innerHeight,
  };
  static readonly DEFAULT_BARRIER_SIZE: Size = { width: 80, height: 80 };

  private _levelScore: number;
  private _coinAmount: number;
  private _barrierSize: Size;

  private _movableCharacters: Array<MovableCharacter>;

  public constructor() {
    super();
    this._coinAmount = LevelContainer.DEFAULT_COIN_AMOUNT;
    this._movableCharacters = new Array<MovableCharacter>();

    this.width = LevelContainer.DEFAULT_LEVEL_SIZE.width;
    this.height = LevelContainer.DEFAULT_LEVEL_SIZE.height;
    this._barrierSize = LevelContainer.DEFAULT_BARRIER_SIZE;

    this._levelScore = 0;
  }

  public async initialize(): Promise<(dt: Ticker) => void> {
    const initializer: SpriteInitializer = new SpriteInitializer();

    //ground initialization
    const groundAsset = await Assets.load("../../resources/ground/ground.png");
    const groundSprite = new TilingSprite({
      texture: groundAsset,
      width: LevelContainer.DEFAULT_LEVEL_SIZE.width,
      height: LevelContainer.DEFAULT_LEVEL_SIZE.height,
    });
    groundSprite.position.set(0, 0);
    groundSprite.zIndex = -2;
    this.addChild(groundSprite);

    //barrrier initialization
    const barrierTexture = await Assets.load(
      "../../resources/barrier/barrier.png"
    );
    const barrier = new RectangleBarrier(
      barrierTexture,
      {
        width: this._barrierSize.width,
        height: this._barrierSize.height,
      },
      {
        width: this.width,
        height: this.height,
      }
    );
    this.addChild(barrier);

    //citizen initialization
    const citizen: MovableCitizen = new MovableCitizen(
      await initializer.initCitizenSpriteMap(),
      CitizenAnimationType.FRONT_IDLE
    );
    citizen.play();
    this._movableCharacters.push(citizen);
    this.addChild(citizen);

    //minotaur initialization
    const minotaurSpriteMap: Map<MinotaurAnimationType, AnimatedSprite> =
      await initializer.initMinotaurSpriteMap();
    const minotaur = new MovableMinotaur(
      minotaurSpriteMap,
      MinotaurAnimationType.IDLE,
      new Point(this.width / 2, this.height / 2)
    );
    minotaur.activeTarget = citizen;
    minotaur.play();
    this._movableCharacters.push(minotaur);
    this.addChild(minotaur);

    //coins initialization
    const coinContainer: Container = new Container();
    for (let i = 0; i < this._coinAmount; i++) {
      const coin: AnimatedSprite = await initializer.initCoinSprite();
      coin.x =
        Math.random() *
          (LevelContainer.DEFAULT_LEVEL_SIZE.width -
            this._barrierSize.width -
            this._barrierSize.width) +
        this._barrierSize.width;
      coin.y =
        Math.random() *
          (LevelContainer.DEFAULT_LEVEL_SIZE.height -
            this._barrierSize.height -
            this._barrierSize.height) +
        this._barrierSize.height;
      coin.animationSpeed = 0.2;
      coin.scale = 0.08;
      coin.zIndex = -1;
      coin.play();
      coinContainer.addChild(coin);
    }
    this.addChild(coinContainer);

    return (dt: Ticker) => {
      this._movableCharacters.forEach((movable) => {
        const position = movable.getNextPosition(dt);
        const moveCondition =
          this.isValidPosition(position.x, position.y) &&
          !movable.position.equals(position);
        if (moveCondition) {
          movable.moveTo(position);
        }

        const attackCondition =
          movable instanceof MovableMinotaur &&
          movable.isInRange &&
          !movable.isAttacking;
        if (attackCondition) {
          movable.attack();
          movable.activeTarget = undefined;
          console.log("Game Over! (lose)");
        }
      });
      this.checkCoinCollision(citizen, coinContainer);
      if (this._levelScore === this._coinAmount) {
        console.log("Game Over! (win)");
      }
    };
  }

  private checkCoinCollision(
    citizen: MovableCitizen,
    coinContainer: Container
  ): void {
    for (const coin of coinContainer.children) {
      if (
        coin.getBounds().rectangle.intersects(citizen.getBounds().rectangle)
      ) {
        coinContainer.removeChild(coin);
        this._levelScore++;
      }
    }
  }

  private isValidPosition(x: number, y: number): boolean {
    return (
      x >= this._barrierSize.width &&
      x <= this.width - this._barrierSize.height &&
      y >= this._barrierSize.height &&
      y <= this.height - this._barrierSize.height
    );
  }
}

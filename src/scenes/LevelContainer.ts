import { AnimatedSprite, Container, Point, Size } from "pixi.js";
import {
  CitizenAnimationType,
  MovableCitizen,
} from "../movable/MovableCitizen";
import { SpriteInitializer } from "../utils/initializers/SpriteInitializer";
import { Movable } from "../movable/Movable";
import { RectangleBarrier } from "../static/RectangleBarrier";
import {
  MinotaurAnimationType,
  MovableMinotaur,
} from "../movable/MovableMinotaur";
import { ScoreDisplay } from "../static/ScoreDisplay";

export class LevelContainer extends Container {
  static readonly DEFAULT_COIN_AMOUNT: number = 10;
  static readonly DEFAULT_BARRIER_SIZE: Size = { width: 80, height: 80 };

  private _levelScore: number;
  private _coinAmount: number;
  private _levelSize: Size;
  private _barrierSize: Size;

  private _scoreDisplay: ScoreDisplay;
  private _coinContainer: Container;
  private _movableCharacters: Array<Movable>;

  public constructor() {
    super();
    this._levelSize = { width: window.innerWidth, height: window.innerHeight };

    this._scoreDisplay = new ScoreDisplay(
      new Point(this._levelSize.width, this._levelSize.height)
    );
    this._barrierSize = LevelContainer.DEFAULT_BARRIER_SIZE;

    this._coinAmount = LevelContainer.DEFAULT_COIN_AMOUNT;
    this._levelScore = 0;

    this._movableCharacters = new Array<Movable>();
    this._coinContainer = new Container();
  }

  public async initialize(): Promise<(dt: number) => void> {
    const initializer: SpriteInitializer = new SpriteInitializer();

    //ground initialization
    const groundSprite = await initializer.initGroundSprite(this._levelSize);
    this.addChild(groundSprite);

    //barrrier initialization
    const barrierMap = await initializer.initBarrierSpriteMap(
      this._barrierSize,
      this._levelSize
    );
    const barrier = new RectangleBarrier(
      barrierMap,
      this._barrierSize,
      this._levelSize
    );
    this.addChild(barrier);

    //citizen initialization
    const citizen: MovableCitizen = new MovableCitizen(
      await initializer.initCitizenSpriteMap(),
      CitizenAnimationType.FRONT_IDLE
    );
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

    this._movableCharacters.push(minotaur);
    this.addChild(minotaur);

    //coins initialization
    this._coinContainer = await this.initializeCoinContainer(initializer);
    this.addChild(this._coinContainer);

    //score display
    this.addChild(this._scoreDisplay);

    return (dt: number) => {
      if (this._levelScore === this._coinAmount) {
        this.emit("win");
      }

      this._movableCharacters.forEach((movable) => {
        //movement
        const position = movable.getNextPosition(dt);
        const moveCondition =
          this.isValidPosition(position.x, position.y) &&
          !movable.position.equals(position);
        if (moveCondition) movable.moveTo(position);

        //attack
        const attackCondition =
          movable instanceof MovableMinotaur &&
          movable.isInRange &&
          !movable.isAttacking;
        if (attackCondition) {
          movable.attack();
          movable.activeTarget = undefined;
          this.emit("lose");
        }
      });
      this.checkCoinCollision(citizen, this._coinContainer);
    };
  }

  private async initializeCoinContainer(
    initializer: SpriteInitializer
  ): Promise<Container> {
    const container = new Container();
    for (let i = 0; i < this._coinAmount; i++) {
      const coin: AnimatedSprite = await initializer.initCoinSprite();
      coin.x =
        Math.random() *
          (this.width - this._barrierSize.width - this._barrierSize.width) +
        this._barrierSize.width;
      coin.y =
        Math.random() *
          (this.height - this._barrierSize.height - this._barrierSize.height) +
        this._barrierSize.height;
      coin.animationSpeed = 0.2;
      coin.scale = 0.08;
      coin.zIndex = -1;
      coin.play();
      container.addChild(coin);
    }
    return container;
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
        this._scoreDisplay.levelScore = this._levelScore;
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

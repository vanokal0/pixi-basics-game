import {
  AnimatedSprite,
  Assets,
  Container,
  Ticker,
  TilingSprite,
} from "pixi.js";
import {
  CitizenAnimationType,
  MovableCitizen,
} from "../movable/MovableCitizen";
import { SpriteInitializer } from "../utils/SpriteInitializer";
import { MovableCharacter } from "../movable/MovableCharacter";

export class LevelContainer extends Container {
  static readonly DEFAULT_COIN_AMOUNT = 10;
  static readonly DEFAULT_LEVEL_WIDTH = window.innerWidth;
  static readonly DEFAULT_LEVEL_HEIGHT = window.innerHeight;

  private _coinAmount: number;
  private _movableCharacters: Array<MovableCharacter>;

  public constructor() {
    super();
    this._coinAmount = LevelContainer.DEFAULT_COIN_AMOUNT;
    this._movableCharacters = new Array<MovableCharacter>();
    this.width = LevelContainer.DEFAULT_LEVEL_WIDTH;
    this.height = LevelContainer.DEFAULT_LEVEL_HEIGHT;
  }

  public async initialize(): Promise<(dt: Ticker) => void> {
    const initializer: SpriteInitializer = new SpriteInitializer();

    //ground initialization
    const groundAsset = await Assets.load("../../resources/ground/ground.png");
    const groundSprite = new TilingSprite({
      texture: groundAsset,
      width: LevelContainer.DEFAULT_LEVEL_WIDTH,
      height: LevelContainer.DEFAULT_LEVEL_HEIGHT,
    });
    groundSprite.position.set(0, 0);
    groundSprite.zIndex = -2;
    this.addChild(groundSprite);

    //barrrier initialization
    const barrierTexture = await Assets.load(
      "../../resources/barrier/barrier.png"
    );

    const barrier_size: number = 80;

    const topBarrier = new TilingSprite({
      texture: barrierTexture,
      width: LevelContainer.DEFAULT_LEVEL_WIDTH,
      height: barrier_size,
    });
    topBarrier.position.set(0, 0);

    const bottomBarrier = new TilingSprite({
      texture: barrierTexture,
      width: LevelContainer.DEFAULT_LEVEL_WIDTH,
      height: barrier_size,
    });
    bottomBarrier.position.set(
      0,
      LevelContainer.DEFAULT_LEVEL_HEIGHT - bottomBarrier.height
    );

    const leftBarrier = new TilingSprite({
      texture: barrierTexture,
      width: barrier_size,
      height: LevelContainer.DEFAULT_LEVEL_HEIGHT,
    });
    leftBarrier.position.set(0, 0);

    const rightBarrier = new TilingSprite({
      texture: barrierTexture,
      width: barrier_size,
      height: LevelContainer.DEFAULT_LEVEL_HEIGHT,
    });
    rightBarrier.position.set(
      LevelContainer.DEFAULT_LEVEL_WIDTH - rightBarrier.width,
      0
    );
    this.addChild(topBarrier, bottomBarrier, leftBarrier, rightBarrier);

    //citizen initialization
    const citizen: MovableCitizen = new MovableCitizen(
      await initializer.initCitizenSpriteMap(),
      CitizenAnimationType.FRONT_IDLE
    );
    citizen.play();
    this._movableCharacters.push(citizen);
    this.addChild(citizen);

    //coins initialization
    const coinContainer: Container = new Container();
    for (let i = 0; i < this._coinAmount; i++) {
      const coin: AnimatedSprite = await initializer.initCoinSprite();
      //replace with level height and width as a first argument, barrier as a second
      coin.x =
        Math.random() * (LevelContainer.DEFAULT_LEVEL_WIDTH - barrier_size) +
        barrier_size;
      coin.y =
        Math.random() * (LevelContainer.DEFAULT_LEVEL_HEIGHT - barrier_size) +
        barrier_size;
      coin.animationSpeed = 0.2;
      coin.scale = 0.08;
      coin.zIndex = -1;
      coin.play();
      coinContainer.addChild(coin);
    }
    this.addChild(coinContainer);

    return (dt: Ticker) => {
      this._movableCharacters.forEach((movable) => movable.move(dt));
      this.checkCollision(citizen, coinContainer);
    };
  }

  private checkCollision(
    citizen: MovableCitizen,
    coinContainer: Container
  ): void {
    for (const coin of coinContainer.children) {
      if (
        coin.getBounds().rectangle.intersects(citizen.getBounds().rectangle)
      ) {
        coinContainer.removeChild(coin);
      }
    }
  }
}

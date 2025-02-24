import {
  AnimatedSprite,
  AnimatedSpriteFrames,
  Assets,
  Size,
  Texture,
  TilingSprite,
} from "pixi.js";
import { CitizenAnimationType } from "../../movable/MovableCitizen";
import { CitizenAsset } from "../assets/CitizenAsset";
import { CoinAsset } from "../assets/CoinAsset";
import { MinotaurAsset } from "../assets/MinotaurAsset";
import { MinotaurAnimationType } from "../../movable/MovableMinotaur";
import { BarrierDirection } from "../../static/RectangleBarrier";

export class SpriteInitializer {
  static readonly CITIZEN_ASSET_PATH = "../../resources/citizen/citizen.json";
  static readonly COIN_ASSET_PATH = "../../resources/coin/coin.json";
  static readonly MINOTAUR_ASSET_PATH =
    "../../resources/minotaur/minotaur.json";
  static readonly GROUND_ASSET_PATH = "../../resources/ground/ground.png";
  static readonly BARRIER_ASSET_PATH = "../../resources/barrier/barrier.png";

  public async initGroundSprite(size: Size): Promise<TilingSprite> {
    const groundAsset = await Assets.load(SpriteInitializer.GROUND_ASSET_PATH);
    const groundSprite = new TilingSprite({
      texture: groundAsset,
      width: size.width,
      height: size.height,
    });
    groundSprite.position.set(0, 0);
    groundSprite.zIndex = -2;

    return groundSprite;
  }

  public async initCoinSprite(): Promise<AnimatedSprite> {
    const coinAsset: CoinAsset = await Assets.load(
      SpriteInitializer.COIN_ASSET_PATH
    );
    return this.createModifiedSprite(coinAsset.animations.rotation, 1);
  }

  public async initBarrierSpriteMap(
    barrierSize: Size,
    areaSize: Size
  ): Promise<Map<BarrierDirection, TilingSprite>> {
    const barrierTexture = await Assets.load(
      SpriteInitializer.BARRIER_ASSET_PATH
    );
    const topBarrier = this.createHorizontalBarrierSprite(
      barrierTexture,
      areaSize,
      barrierSize
    );
    const bottomBarrier = this.createHorizontalBarrierSprite(
      barrierTexture,
      areaSize,
      barrierSize
    );

    const leftBarrier = this.createVerticalBarrierSprite(
      barrierTexture,
      areaSize,
      barrierSize
    );
    const rightBarrier = this.createVerticalBarrierSprite(
      barrierTexture,
      areaSize,
      barrierSize
    );

    const spriteMap = new Map<BarrierDirection, TilingSprite>();
    spriteMap.set(BarrierDirection.TOP, topBarrier);
    spriteMap.set(BarrierDirection.BOTTOM, bottomBarrier);
    spriteMap.set(BarrierDirection.LEFT, leftBarrier);
    spriteMap.set(BarrierDirection.RIGHT, rightBarrier);

    return spriteMap;
  }

  private createHorizontalBarrierSprite(
    barrierTexture: Texture,
    areaSize: Size,
    barrierSize: Size
  ): TilingSprite {
    return new TilingSprite({
      texture: barrierTexture,
      width: areaSize.width,
      height: barrierSize.height,
    });
  }

  private createVerticalBarrierSprite(
    barrierTexture: Texture,
    areaSize: Size,
    barrierSize: Size
  ): TilingSprite {
    return new TilingSprite({
      texture: barrierTexture,
      width: barrierSize.width,
      height: areaSize.height,
    });
  }

  public async initCitizenSpriteMap(): Promise<
    Map<CitizenAnimationType, AnimatedSprite>
  > {
    const citizenAsset: CitizenAsset = (await Assets.load(
      SpriteInitializer.CITIZEN_ASSET_PATH
    )) as CitizenAsset;

    const animationMap: Map<CitizenAnimationType, AnimatedSprite> = new Map<
      CitizenAnimationType,
      AnimatedSprite
    >();

    animationMap.set(
      CitizenAnimationType.FRONT_IDLE,
      this.createModifiedSprite(citizenAsset.animations.citizen_front_idle, 1)
    );

    animationMap.set(
      CitizenAnimationType.FRONT_WALK,
      this.createModifiedSprite(citizenAsset.animations.citizen_front_walk, 1)
    );

    animationMap.set(
      CitizenAnimationType.BACK_IDLE,
      this.createModifiedSprite(citizenAsset.animations.citizen_back_idle, 1)
    );
    animationMap.set(
      CitizenAnimationType.BACK_WALK,
      this.createModifiedSprite(citizenAsset.animations.citizen_back_walk, 1)
    );

    animationMap.set(
      CitizenAnimationType.LEFT_IDLE,
      this.createModifiedSprite(citizenAsset.animations.citizen_side_idle, 1)
    );
    animationMap.set(
      CitizenAnimationType.LEFT_WALK,
      this.createModifiedSprite(citizenAsset.animations.citizen_side_walk, 1)
    );

    animationMap.set(
      CitizenAnimationType.RIGHT_IDLE,
      this.createModifiedSprite(citizenAsset.animations.citizen_side_idle, -1)
    );

    animationMap.set(
      CitizenAnimationType.RIGHT_WALK,
      this.createModifiedSprite(citizenAsset.animations.citizen_side_walk, -1)
    );

    const deadCitizen = this.createModifiedSprite(
      citizenAsset.animations.citizen_front_idle,
      1
    );
    deadCitizen.rotation = (90 * Math.PI) / 180.0;
    animationMap.set(CitizenAnimationType.DEAD, deadCitizen);

    return animationMap;
  }

  public async initMinotaurSpriteMap(): Promise<
    Map<MinotaurAnimationType, AnimatedSprite>
  > {
    const minotaurAsset: MinotaurAsset = await Assets.load(
      SpriteInitializer.MINOTAUR_ASSET_PATH
    );

    const animationMap: Map<MinotaurAnimationType, AnimatedSprite> = new Map<
      MinotaurAnimationType,
      AnimatedSprite
    >();

    animationMap.set(
      MinotaurAnimationType.IDLE,
      this.createModifiedSprite(minotaurAsset.animations.idle, -1)
    );

    animationMap.set(
      MinotaurAnimationType.WALK_LEFT,
      this.createModifiedSprite(minotaurAsset.animations.walk, -1)
    );

    animationMap.set(
      MinotaurAnimationType.WALK_RIGHT,
      this.createModifiedSprite(minotaurAsset.animations.walk, 1)
    );

    animationMap.set(
      MinotaurAnimationType.ATTACK_LEFT,
      this.createModifiedSprite(minotaurAsset.animations.attack, -1)
    );

    animationMap.set(
      MinotaurAnimationType.ATTACK_RIGHT,
      this.createModifiedSprite(minotaurAsset.animations.attack, 1)
    );

    return animationMap;
  }

  private createModifiedSprite(
    spriteFrames: AnimatedSpriteFrames,
    scale: number
  ): AnimatedSprite {
    const sprite = new AnimatedSprite(spriteFrames);
    sprite.anchor.set(0.5, 1);
    sprite.scale.x = scale;
    return sprite;
  }
}

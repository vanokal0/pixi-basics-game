import { AnimatedSprite, AnimatedSpriteFrames, Assets } from "pixi.js";
import { CitizenAnimationType } from "../movable/MovableCitizen";
import { CitizenAsset } from "./assets/CitizenAsset";
import { CoinAsset } from "./assets/CoinAsset";
import { MinotaurAsset } from "./assets/MinotaurAsset";
import { MinotaurAnimationType } from "../movable/MovableMinotaur";

export class SpriteInitializer {
  static readonly CITIZEN_ASSET_PATH = "../../resources/citizen/citizen.json";
  static readonly COIN_ASSET_PATH = "../../resources/coin/coin.json";
  static readonly MINOTAUR_ASSET_PATH =
    "../../resources/minotaur/minotaur.json";

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
      this.createModifiedSprite(citizenAsset.animations.citizen_front_idle)
    );

    animationMap.set(
      CitizenAnimationType.FRONT_WALK,
      this.createModifiedSprite(citizenAsset.animations.citizen_front_walk)
    );

    animationMap.set(
      CitizenAnimationType.BACK_IDLE,
      this.createModifiedSprite(citizenAsset.animations.citizen_back_idle)
    );
    animationMap.set(
      CitizenAnimationType.BACK_WALK,
      this.createModifiedSprite(citizenAsset.animations.citizen_back_walk)
    );

    animationMap.set(
      CitizenAnimationType.LEFT_IDLE,
      this.createModifiedSprite(citizenAsset.animations.citizen_side_idle)
    );
    animationMap.set(
      CitizenAnimationType.LEFT_WALK,
      this.createModifiedSprite(citizenAsset.animations.citizen_side_walk)
    );

    const rightIdleSprite: AnimatedSprite = this.createModifiedSprite(
      citizenAsset.animations.citizen_side_idle
    );
    rightIdleSprite.scale.x = -1;
    animationMap.set(CitizenAnimationType.RIGHT_IDLE, rightIdleSprite);

    const rightWalkSprite: AnimatedSprite = this.createModifiedSprite(
      citizenAsset.animations.citizen_side_walk
    );
    rightWalkSprite.scale.x = -1;
    animationMap.set(CitizenAnimationType.RIGHT_WALK, rightWalkSprite);

    return animationMap;
  }

  public async initCoinSprite(): Promise<AnimatedSprite> {
    const coinAsset: CoinAsset = await Assets.load(
      SpriteInitializer.COIN_ASSET_PATH
    );
    return this.createModifiedSprite(coinAsset.animations.rotation);
  }

  //extend for other animations
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
      this.createModifiedSprite(minotaurAsset.animations.idle)
    );

    return animationMap;
  }

  private createModifiedSprite(
    spriteFrames: AnimatedSpriteFrames
  ): AnimatedSprite {
    const sprite = new AnimatedSprite(spriteFrames);
    sprite.anchor.set(0.5, 0.5);
    return sprite;
  }
}

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

    return animationMap;
  }

  public async initCoinSprite(): Promise<AnimatedSprite> {
    const coinAsset: CoinAsset = await Assets.load(
      SpriteInitializer.COIN_ASSET_PATH
    );
    return this.createModifiedSprite(coinAsset.animations.rotation, 1);
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

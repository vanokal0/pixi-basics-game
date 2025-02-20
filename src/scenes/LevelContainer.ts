import {
  AnimatedSprite,
  AnimatedSpriteFrames,
  Assets,
  Container,
  Ticker,
} from "pixi.js";
import {
  AnimationType,
  MovableCitizen,
  CitizenAsset,
} from "../movable/MovableCitizen";

export class LevelContainer extends Container {
  public constructor() {
    super();
  }

  public async initialize(): Promise<(dt: Ticker) => void> {
    const citizenAsset: CitizenAsset = (await Assets.load(
      "../../resources/citizen/citizen.json"
    )) as CitizenAsset;

    //citizen initialization
    const citizen: MovableCitizen = new MovableCitizen(
      this.initCitizenSpriteMap(citizenAsset),
      AnimationType.FRONT_IDLE
    );
    citizen.play();
    this.addChild(citizen);

    return (dt: Ticker) => {
      citizen.move(dt);
    };
  }

  //mapping Enum values to Citizen sprites
  private initCitizenSpriteMap(
    citizenAsset: CitizenAsset
  ): Map<AnimationType, AnimatedSprite> {
    const animationMap: Map<AnimationType, AnimatedSprite> = new Map<
      AnimationType,
      AnimatedSprite
    >();

    animationMap.set(
      AnimationType.FRONT_IDLE,
      this.createModifiedSprite(citizenAsset.animations.citizen_front_idle)
    );

    animationMap.set(
      AnimationType.FRONT_WALK,
      this.createModifiedSprite(citizenAsset.animations.citizen_front_walk)
    );

    animationMap.set(
      AnimationType.BACK_IDLE,
      this.createModifiedSprite(citizenAsset.animations.citizen_back_idle)
    );
    animationMap.set(
      AnimationType.BACK_WALK,
      this.createModifiedSprite(citizenAsset.animations.citizen_back_walk)
    );

    animationMap.set(
      AnimationType.LEFT_IDLE,
      this.createModifiedSprite(citizenAsset.animations.citizen_side_idle)
    );
    animationMap.set(
      AnimationType.LEFT_WALK,
      this.createModifiedSprite(citizenAsset.animations.citizen_side_walk)
    );

    const rightIdleSprite: AnimatedSprite = this.createModifiedSprite(
      citizenAsset.animations.citizen_side_idle
    );
    rightIdleSprite.scale.x = -1;
    animationMap.set(AnimationType.RIGHT_IDLE, rightIdleSprite);

    const rightWalkSprite: AnimatedSprite = this.createModifiedSprite(
      citizenAsset.animations.citizen_side_walk
    );
    rightWalkSprite.scale.x = -1;
    animationMap.set(AnimationType.RIGHT_WALK, rightWalkSprite);

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

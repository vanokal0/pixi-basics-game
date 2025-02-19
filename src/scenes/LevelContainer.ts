import {
  AnimatedSprite,
  AnimatedSpriteFrames,
  Assets,
  Container,
  Ticker,
} from "pixi.js";

export class LevelContainer extends Container {
  private _citizenScale = 0.2;
  private _goldAmount: number = 0;
  private _citizen: AnimatedSprite | undefined;
  private _citizenAsset: CitizenAsset | undefined;

  public constructor() {
    super();
  }

  public async initialize(): Promise<(dt: Ticker) => void> {
    this._citizenAsset = (await Assets.load(
      "../../resources/citizen/citizen.json"
    )) as CitizenAsset;

    if (!this._citizenAsset) {
      throw new Error("Failed to create sprite: Asset is undefined");
    }

    this._citizen = new AnimatedSprite(
      this._citizenAsset.animations.citizen_front_idle
    );

    this._citizen.x = 50;
    this._citizen.y = 50;
    this._citizen.scale = this._citizenScale;
    this._citizen.animationSpeed = 0.6;
    this._citizen.play();
    this.addChild(this._citizen);

    const keyMap: Map<string, boolean> = new Map<string, boolean>();
    this.attachCitizenControlsListeners(keyMap);

    return (dt: Ticker) => {
      if (this._citizen && this._citizenAsset) {
        this.moveCitizen(this._citizen, this._citizenAsset, keyMap, dt);
      }
    };
  }

  private attachCitizenControlsListeners(keymap: Map<string, boolean>) {
    document.addEventListener("keydown", (e) => {
      keymap.set(e.code, true);
    });

    document.addEventListener("keyup", (e) => {
      keymap.set(e.code, false);
    });
  }

  //REPLACE MULTIPLE IF WITH SWITCH/CASE
  //PUT LOGIC IN REPLACE SPRITE METHOD WITH AN ARGUMENT EXTRACTED FROM MAPP<ARROW, ANIMATION>
  private moveCitizen(
    citizen: AnimatedSprite,
    citizenAsset: CitizenAsset,
    keyMap: Map<string, boolean>,
    dt: Ticker
  ) {
    let hasMoved: boolean = false;
    const speed: number = 10;
    if (keyMap.get("ArrowLeft")) {
      if (!citizen.texture.label?.includes("side_walk")) {
        const newCitizen: AnimatedSprite = new AnimatedSprite(
          citizenAsset.animations.citizen_side_walk
        );
        newCitizen.scale = this._citizenScale;
        if (this._citizen) {
          newCitizen.position.x = this._citizen.position.x;
          newCitizen.position.y = this._citizen.position.y;
        }
        this.removeChild(citizen);
        this.addChild(newCitizen);
        this._citizen = newCitizen;
        citizen = newCitizen;
        newCitizen.play();
      }

      citizen.position.x -= dt.deltaTime * speed;

      hasMoved = true;
    }
    if (keyMap.get("ArrowRight")) {
      citizen.position.x += dt.deltaTime * speed;
      hasMoved = true;
    }
    if (keyMap.get("ArrowDown")) {
      citizen.position.y += dt.deltaTime * speed;
      hasMoved = true;
    }
    if (keyMap.get("ArrowUp")) {
      citizen.position.y -= dt.deltaTime * speed;
      hasMoved = true;
    }

    if (!hasMoved) {
      this.removeChild(citizen);
      const newCitizen: AnimatedSprite = new AnimatedSprite(
        citizenAsset.animations.citizen_front_idle
      );
      newCitizen.scale = this._citizenScale;
      if (this._citizen) {
        newCitizen.position.x = this._citizen.position.x;
        newCitizen.position.y = this._citizen.position.y;
      }

      newCitizen.play();
      this.addChild(newCitizen);
      this._citizen = newCitizen;
    }
  }
}

interface CitizenAsset {
  animations: {
    citizen_front_idle: AnimatedSpriteFrames;
    citizen_front_walk: AnimatedSpriteFrames;
    citizen_side_walk: AnimatedSpriteFrames;
    citizen_side_idle: AnimatedSpriteFrames;
  };
}

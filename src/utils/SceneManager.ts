import { Container, Application, Ticker } from "pixi.js";
import { MenuContainer } from "../scenes/MenuContainer";
import { LevelContainer } from "../scenes/LevelContainer";
import { GameOverContainer } from "../scenes/GameOverContainer";
import { StyleInitializer } from "./initializers/StyleInitializer";

export class SceneManager {
  private _app: Application;
  private _currentScene: Container;
  private _updateLevel: ((dt: Ticker) => void) | undefined;

  constructor(app: Application) {
    this._app = app;
    StyleInitializer.initStyles();
    this._currentScene = new Container();
    this._app.stage.addChild(this._currentScene);

    this.showMenu();

    window.addEventListener("resize", () => {
      if (this._updateLevel) this._app.ticker.remove(this._updateLevel);

      this.showMenu();
    });
  }

  private changeScene(newScene: Container, willReplace: boolean): void {
    if (willReplace) {
      this._app.stage.removeChildren();
      this._currentScene.destroy({ children: true });
    }

    this._currentScene = newScene;
    this._app.stage.addChild(this._currentScene);
  }

  public showMenu(): void {
    const menu = new MenuContainer();
    menu.initialize();
    menu.on("startGame", () => this.showLevel());
    this.changeScene(menu, true);
  }

  public async showLevel(): Promise<void> {
    const level = new LevelContainer();

    const levelCallback = await level.initialize();
    this._updateLevel = (ticker: Ticker) => levelCallback(ticker.deltaTime);
    this._app.ticker.add(this._updateLevel);

    level.on("win", () => {
      if (this._updateLevel) this._app.ticker.remove(this._updateLevel);
      this.showGameOver("You Won!");
    });

    level.on("lose", () => {
      if (this._updateLevel) this._app.ticker.remove(this._updateLevel);
      this.showGameOver("You Lost!");
    });

    this.changeScene(level, true);
  }

  public showGameOver(hedingText: string): void {
    const gameOver = new GameOverContainer(hedingText);

    gameOver.on("restart", () => this.showLevel());
    gameOver.on("menu", () => this.showMenu());
    this.changeScene(gameOver, false);
  }
}

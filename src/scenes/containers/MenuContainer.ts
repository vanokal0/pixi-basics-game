import { Container, Text } from "pixi.js";
import {
  StyleInitializer,
  StyleType,
} from "../../utils/initializers/StyleInitializer";

export class MenuContainer extends Container {
  private _textValue: string;

  public constructor() {
    super();
    this._textValue = "Start Game";
  }

  public initialize(): void {
    const menuGameText: Text = new Text({
      text: this._textValue,
      style: StyleInitializer.getStyle(StyleType.TEXT_HEADING),
    });
    menuGameText.x = window.innerWidth / 2 - menuGameText.width / 2;
    menuGameText.y = window.innerHeight / 2 - menuGameText.height / 2;
    menuGameText.eventMode = "static";
    menuGameText.cursor = "pointer";

    menuGameText.on("pointerdown", () => {
      this.emit("startGame");
    });

    this.addChild(menuGameText);
  }
}

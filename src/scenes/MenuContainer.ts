import { Container, TextStyle, Text, Application } from "pixi.js";

export class MenuContainer extends Container {
  private _textValue: string;
  private _textStyle: TextStyle;
  public constructor() {
    super();
    this._textStyle = new TextStyle({
      dropShadow: { angle: 0.5, blur: 10 },
      fill: "#ffffff",
      fontFamily: "Courier New",
      fontSize: 42,
      fontVariant: "small-caps",
      fontWeight: "bolder",
      padding: 20,
    });

    this._textValue = "Start Game";
  }

  public initialize(app: Application): void {
    const menuGameText: Text = new Text({
      text: this._textValue,
      style: this._textStyle,
    });
    menuGameText.x = app.canvas.width / 2 - menuGameText.width / 2;
    menuGameText.y = app.canvas.height / 2 - menuGameText.height / 2;
    menuGameText.eventMode = "static";
    menuGameText.cursor = "pointer";
    this.addChild(menuGameText);
  }

  public set textValue(text: string) {
    this._textValue = text;
  }
}

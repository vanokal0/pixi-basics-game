import { Container, Graphics, Text } from "pixi.js";
import {
  StyleInitializer,
  StyleType,
} from "../../utils/initializers/StyleInitializer";

export class GameOverContainer extends Container {
  constructor(headingText: string) {
    super();

    this.createBackground(window.innerWidth, window.innerHeight);
    this.createMenu(window.innerWidth, window.innerHeight, headingText);
  }

  private createBackground(screenWidth: number, screenHeight: number): void {
    const background = new Graphics()
      .rect(0, 0, screenWidth, screenHeight)
      .fill(0x000000);
    background.alpha = 0.5;
    this.addChild(background);
  }

  private createMenu(
    screenWidth: number,
    screenHeight: number,
    headingText: string
  ): void {
    const style = StyleInitializer.getStyle(StyleType.TEXT_HEADING);

    const heading = new Text({ text: headingText, style: style });
    heading.anchor.set(0.5);
    heading.position.set(screenWidth / 2, screenHeight / 2 - 100);
    this.addChild(heading);

    const restartButton = this.createButton(
      "Restart",
      screenWidth / 2,
      screenHeight / 2 + 20,
      () => {
        this.emit("restart");
      }
    );
    const menuButton = this.createButton(
      "Menu",
      screenWidth / 2,
      screenHeight / 2 + 100,
      () => {
        this.emit("menu");
      }
    );

    this.addChild(restartButton, menuButton);
  }

  private createButton(
    text: string,
    x: number,
    y: number,
    callback: () => void
  ): Text {
    const buttonStyle = StyleInitializer.getStyle(StyleType.TEXT_BUTTON);

    const button = new Text({ text, style: buttonStyle });
    button.anchor.set(0.5);
    button.position.set(x, y);
    button.interactive = true;
    button.cursor = "pointer";
    button.on("pointerdown", callback);

    return button;
  }

  public show(): void {
    this.visible = true;
  }

  public hide(): void {
    this.visible = false;
  }
}

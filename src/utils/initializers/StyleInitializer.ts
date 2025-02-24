import { TextStyle } from "pixi.js";

export class StyleInitializer {
  private static styleMap: Map<StyleType, TextStyle> = new Map();

  public static initStyles() {
    this.styleMap.set(
      StyleType.TEXT_HEADING,
      new TextStyle({
        dropShadow: { angle: 0.5, blur: 10 },
        fill: "#ffffff",
        fontFamily: "Courier New",
        fontSize: 42,
        fontVariant: "small-caps",
        fontWeight: "bolder",
        padding: 20,
      })
    );

    this.styleMap.set(
      StyleType.TEXT_BUTTON,
      new TextStyle({
        dropShadow: { angle: 0.5, blur: 10 },
        fill: "#ffffff",
        fontFamily: "Courier New",
        fontSize: 36,
        fontVariant: "small-caps",
        fontWeight: "bolder",
        padding: 20,
      })
    );
  }

  public static getStyle(styleType: StyleType): TextStyle {
    const style = this.styleMap.get(styleType);
    if (!style) {
      return new TextStyle();
    }
    return style;
  }
}

export enum StyleType {
  TEXT_HEADING,
  TEXT_BUTTON,
}

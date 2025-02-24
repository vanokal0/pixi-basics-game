import { Container, Size, TilingSprite } from "pixi.js";

export class RectangleBarrier extends Container {
  private _barrierSize: Size;
  private _areaSize: Size;

  constructor(
    spriteMap: Map<BarrierDirection, TilingSprite>,
    barrierSize: Size,
    areaSize: Size
  ) {
    super();
    this._barrierSize = barrierSize;
    this._areaSize = areaSize;

    const topBarrier = spriteMap.get(BarrierDirection.TOP);
    if (topBarrier) topBarrier.position.set(0, 0);

    const bottomBarrier = spriteMap.get(BarrierDirection.BOTTOM);
    if (bottomBarrier)
      bottomBarrier.position.set(
        0,
        this._areaSize.height - this._barrierSize.height
      );

    const leftBarrier = spriteMap.get(BarrierDirection.LEFT);
    if (leftBarrier) leftBarrier.position.set(0, 0);

    const rightBarrier = spriteMap.get(BarrierDirection.RIGHT);
    if (rightBarrier)
      rightBarrier.position.set(
        this._areaSize.width - this._barrierSize.width,
        0
      );

    this.addChild(topBarrier!, bottomBarrier!, leftBarrier!, rightBarrier!);
  }
}

export enum BarrierDirection {
  TOP,
  BOTTOM,
  LEFT,
  RIGHT,
}

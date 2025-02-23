import { Container, Size, Texture, TilingSprite } from "pixi.js";

export class RectangleBarrier extends Container {
  private _barrierSize: Size;
  private _areaSize: Size;

  private _spriteMap: Map<BarrierDirection, TilingSprite>;

  constructor(barrierTexture: Texture, barrierSize: Size, areaSize: Size) {
    super();
    this._barrierSize = barrierSize;
    this._areaSize = areaSize;

    const topBarrier = this.createHorizontalBarrierSprite(barrierTexture);
    topBarrier.position.set(0, 0);

    const bottomBarrier = this.createHorizontalBarrierSprite(barrierTexture);
    bottomBarrier.position.set(
      0,
      this._areaSize.height - this._barrierSize.height
    );

    const leftBarrier = this.createVerticalBarrierSprite(barrierTexture);
    leftBarrier.position.set(0, 0);

    const rightBarrier = this.createVerticalBarrierSprite(barrierTexture);
    rightBarrier.position.set(
      this._areaSize.width - this._barrierSize.width,
      0
    );

    this.addChild(topBarrier, bottomBarrier, leftBarrier, rightBarrier);

    this._spriteMap = new Map<BarrierDirection, TilingSprite>();
    this._spriteMap.set(BarrierDirection.TOP, topBarrier);
    this._spriteMap.set(BarrierDirection.BOTTOM, bottomBarrier);
    this._spriteMap.set(BarrierDirection.LEFT, leftBarrier);
    this._spriteMap.set(BarrierDirection.RIGHT, rightBarrier);
  }

  private createHorizontalBarrierSprite(barrierTexture: Texture): TilingSprite {
    return new TilingSprite({
      texture: barrierTexture,
      width: this._areaSize.width,
      height: this._barrierSize.height,
    });
  }

  private createVerticalBarrierSprite(barrierTexture: Texture): TilingSprite {
    return new TilingSprite({
      texture: barrierTexture,
      width: this._barrierSize.width,
      height: this._areaSize.height,
    });
  }
}

enum BarrierDirection {
  TOP,
  BOTTOM,
  LEFT,
  RIGHT,
}

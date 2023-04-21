import { Window, Coord } from 'fittable-core/view-model/index.js';

import { FitContainer } from './fit-container.js';

export class FitWindow<Id extends string>
  extends FitContainer<Id>
  implements Window
{
  private visible = false;
  private position: Coord = { x: 0, y: 0 };
  private widthFn?: () => number;
  private heightFn?: () => number;

  public isVisible(): boolean {
    return this.visible;
  }

  public setVisible(visible: boolean): this {
    this.setFocus(visible);
    this.visible = visible;
    return this;
  }

  public getPosition(): Coord {
    return this.position;
  }

  public setPosition(coord: Coord): this {
    this.position = coord;
    return this;
  }

  public getWidth(): number {
    return this.widthFn ? this.widthFn() : 0;
  }

  public setWidth(widthFn: () => number): this {
    this.widthFn = widthFn;
    return this;
  }

  public getHeight(): number {
    return this.heightFn ? this.heightFn() : 0;
  }

  public setHeight(heightFn: () => number): this {
    this.heightFn = heightFn;
    return this;
  }
}

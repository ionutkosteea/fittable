import { Window, Coord, Size } from 'fittable-core/view-model';

import { FitContainer } from './fit-container.js';

export class FitWindow<Id extends string>
  extends FitContainer<Id>
  implements Window
{
  private visible = false;
  private position?: Coord;
  private size?: Size;

  public isVisible(): boolean {
    return this.visible;
  }

  public setVisible(visible: boolean): this {
    this.setFocus(visible);
    this.visible = visible;
    return this;
  }

  public getPosition(): Coord | undefined {
    return this.position;
  }

  public setPosition(coord?: Coord): this {
    this.position = coord;
    return this;
  }

  public getSize(): Size | undefined {
    return this.size;
  }

  public setSize(size?: Size | undefined): this {
    this.size = size;
    return this;
  }
}

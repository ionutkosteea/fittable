import { Size } from 'fittable-core/view-model';

export class TstSize implements Size {
  constructor(private width: number, private height: number) {}

  public getWidth(): number {
    return this.width;
  }

  public setWidth(width: number): this {
    this.width = width;
    return this;
  }

  public getHeight(): number {
    return this.height;
  }

  public setHeight(height: number): this {
    this.height = height;
    return this;
  }
}

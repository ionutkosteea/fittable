import { Scroller } from 'fittable-core/view-model';

export class TstScroller implements Scroller {
  constructor(private left: number, private top: number) {}

  public getLeft(): number {
    return this.left;
  }

  public getTop(): number {
    return this.top;
  }

  public scroll(left: number, top: number): void {
    this.left = left;
    this.top = top;
  }
}

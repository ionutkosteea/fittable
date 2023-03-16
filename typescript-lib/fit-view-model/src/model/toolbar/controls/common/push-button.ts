import { FitControl } from '../../../common/controls/fit-control.js';

export class PushButton extends FitControl {
  private pushedFn?: () => boolean;

  public setPushed(pushedFn: () => boolean): this {
    this.pushedFn = pushedFn;
    return this;
  }

  public isPushed(): boolean {
    return this.pushedFn ? this.pushedFn() : false;
  }
}

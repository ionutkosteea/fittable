import { Subject } from 'rxjs';

import { Value } from 'fit-core/model/index.js';
import { ValueControl } from 'fit-core/view-model/index.js';

import { FitControl } from './fit-control.js';

export class FitValueControl extends FitControl implements ValueControl {
  public readonly forceValue$: Subject<Value | undefined> = new Subject();
  private value?: Value;

  public getValue(): Value | undefined {
    return this.value;
  }

  public setValue(value?: Value | undefined): this {
    this.value = value;
    return this;
  }
}

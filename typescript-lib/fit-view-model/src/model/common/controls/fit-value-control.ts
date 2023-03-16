import { Observable, Subject } from 'rxjs';

import { Value } from 'fit-core/model/index.js';
import { ValueControl } from 'fit-core/view-model/index.js';

import { FitControl } from './fit-control.js';

export class FitValueControl extends FitControl implements ValueControl {
  private value?: Value;
  private readonly setValue$: Subject<Value | undefined> = new Subject();

  public getValue(): Value | undefined {
    return this.value;
  }

  public setValue(value?: Value | undefined): this {
    this.setValue$.next(value);
    this.value = value;
    return this;
  }

  public onSetValue$(): Observable<Value | undefined> {
    return this.setValue$.asObservable();
  }
}

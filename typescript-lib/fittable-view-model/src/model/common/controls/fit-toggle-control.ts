import { Observable, Subject } from 'rxjs';

import { ToggleControl } from 'fittable-core/view-model';

import { FitValueControl } from './fit-value-control.js';

export class FitToggleControl extends FitValueControl implements ToggleControl {
  private on?: boolean;
  private onFn?: () => boolean;
  private afterSetOn$: Subject<boolean> = new Subject();

  public isOn(): boolean {
    return this.on ?? (this.onFn && this.onFn()) ?? false;
  }

  public setOn(on: boolean): this {
    this.on = on;
    this.afterSetOn$.next(on);
    return this;
  }

  public setOnFn(onFn: () => boolean): this {
    this.onFn = onFn;
    this.afterSetOn$.next(onFn());
    return this;
  }

  public onAfterSetOn$(): Observable<boolean> {
    return this.afterSetOn$.asObservable();
  }
}

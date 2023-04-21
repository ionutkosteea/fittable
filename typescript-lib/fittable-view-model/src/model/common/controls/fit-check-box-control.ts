import { Observable, Subject } from 'rxjs';

import { CheckBoxControl } from 'fittable-core/view-model/index.js';

import { FitValueControl } from './fit-value-control.js';

export class FitCheckBoxControl
  extends FitValueControl
  implements CheckBoxControl
{
  private checked = false;
  private afterSetChecked$: Subject<boolean> = new Subject();

  public isChecked(): boolean {
    return this.checked;
  }

  public setChecked(checked: boolean): this {
    this.checked = checked;
    this.afterSetChecked$.next(checked);
    return this;
  }

  public onAfterSetChecked$(): Observable<boolean> {
    return this.afterSetChecked$.asObservable();
  }
}

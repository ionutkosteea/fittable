import { Subject, Observable } from 'rxjs';

import {
  Container,
  Control,
  ControlMap,
} from 'fittable-core/view-model/index.js';

export class FitContainer<Id extends string> implements Container {
  private controls: ControlMap = {};
  private focus = false;
  private afterSetFocus$: Subject<boolean> = new Subject();

  public setControls(controls: ControlMap): this {
    this.controls = controls;
    return this;
  }

  public addControl(id: Id, control: Control): this {
    this.controls[id] = control;
    return this;
  }

  public getControlIds(): Id[] {
    return Object.keys(this.controls) as Id[];
  }

  public getControl(id: Id): Control {
    const control: Control | undefined = this.controls[id];
    if (control) return control;
    else throw new Error('Missing control for id: ' + id);
  }

  public getControls(): Control[] {
    return Object.values(this.controls);
  }

  public removeControl(id: Id): this {
    Reflect.deleteProperty(this.controls, id);
    return this;
  }

  public clearControls(): this {
    this.controls = {};
    return this;
  }

  public hasFocus(): boolean {
    return this.focus;
  }

  public setFocus(focus: boolean, ignoreTrigger?: boolean): this {
    this.focus = focus;
    !ignoreTrigger && this.afterSetFocus$.next(focus);
    return this;
  }

  public onAfterSetFocus$(): Observable<boolean> {
    return this.afterSetFocus$.asObservable();
  }
}

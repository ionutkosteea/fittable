import { Subject, Observable } from 'rxjs';

import { Container, Control } from 'fittable-core/view-model';

export class FitContainer<Id extends string> implements Container {
  private controls: Map<Id, Control> = new Map();
  private focus = false;
  private afterSetFocus$: Subject<boolean> = new Subject();

  public setControls(controls: Map<Id, Control>): this {
    this.controls = controls;
    return this;
  }

  public addControl(id: Id, control: Control): this {
    this.controls.set(id, control);
    return this;
  }

  public getControlIds(): Id[] {
    return [...this.controls.keys()];
  }

  public getControl(id: Id): Control {
    const control: Control | undefined = this.controls.get(id);
    if (control) return control;
    else throw new Error(`Missing control for id '${id}'`);
  }

  public getControls(): Control[] {
    return [...this.controls.values()];
  }

  public removeControl(id: Id): this {
    this.controls.delete(id);
    return this;
  }

  public clearControls(): this {
    this.controls.clear();
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

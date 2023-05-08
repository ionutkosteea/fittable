import { Observable, Subject } from 'rxjs';

import { InputControl } from 'fittable-core/view-model';

import { FitValueControl } from './fit-value-control.js';

export class FitInputControl extends FitValueControl implements InputControl {
  private focus = false;
  private readonly setFocus$: Subject<boolean> = new Subject();
  private textCursor = false;
  private readonly setTextCursor$: Subject<boolean> = new Subject();
  private readonly scrollToEnd$: Subject<void> = new Subject();
  private readonly ctrlEnter$: Subject<void> = new Subject();

  public hasFocus(): boolean {
    return this.focus;
  }

  public setFocus(focus: boolean): this {
    this.setFocus$.next(focus);
    this.focus = focus;
    return this;
  }

  public onSetFocus$(): Observable<boolean> {
    return this.setFocus$.asObservable();
  }

  public hasTextCursor(): boolean {
    return this.textCursor;
  }

  public setTextCursor(cursor: boolean): this {
    this.setTextCursor$.next(cursor);
    this.textCursor = cursor;
    return this;
  }

  public onSetTextCursor$(): Observable<boolean> {
    return this.setTextCursor$.asObservable();
  }

  public scrollToEnd(): this {
    this.scrollToEnd$.next();
    return this;
  }

  public onScrollToEnd$(): Observable<void> {
    return this.scrollToEnd$.asObservable();
  }

  public ctrlEnter(): this {
    this.ctrlEnter$.next();
    return this;
  }

  public onCtrlEnter$(): Observable<void> {
    return this.ctrlEnter$.asObservable();
  }
}

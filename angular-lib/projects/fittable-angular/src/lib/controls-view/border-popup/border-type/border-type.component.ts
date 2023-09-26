import { Subscription } from 'rxjs';
import {
  Component,
  Input,
  OnDestroy,
  EventEmitter,
  Output,
  AfterViewInit,
  OnInit,
} from '@angular/core';

import {
  PopupControl,
  Control,
  ValueControl,
  asValueControl,
  Window,
} from 'fittable-core/view-model';

import { WindowComponent } from '../../common/window-component.model';

@Component({
  selector: 'fit-border-type',
  templateUrl: './border-type.component.html',
})
export class BorderTypeComponent
  extends WindowComponent
  implements OnInit, AfterViewInit, OnDestroy
{
  @Input('model') popupControl!: PopupControl;
  @Output() isVisibleEvent: EventEmitter<boolean> = new EventEmitter();

  private readonly subscriptions: Subscription[] = [];

  public override getWindow(): Window {
    return this.popupControl.getWindow();
  }

  public ngOnInit(): void {
    this.init();
  }

  public ngAfterViewInit(): void {
    this.subscriptions.push(this.onWindowSetVisible$());
  }

  private onWindowSetVisible$(): Subscription {
    return this.getWindow()
      .onAfterSetFocus$()
      .subscribe((focus: boolean) => {
        this.isVisibleEvent.emit(focus);
      });
  }

  public getBorderStyle(id: string): { borderBottom: string } {
    const control: Control = this.popupControl.getWindow().getControl(id);
    const valueControl: ValueControl | undefined = asValueControl(control);
    if (!valueControl) throw new Error('Invalid value control for id ' + id);
    const parts: string[] = (valueControl.getValue() as string).split(' ');
    return { borderBottom: parts[1] + 'px ' + parts[0] + ' #606060' };
  }

  public ngOnDestroy(): void {
    this.subscriptions.forEach((s: Subscription): void => s.unsubscribe());
  }
}

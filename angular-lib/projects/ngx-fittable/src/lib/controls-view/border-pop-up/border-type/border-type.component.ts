import { Subscription } from 'rxjs';
import {
  Component,
  Input,
  OnDestroy,
  EventEmitter,
  Output,
  AfterViewInit,
} from '@angular/core';

import {
  OptionsControl,
  Control,
  ValueControl,
  asValueControl,
  WindowListener,
  createWindowListener,
} from 'fit-core/view-model';

import { OptionsComponent } from '../../common/options-component.model';

@Component({
  selector: 'fit-border-type',
  templateUrl: './border-type.component.html',
  styleUrls: ['./border-type.component.css'],
})
export class BorderTypeComponent
  extends OptionsComponent
  implements AfterViewInit, OnDestroy
{
  @Input() override model!: OptionsControl;
  @Output() isVisibleEvent: EventEmitter<boolean> = new EventEmitter();

  protected override windowListener!: WindowListener;
  private readonly subscriptions: Subscription[] = [];

  public ngAfterViewInit(): void {
    this.windowListener = createWindowListener(this.model.getWindow());
    this.subscriptions.push(this.onWindowSetVisible$());
  }

  private onWindowSetVisible$(): Subscription {
    return this.model
      .getWindow()
      .onAfterSetFocus$()
      .subscribe((focus: boolean) => {
        this.isVisibleEvent.emit(focus);
      });
  }

  public getBorderStyle(id: string): { borderBottom: string } {
    const control: Control = this.model.getWindow().getControl(id);
    const valueControl: ValueControl | undefined = asValueControl(control);
    if (!valueControl) throw new Error('Invalid value control for id ' + id);
    const parts: string[] = (valueControl.getValue() as string).split(' ');
    return { borderBottom: parts[1] + 'px ' + parts[0] + ' #606060' };
  }

  public ngOnDestroy(): void {
    this.subscriptions.forEach((s: Subscription): void => s.unsubscribe());
  }
}

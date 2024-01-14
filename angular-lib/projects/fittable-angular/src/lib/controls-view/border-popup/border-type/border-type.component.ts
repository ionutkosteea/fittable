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
  PopupControl,
  Control,
  ValueControl,
  asValueControl,
  Window,
} from 'fittable-core/view-model';

@Component({
  selector: 'fit-border-type',
  templateUrl: './border-type.component.html',
  styleUrls: ['../../common/scss/utils.scss', './border-type.component.scss'],
})
export class BorderTypeComponent implements AfterViewInit, OnDestroy {
  @Input({ required: true }) model!: PopupControl;
  @Output() isVisibleEvent: EventEmitter<boolean> = new EventEmitter();
  private readonly subscriptions: Subscription[] = [];

  ngAfterViewInit(): void {
    this.subscriptions.push(this.onWindowSetVisible$());
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((s: Subscription): void => s.unsubscribe());
  }

  getWindow(): Window {
    return this.model.getWindow();
  }

  getControlIds(): string[] {
    return this.getWindow().getControlIds();
  }

  runControl(id: string): void {
    this.getWindow().getControl(id).run();
  }

  getBorderStyle(id: string): { borderBottom: string } {
    const control: Control = this.model.getWindow().getControl(id);
    const valueControl: ValueControl | undefined = asValueControl(control);
    if (!valueControl) throw new Error('Invalid value control for id ' + id);
    const parts: string[] = (valueControl.getValue() as string).split(' ');
    return {
      borderBottom: parts[1] + 'px ' + parts[0] + ' var(--toolbar-color)',
    };
  }

  private onWindowSetVisible$(): Subscription {
    return this.getWindow()
      .onAfterSetFocus$()
      .subscribe((focus: boolean) => {
        this.isVisibleEvent.emit(focus);
      });
  }
}

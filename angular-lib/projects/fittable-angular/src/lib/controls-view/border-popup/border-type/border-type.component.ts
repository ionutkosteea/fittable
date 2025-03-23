import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  Component,
  AfterViewInit,
  input,
  output,
  inject,
  DestroyRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';

import {
  PopupControl,
  Control,
  ValueControl,
  asValueControl,
  Window,
} from 'fittable-core/view-model';

import { ButtonComponent } from '../../button/button.component';
import { PopupMenuComponent } from '../../popup-menu/popup-menu.component';

@Component({
  selector: 'fit-border-type',
  standalone: true,
  imports: [CommonModule, ButtonComponent, PopupMenuComponent],
  templateUrl: './border-type.component.html',
  styleUrls: ['../../common/scss/utils.scss', './border-type.component.scss'],
})
export class BorderTypeComponent implements AfterViewInit {
  model = input.required<PopupControl>();
  isVisibleEvent = output<boolean>();

  private readonly destroyRef = inject(DestroyRef);

  get window(): Window {
    return this.model().getWindow();
  }

  get controlIds(): string[] {
    return this.window.getControlIds();
  }

  ngAfterViewInit(): void {
    this.onWindowSetVisible();
  }

  runControl(id: string): void {
    this.window.getControl(id).run();
  }

  getBorderStyle(id: string): { borderBottom: string } {
    const control: Control = this.window.getControl(id);
    const valueControl: ValueControl | undefined = asValueControl(control);
    if (!valueControl) throw new Error('Invalid value control for id ' + id);
    const parts: string[] = (valueControl.getValue() as string).split(' ');
    return {
      borderBottom: parts[1] + 'px ' + parts[0] + ' var(--toolbar-color)',
    };
  }

  private onWindowSetVisible(): void {
    this.window
      .onAfterSetFocus$()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((focus: boolean) => {
        this.isVisibleEvent.emit(focus);
      });
  }
}

import { Observable } from 'rxjs';
import {
  Component,
  ElementRef,
  ViewChild,
  AfterViewInit,
  input,
  output,
  signal,
  inject,
  DestroyRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';

import { Value } from 'fittable-core/model';
import {
  PopupControl,
  Control,
  ValueControl,
  asValueControl,
  Window,
  asSelectorWindow,
} from 'fittable-core/view-model';

import { ButtonComponent } from '../button/button.component';
import { PopupMenuComponent } from '../popup-menu/popup-menu.component';
import { SvgImgComponent } from '../svg-img/svg-img.component';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'fit-color-picker',
  standalone: true,
  imports: [CommonModule, ButtonComponent, PopupMenuComponent, SvgImgComponent],
  templateUrl: './color-picker.component.html',
  styleUrls: ['../common/scss/utils.scss', './color-picker.component.scss'],
})
export class ColorPickerComponent implements AfterViewInit {
  model = input.required<PopupControl>();
  isVisibleEvent = output<boolean>();

  @ViewChild('colorPicker') colorPickerRef!: ElementRef;
  protected readonly isColorPickerVisible = signal(false);
  private numberDefaultOfColors = 0;
  private readonly destroyRef = inject(DestroyRef);

  get window(): Window {
    return this.model().getWindow();
  }

  ngAfterViewInit(): void {
    this.numberDefaultOfColors = this.window.getControlIds().length;
    this.onWindowSetVisible();
  }

  getSelectedColor(): string | undefined {
    const window: Window = this.window;
    const id: string | undefined = asSelectorWindow(window)?.getControlId();
    if (!id) return undefined;
    const value: Value | undefined = //
      asValueControl(window.getControl(id))?.getValue();
    return value ? '' + value : undefined;
  }

  run(): void {
    this.model().run();
  }

  runControl(id: string): void {
    return this.window.getControl(id).run();
  }

  getColorNoneId(): string {
    return this.window.getControlIds()[0];
  }

  getColorNoneIcon(): string | undefined {
    return this.window.getControl(this.getColorNoneId()).getIcon()
  }

  getColorNoneLabel(): string | undefined {
    return this.window.getControl(this.getColorNoneId()).getLabel();
  }

  getColorIds(): string[] {
    return this.window.hasFocus()
      ? this.window
        .getControlIds()
        .slice(1, this.numberDefaultOfColors)
      : [];
  }

  getCustomColorIds(): string[] {
    return this.window.hasFocus()
      ? this.window.getControlIds().slice(this.numberDefaultOfColors)
      : [];
  }

  getColorValue(id: string): Value | undefined {
    const control: Control = this.window.getControl(id);
    const valueControl: ValueControl | undefined = asValueControl(control);
    if (!valueControl) throw new Error('Invalid value control for id ' + id);
    return valueControl.getValue();
  }

  onSelectCustomColor(): void {
    this.isColorPickerVisible.set(true);
  }

  addCustomColor(): void {
    const customColor: string = this.colorPickerRef.nativeElement.value;
    this.window.addControl(
      customColor,
      new (class implements ValueControl {
        getLabel = () => customColor;
        getValue = () => customColor;
        setValue = () => this;
        onSetValue$ = () => new Observable<Value | undefined>();
        isValid = () => true;
        getIcon = () => undefined;
        getType = () => undefined;
        isDisabled = () => false;
        run = (): void => {
          // Do nothing!
        };
      })(),
    );
    this.isColorPickerVisible.set(false);
  }

  private onWindowSetVisible(): void {
    this.window
      .onAfterSetFocus$()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((focus: boolean): void => this.isVisibleEvent.emit(focus));
  }
}

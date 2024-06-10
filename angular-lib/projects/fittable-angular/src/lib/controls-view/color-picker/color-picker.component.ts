import { Observable, Subscription } from 'rxjs';
import {
  Component,
  ElementRef,
  ViewChild,
  OnDestroy,
  AfterViewInit,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

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

@Component({
  selector: 'fit-color-picker',
  standalone: true,
  imports: [CommonModule, ButtonComponent, PopupMenuComponent],
  templateUrl: './color-picker.component.html',
  styleUrls: ['../common/scss/utils.scss', './color-picker.component.scss'],
})
export class ColorPickerComponent implements AfterViewInit, OnDestroy {
  model = input.required<PopupControl>();
  isVisibleEvent = output<boolean>();

  @ViewChild('colorPicker') colorPickerRef!: ElementRef;
  protected readonly isColorPickerVisible = signal(false);
  private numberDefaultOfColors = 0;
  private readonly subscriptions: Subscription[] = [];
  private readonly domSanitizer = inject(DomSanitizer);

  ngAfterViewInit(): void {
    this.numberDefaultOfColors = this.getWindow().getControlIds().length;
    this.subscriptions.push(this.onWindowSetVisible$());
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((s: Subscription): void => s.unsubscribe());
  }

  getWindow(): Window {
    return this.model().getWindow();
  }

  getSelectedColor(): string | undefined {
    const window: Window = this.getWindow();
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
    return this.getWindow().getControl(id).run();
  }

  getColorNoneId(): string {
    return this.getWindow().getControlIds()[0];
  }

  getColorNoneIcon(): SafeHtml | undefined {
    const htmlContent =
      this.getWindow().getControl(this.getColorNoneId()).getIcon();
    return htmlContent ? this.domSanitizer.bypassSecurityTrustHtml(htmlContent) : undefined;
  }

  getColorNoneLabel(): string | undefined {
    return this.getWindow().getControl(this.getColorNoneId()).getLabel();
  }

  getColorIds(): string[] {
    return this.getWindow().hasFocus()
      ? this.model()
        .getWindow()
        .getControlIds()
        .slice(1, this.numberDefaultOfColors)
      : [];
  }

  getCustomColorIds(): string[] {
    return this.getWindow().hasFocus()
      ? this.getWindow().getControlIds().slice(this.numberDefaultOfColors)
      : [];
  }

  getColorValue(id: string): Value | undefined {
    const control: Control = this.getWindow().getControl(id);
    const valueControl: ValueControl | undefined = asValueControl(control);
    if (!valueControl) throw new Error('Invalid value control for id ' + id);
    return valueControl.getValue();
  }

  onSelectCustomColor(): void {
    this.isColorPickerVisible.set(true);
  }

  addCustomColor(): void {
    const customColor: string = this.colorPickerRef.nativeElement.value;
    this.getWindow().addControl(
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

  private onWindowSetVisible$(): Subscription {
    return this.model()
      .getWindow()
      .onAfterSetFocus$()
      .subscribe((focus: boolean): void => this.isVisibleEvent.emit(focus));
  }
}

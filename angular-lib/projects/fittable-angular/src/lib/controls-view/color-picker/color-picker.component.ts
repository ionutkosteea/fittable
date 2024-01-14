import { Observable, Subscription } from 'rxjs';
import {
  Component,
  Input,
  ElementRef,
  ViewChild,
  Output,
  EventEmitter,
  OnDestroy,
  AfterViewInit,
} from '@angular/core';
import { NgFor, NgStyle } from '@angular/common';

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
  imports: [NgStyle, NgFor, ButtonComponent, PopupMenuComponent],
  templateUrl: './color-picker.component.html',
  styleUrls: ['../common/scss/utils.scss', './color-picker.component.scss'],
})
export class ColorPickerComponent implements AfterViewInit, OnDestroy {
  @Input({ required: true }) model!: PopupControl;
  @Output() isVisibleEvent: EventEmitter<boolean> = new EventEmitter();
  @ViewChild('colorPicker') colorPickerRef!: ElementRef;

  public isColorPickerVisible = false;
  private numberDefaultOfColors = 0;
  private readonly subscriptions: Subscription[] = [];

  public getWindow(): Window {
    return this.model.getWindow();
  }

  public getSelectedColor(): string | undefined {
    const window: Window = this.getWindow();
    const id: string | undefined = asSelectorWindow(window)?.getControlId();
    if (!id) return undefined;
    const value: Value | undefined = //
      asValueControl(window.getControl(id))?.getValue();
    return value ? '' + value : undefined;
  }

  public run(): void {
    this.model.run();
  }

  public runControl(id: string): void {
    return this.getWindow().getControl(id).run();
  }

  public ngAfterViewInit(): void {
    this.numberDefaultOfColors = this.getWindow().getControlIds().length;
    this.subscriptions.push(this.onWindowSetVisible$());
  }

  private onWindowSetVisible$(): Subscription {
    return this.model
      .getWindow()
      .onAfterSetFocus$()
      .subscribe((focus: boolean): void => this.isVisibleEvent.emit(focus));
  }

  public readonly getColorNoneId = (): string =>
    this.getWindow().getControlIds()[0];

  public readonly getColorNoneIcon = (): string | undefined =>
    this.getWindow().getControl(this.getColorNoneId()).getIcon();

  public readonly getColorNoneLabel = (): string | undefined =>
    this.getWindow().getControl(this.getColorNoneId()).getLabel();

  public readonly getColorIds = (): string[] =>
    this.getWindow().hasFocus()
      ? this.model
          .getWindow()
          .getControlIds()
          .slice(1, this.numberDefaultOfColors)
      : [];

  public readonly getCustomColorIds = (): string[] =>
    this.getWindow().hasFocus()
      ? this.getWindow().getControlIds().slice(this.numberDefaultOfColors)
      : [];

  public getColorValue(id: string): Value | undefined {
    const control: Control = this.getWindow().getControl(id);
    const valueControl: ValueControl | undefined = asValueControl(control);
    if (!valueControl) throw new Error('Invalid value control for id ' + id);
    return valueControl.getValue();
  }

  public onSelectCustomColor(): void {
    this.isColorPickerVisible = true;
  }

  public addCustomColor(): void {
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
      })()
    );
    this.isColorPickerVisible = false;
  }

  public ngOnDestroy(): void {
    this.subscriptions.forEach((s: Subscription): void => s.unsubscribe());
  }
}

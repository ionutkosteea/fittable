import { Subscription } from 'rxjs';
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

import { Value } from 'fit-core/model';
import {
  OptionsControl,
  Control,
  ValueControl,
  asValueControl,
  WindowListener,
} from 'fit-core/view-model';

import { OptionsComponent } from '../common/options-component.model';

@Component({
  selector: 'fit-color-picker',
  templateUrl: './color-picker.component.html',
  styleUrls: ['./color-picker.component.css'],
})
export class ColorPickerComponent
  extends OptionsComponent
  implements AfterViewInit, OnDestroy
{
  @Input() override model!: OptionsControl;
  @Input() override windowListener!: WindowListener;
  @Output() isVisibleEvent: EventEmitter<boolean> = new EventEmitter();
  @ViewChild('colorPicker') colorPickerRef!: ElementRef;

  private numberDefaultOfColors = 0;
  private readonly subscriptions: Subscription[] = [];

  public ngAfterViewInit(): void {
    this.numberDefaultOfColors = this.model.getWindow().getControlIds().length;
    this.subscriptions.push(this.onWindowSetVisible$());
  }

  private onWindowSetVisible$(): Subscription {
    return this.model
      .getWindow()
      .onAfterSetFocus$()
      .subscribe((focus: boolean): void => this.isVisibleEvent.emit(focus));
  }

  public readonly getColorNoneId = (): string => this.getOptionIds()[0];

  public readonly getColorNoneIcon = (): string | undefined =>
    this.getControl(this.getColorNoneId()).getIcon();

  public readonly getColorNoneLabel = (): string | undefined =>
    this.getControl(this.getColorNoneId()).getLabel();

  public readonly getColorIds = (): string[] =>
    this.model.getWindow().hasFocus()
      ? this.getOptionIds().slice(1, this.numberDefaultOfColors)
      : [];

  public readonly getCustomColorIds = (): string[] =>
    this.model.getWindow().hasFocus()
      ? this.getOptionIds().slice(this.numberDefaultOfColors)
      : [];

  public getColorValue(id: string): Value | undefined {
    const control: Control = this.getControl(id);
    const valueControl: ValueControl | undefined = asValueControl(control);
    if (!valueControl) throw new Error('Invalid value control for id ' + id);
    return valueControl.getValue();
  }

  public addCustomColor(): void {
    const customColor: string = this.colorPickerRef.nativeElement.value;
    this.model.getWindow().addControl(
      customColor,
      new (class implements ValueControl {
        getLabel = () => customColor;
        getValue = () => customColor;
        setValue = () => this;
        isValid = () => true;
        getIcon = () => undefined;
        getType = () => undefined;
        run = () => {};
      })()
    );
  }

  public ngOnDestroy(): void {
    this.subscriptions.forEach((s: Subscription): void => s.unsubscribe());
  }
}

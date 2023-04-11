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

import { Value, CssStyle } from 'fit-core/model';
import {
  OptionsControl,
  Control,
  ValueControl,
  asValueControl,
  WindowListener,
  createWindowListener,
} from 'fit-core/view-model';

import { OptionsComponent } from '../common/options-component.model';
import { createToggleStyle } from '../common/style-functions.model';

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
  @Output() isVisibleEvent: EventEmitter<boolean> = new EventEmitter();
  @ViewChild('colorPicker') colorPickerRef!: ElementRef;

  public isColorPickerVisible = false;
  protected override windowListener!: WindowListener;
  private numberDefaultOfColors = 0;
  private readonly subscriptions: Subscription[] = [];

  public ngAfterViewInit(): void {
    this.windowListener = createWindowListener(this.model.getWindow());
    this.numberDefaultOfColors = this.model.getWindow().getControlIds().length;
    this.subscriptions.push(this.onWindowSetVisible$());
  }

  private onWindowSetVisible$(): Subscription {
    return this.model
      .getWindow()
      .onAfterSetFocus$()
      .subscribe((focus: boolean): void => this.isVisibleEvent.emit(focus));
  }

  public getButtonStyle(): CssStyle {
    const style: CssStyle = createToggleStyle(this.model);
    style['background-image'] = this.getIcon();
    style['background-repeat'] = 'no-repeat';
    return style;
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

  public onSelectCustomColor(): void {
    this.isColorPickerVisible = true;
  }

  public addCustomColor(): void {
    const customColor: string = this.colorPickerRef.nativeElement.value;
    this.model.getWindow().addControl(
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

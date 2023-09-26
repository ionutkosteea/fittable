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
  OnInit,
} from '@angular/core';

import { CssStyle, Value } from 'fittable-core/model';
import {
  PopupControl,
  Control,
  ValueControl,
  asValueControl,
  Window,
  asSelectorWindow,
} from 'fittable-core/view-model';

import { WindowComponent } from '../common/window-component.model';
import { PopupControlComponent } from '../common/popup-control-component.model';

@Component({
  selector: 'fit-color-picker',
  templateUrl: './color-picker.component.html',
})
export class ColorPickerComponent
  extends WindowComponent
  implements OnInit, AfterViewInit, OnDestroy
{
  @Input('model') control!: PopupControl;
  @Output() isVisibleEvent: EventEmitter<boolean> = new EventEmitter();
  @ViewChild('colorPicker') colorPickerRef!: ElementRef;

  public isColorPickerVisible = false;
  private numberDefaultOfColors = 0;
  private readonly subscriptions: Subscription[] = [];
  private popupComponent?: FitPopupControlComponent;

  public ngOnInit(): void {
    this.popupComponent = new FitPopupControlComponent(this.control);
    this.init();
  }

  public getStyle(): CssStyle | null {
    return this.popupComponent?.getStyle() ?? null;
  }

  public getLabel(): string {
    return this.popupComponent?.getLabel() ?? '';
  }

  public getValue(): string | undefined {
    const window: Window = this.getWindow();
    const id: string | undefined = asSelectorWindow(window)?.getControlId();
    if (!id) return undefined;
    const value: Value | undefined = //
      asValueControl(window.getControl(id))?.getValue();
    return value ? '' + value : undefined;
  }

  public run(): void {
    this.popupComponent?.run();
  }

  public override getWindow(): Window {
    return this.control.getWindow();
  }

  public ngAfterViewInit(): void {
    this.numberDefaultOfColors = this.getWindow().getControlIds().length;
    this.subscriptions.push(this.onWindowSetVisible$());
  }

  private onWindowSetVisible$(): Subscription {
    return this.getWindow()
      .onAfterSetFocus$()
      .subscribe((focus: boolean): void => this.isVisibleEvent.emit(focus));
  }

  public readonly getColorNoneId = (): string => this.getControlIds()[0];

  public readonly getColorNoneIcon = (): string | undefined =>
    this.getControl(this.getColorNoneId()).getIcon();

  public readonly getColorNoneLabel = (): string | undefined =>
    this.getControl(this.getColorNoneId()).getLabel();

  public readonly getColorIds = (): string[] =>
    this.getWindow().hasFocus()
      ? this.getControlIds().slice(1, this.numberDefaultOfColors)
      : [];

  public readonly getCustomColorIds = (): string[] =>
    this.getWindow().hasFocus()
      ? this.getControlIds().slice(this.numberDefaultOfColors)
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

class FitPopupControlComponent extends PopupControlComponent {
  constructor(public control: PopupControl) {
    super();
  }
}

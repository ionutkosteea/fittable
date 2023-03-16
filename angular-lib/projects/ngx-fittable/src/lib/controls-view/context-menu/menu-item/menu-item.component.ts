import { Subscription } from 'rxjs';
import {
  Component,
  ElementRef,
  HostListener,
  Input,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';

import { Value, CssStyle } from 'fit-core/model';
import {
  Control,
  InputControl,
  asInputControl,
  InputControlListener,
  createInputControlListener,
} from 'fit-core/view-model';

import { createToggleStyle } from '../../common/style-functions.model';

@Component({
  selector: 'fit-menu-item',
  templateUrl: './menu-item.component.html',
  styleUrls: ['./menu-item.component.css'],
})
export class MenuItemComponent implements OnInit, OnDestroy {
  @Input() model!: Control;
  @Input() hideMenu!: () => void;
  @ViewChild('input') inputRef?: ElementRef;

  private inputControl!: InputControl;
  private inputControlListener!: InputControlListener;

  private isInputMouseDown = false;
  private subscription?: Subscription;

  public ngOnInit(): void {
    this.inputControl = asInputControl(this.model) as InputControl;
    this.inputControlListener = createInputControlListener(this.inputControl);
    this.subscription = this.onInputControlFocus$();
  }

  private onInputControlFocus$(): Subscription | undefined {
    return this.inputControl
      ?.onSetFocus$()
      .subscribe((focus: boolean): void => {
        const htmlInput: HTMLInputElement = this.inputRef
          ?.nativeElement as HTMLInputElement;
        if (focus) htmlInput.focus();
        else htmlInput.blur();
      });
  }

  public readonly getToggleStyle = (): CssStyle =>
    createToggleStyle(this.model);

  public readonly getIsValidStyle = (): CssStyle | null =>
    this.model.isValid() ? null : { opacity: 0.4, cursor: 'default' };

  public readonly isDisabled = (): boolean => this.model.isDisabled();

  public readonly getIcon = (): string | undefined => this.model.getIcon();

  public readonly getLabel = (): string | undefined => this.model.getLabel();

  public readonly hasValue = (): boolean => this.inputControl !== undefined;

  public getValue(): number | undefined {
    const value: Value | undefined = this.inputControl?.getValue();
    return value ? (value as number) : undefined;
  }

  public readonly onMouseEnter = (): void =>
    this.inputControl && this.inputControlListener.onMouseEnter();

  public readonly onMouseLeave = (): void =>
    this.inputControlListener?.onMouseLeave();

  public onMouseDown(): void {
    if (this.isInputMouseDown) {
      this.isInputMouseDown = false;
    } else if (!this.model.isDisabled()) {
      this.model.run();
      this.hideMenu();
    }
  }

  public readonly onInputMouseEnter = (): void =>
    this.inputControlListener?.onMouseEnter();

  public readonly onInputMouseLeave = (): void =>
    this.inputControlListener?.onMouseLeave();

  public onInputMouseDown(): void {
    this.isInputMouseDown = true;
  }

  public readonly onInputChange = () =>
    this.inputRef &&
    this.inputControl?.setValue(Number(this.inputRef.nativeElement.value));

  public onInputKeyDown(event: KeyboardEvent): void {
    if (!this.inputControl) return;
    this.inputControlListener.onKeyDown(event);
    event.key === 'Enter' && this.hideMenu();
  }

  @HostListener('window:mousedown', ['event']) onGlobalMouseDown(
    event: MouseEvent
  ): void {
    this.inputControlListener?.onGlobalMouseDown(event);
  }

  public readonly ngOnDestroy = (): void => this.subscription?.unsubscribe();
}

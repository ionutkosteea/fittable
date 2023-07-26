import { Subscription } from 'rxjs';
import {
  Component,
  ElementRef,
  Input,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';

import { Value, CssStyle } from 'fittable-core/model';
import {
  Control,
  InputControl,
  asInputControl,
  InputControlListener,
  createInputControlListener,
} from 'fittable-core/view-model';

import { createToggleStyle } from '../../common/style-functions.model';

@Component({
  selector: 'fit-menu-item',
  templateUrl: './menu-item.component.html',
  styleUrls: ['../../../common/css/fittable-main.css'],
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

  public readonly getMenuItemStyle = (): CssStyle | null =>
    createToggleStyle(this.model);

  public readonly getLabelStyle = (): CssStyle => {
    const style: CssStyle = { backgroundImage: this.model.getIcon() };
    if (!this.model.isValid()) {
      style['opacity'] = 0.4;
      style['cursor'] = 'default';
    }
    return style;
  };

  public readonly getTextFieldStyle = (): CssStyle | null =>
    this.model.isValid() ? null : { cursor: 'default' };

  public readonly isDisabled = (): boolean => this.model.isDisabled();

  public readonly getLabel = (): string | undefined => this.model.getLabel();

  public readonly hasValue = (): boolean => this.inputControl !== undefined;

  public getValue(): number | undefined {
    const value: Value | undefined = this.inputControl?.getValue();
    return value ? (value as number) : undefined;
  }

  public onMouseDown(): void {
    if (this.isInputMouseDown) {
      this.isInputMouseDown = false;
    } else if (!this.model.isDisabled()) {
      this.model.run();
      this.hideMenu();
    }
  }

  public onInputMouseDown(): void {
    this.isInputMouseDown = true;
  }

  public onInputChange(event: Event): void {
    this.inputControlListener.onInput(event);
  }

  public onInputKeyDown(event: KeyboardEvent): void {
    this.inputControlListener.onKeyDown(event);
    event.key === 'Enter' && this.hideMenu();
  }

  public readonly onInputFocusOut = (): void =>
    this.inputControlListener.onFocusOut();

  public readonly ngOnDestroy = (): void => this.subscription?.unsubscribe();
}

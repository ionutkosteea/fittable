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

import { Value } from 'fit-core/model';
import {
  Control,
  InputControl,
  asInputControl,
  InputControlListener,
} from 'fit-core/view-model';

@Component({
  selector: 'fit-menu-item',
  templateUrl: './menu-item.component.html',
  styleUrls: ['./menu-item.component.css'],
})
export class MenuItemComponent implements OnInit, OnDestroy {
  @Input() model!: Control;
  @Input() inputControlListener?: InputControlListener;
  @Input() hideMenu!: () => void;
  @ViewChild('input') inputRef?: ElementRef;

  private inputControl?: InputControl;

  private isInputMouseDown = false;
  private subscription?: Subscription;

  public ngOnInit(): void {
    this.inputControl = asInputControl(this.model);
    this.subscription = this.onInputControlFocus$();
  }

  private onInputControlFocus$(): Subscription | undefined {
    return this.inputControl?.focus$.subscribe((focus: boolean): void => {
      const htmlInput: HTMLInputElement = this.inputRef
        ?.nativeElement as HTMLInputElement;
      if (focus) htmlInput.focus();
      else htmlInput.blur();
    });
  }

  public readonly getIcon = (): string | undefined => this.model.getIcon();

  public readonly getLabel = (): string | undefined => this.model.getLabel();

  public readonly getLabelClass = (): string =>
    this.model.isValid() ? 'label' : 'label label-disabled';

  public readonly hasValue = (): boolean => this.inputControl !== undefined;

  public getValue(): number | undefined {
    const value: Value | undefined = this.inputControl?.getValue();
    return value ? (value as number) : undefined;
  }

  public readonly onMouseEnter = (): void =>
    this.inputControl &&
    this.inputControlListener
      ?.setInputControl(this.inputControl)
      .onMouseEnter();

  public readonly onMouseLeave = (): void =>
    this.inputControlListener?.onMouseLeave();

  public onMouseDown(): void {
    if (this.isInputMouseDown) {
      this.isInputMouseDown = false;
    } else {
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
    this.inputControlListener?.onKeyDown(event);
    setTimeout(() => event.key === 'Enter' && this.hideMenu(), 50);
  }

  @HostListener('window:mousedown', ['event']) onGlobalMouseDown(
    event: MouseEvent
  ): void {
    this.inputControlListener?.onGlobalMouseDown(event);
  }

  public readonly ngOnDestroy = (): void => this.subscription?.unsubscribe();
}

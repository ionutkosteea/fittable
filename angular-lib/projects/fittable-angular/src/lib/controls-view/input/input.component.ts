import { Subscription } from 'rxjs';
import {
  Component,
  Input,
  HostListener,
  ViewChild,
  ElementRef,
  OnDestroy,
  OnInit,
} from '@angular/core';

import { CssStyle } from 'fittable-core/model';
import {
  InputControl,
  InputControlListener,
  createInputControlListener,
} from 'fittable-core/view-model';

import { createToggleStyle } from '../common/style-functions.model';

@Component({
  selector: 'fit-input',
  template:
    '<input class="fit-toolbar-input" #inputField type="number" min="1" [ngStyle]="getStyle()" [value]="this.model.getValue()" [disabled]="getDisabled()" [title]="getLabel()" />',
})
export class InputComponent implements OnInit, OnDestroy {
  @Input() model!: InputControl;
  @ViewChild('inputField') inputFieldRef!: ElementRef;

  private inputControlListener!: InputControlListener;
  private readonly subscriptions: Subscription[] = [];

  public ngOnInit(): void {
    this.inputControlListener = createInputControlListener(this.model);
    this.subscriptions.push(this.onFocus$());
  }

  private onFocus$(): Subscription {
    return this.model.onSetFocus$().subscribe((focus: boolean): void => {
      const htmlInput: HTMLElement = this.getHtmlInput();
      if (focus) htmlInput.focus();
      else htmlInput.blur();
    });
  }

  private readonly getHtmlInput = (): HTMLInputElement =>
    this.inputFieldRef.nativeElement;

  public readonly getStyle = (): CssStyle | null =>
    createToggleStyle(this.model);

  public readonly getDisabled = (): string | null =>
    this.model.isDisabled() ? 'disabled' : null;

  public readonly getLabel = (): string | undefined => this.model.getLabel();

  @HostListener('input', ['$event']) onInput(event: KeyboardEvent): void {
    this.inputControlListener.onInput(event);
  }

  @HostListener('keydown', ['$event']) onKeyDown(event: KeyboardEvent): void {
    this.inputControlListener.onKeyDown(event);
  }

  @HostListener('focusout') onFocusOut(): void {
    this.inputControlListener.onFocusOut();
  }

  public ngOnDestroy(): void {
    this.subscriptions.forEach((s: Subscription): void => s.unsubscribe());
  }
}

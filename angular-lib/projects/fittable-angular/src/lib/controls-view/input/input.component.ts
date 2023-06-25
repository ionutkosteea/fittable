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

import { Value, CssStyle } from 'fittable-core/model';
import {
  InputControl,
  InputControlListener,
  createInputControlListener,
} from 'fittable-core/view-model';

import { createToggleStyle } from '../common/style-functions.model';

@Component({
  selector: 'fit-input',
  template:
    '<input class="field" style="width: 40px;" #inputField type="number" min="1" [ngStyle]="getStyle()" [value]="model.getValue()" [disabled]="getDisabled()" [title]="getLabel()" />',
  styleUrls: ['../common/css/controls-common.css'],
})
export class InputComponent implements OnInit, OnDestroy {
  @Input() model!: InputControl;
  @ViewChild('inputField') inputFieldRef!: ElementRef;

  private inputControlListener!: InputControlListener;
  private readonly subscriptions: Subscription[] = [];

  public ngOnInit(): void {
    this.inputControlListener = createInputControlListener(this.model);
    this.subscriptions.push(this.onFocus$());
    this.subscriptions.push(this.onForceValue$());
  }

  private onFocus$(): Subscription {
    return this.model.onSetFocus$().subscribe((focus: boolean): void => {
      const htmlInput: HTMLElement = this.getHtmlInput();
      if (focus) htmlInput.focus();
      else htmlInput.blur();
    });
  }

  private onForceValue$(): Subscription {
    return this.model.onSetValue$().subscribe((value?: Value): void => {
      this.getHtmlInput().value = value
        ? '' + value
        : '' + this.model.getValue();
    });
  }

  private readonly getHtmlInput = (): HTMLInputElement =>
    this.inputFieldRef.nativeElement;

  public readonly getStyle = (): CssStyle => createToggleStyle(this.model);

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

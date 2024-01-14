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
import { NgStyle } from '@angular/common';

import { CssStyle } from 'fittable-core/model';
import {
  InputControl,
  InputControlListener,
  createInputControlListener,
} from 'fittable-core/view-model';

import { createToggleStyle } from '../common/style-functions.model';

@Component({
  selector: 'fit-input',
  standalone: true,
  imports: [NgStyle],
  template: `
    <input
      #inputField
      type="number"
      min="1"
      [ngStyle]="getStyle()"
      [value]="this.model.getValue()"
      [disabled]="getDisabled()"
      [title]="getLabel()"
    />
  `,
  styleUrl: './input.component.scss',
})
export class InputComponent implements OnInit, OnDestroy {
  @Input() model!: InputControl;
  @ViewChild('inputField') inputFieldRef!: ElementRef;
  private inputControlListener!: InputControlListener;
  private readonly subscriptions: Subscription[] = [];

  ngOnInit(): void {
    this.inputControlListener = createInputControlListener(this.model);
    this.subscriptions.push(this.onFocus$());
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((s: Subscription): void => s.unsubscribe());
  }

  @HostListener('input', ['$event']) onInput(event: KeyboardEvent): void {
    this.inputControlListener.onInput(event);
  }

  @HostListener('keydown', ['$event']) onKeyDown(event: KeyboardEvent): void {
    this.inputControlListener.onKeyDown(event);
  }

  @HostListener('focusout') onFocusOut(): void {
    this.inputControlListener.onFocusOut();
  }

  getStyle(): CssStyle | null {
    return createToggleStyle(this.model);
  }

  getDisabled(): string | null {
    return this.model.isDisabled() ? 'disabled' : null;
  }

  getLabel(): string | undefined {
    return this.model.getLabel();
  }

  private onFocus$(): Subscription {
    return this.model.onSetFocus$().subscribe((focus: boolean): void => {
      const htmlInput: HTMLElement = this.getHtmlInput();
      if (focus) htmlInput.focus();
      else htmlInput.blur();
    });
  }

  private getHtmlInput(): HTMLInputElement {
    return this.inputFieldRef.nativeElement;
  }
}

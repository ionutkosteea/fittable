import {
  Component,
  HostListener,
  ViewChild,
  ElementRef,
  OnInit,
  input,
  inject,
  DestroyRef,
} from '@angular/core';
import { NgStyle } from '@angular/common';

import { CssStyle, Value } from 'fittable-core/model';
import {
  InputControl,
  InputControlListener,
  createInputControlListener,
} from 'fittable-core/view-model';

import { createToggleStyle } from '../common/style-functions.model';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

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
      [value]="value"
      [disabled]="getDisabled()"
      [title]="label"
    />
  `,
  styleUrl: './input.component.scss',
})
export class InputComponent implements OnInit {
  model = input.required<InputControl>();

  @ViewChild('inputField') inputFieldRef!: ElementRef;
  private inputControlListener!: InputControlListener;
  private readonly destroyRef = inject(DestroyRef);

  get label(): string | undefined {
    return this.model().getLabel();
  }

  get value(): Value | undefined {
    return this.model().getValue();
  }

  private get htmlInput(): HTMLInputElement {
    return this.inputFieldRef.nativeElement;
  }

  ngOnInit(): void {
    this.inputControlListener = createInputControlListener(this.model());
    this.onFocus();
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
    return createToggleStyle(this.model());
  }

  getDisabled(): string | null {
    return this.model().isDisabled() ? 'disabled' : null;
  }

  private onFocus(): void {
    this.model()
      .onSetFocus$()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((focus: boolean): void => {
        if (focus) this.htmlInput.focus();
        else this.htmlInput.blur();
      });
  }
}

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

import { Value } from 'fit-core/model';
import { InputControl, InputControlListener } from 'fit-core/view-model';

@Component({
  selector: 'fit-input',
  template:
    '<input #inputField type="number" min="1" [value]="model.getValue()" />',
  styles: [
    'input {width:40px;height:26px;border:none;margin:0;padding:0;text-align:center;color:var(--toolbar-color);background-color:var(--toolbar-background-color);font-size: 14px}',
  ],
})
export class InputComponent implements OnInit, OnDestroy {
  @Input() model!: InputControl;
  @Input() inputControlListener!: InputControlListener;
  @ViewChild('inputField') inputFieldRef!: ElementRef;

  private subscriptions: Subscription[] = [];

  public ngOnInit(): void {
    this.subscriptions.push(this.onFocus$());
    this.subscriptions.push(this.onForceValue$());
  }

  private onFocus$(): Subscription {
    return this.model.focus$.subscribe((focus: boolean): void => {
      const htmlInput: HTMLElement = this.getHtmlInput();
      if (focus) htmlInput.focus();
      else htmlInput.blur();
    });
  }

  private onForceValue$(): Subscription {
    return this.model.forceValue$!.subscribe((value?: Value): void => {
      this.getHtmlInput().value = value ? '' + value : '';
    });
  }

  private getHtmlInput = (): HTMLInputElement =>
    this.inputFieldRef.nativeElement;

  @HostListener('mouseenter') onMouseEnter(): void {
    this.inputControlListener.setInputControl(this.model).onMouseEnter();
  }

  @HostListener('mouseleave') onMouseLeave(): void {
    this.inputControlListener.onMouseLeave();
  }

  @HostListener('window:mousedown', ['$event']) onGlobalMouseDown(
    event: MouseEvent
  ): void {
    this.inputControlListener?.onGlobalMouseDown(event);
  }

  @HostListener('keydown', ['$event']) onKeyDown(event: KeyboardEvent): void {
    this.inputControlListener.onKeyDown(event);
  }

  public ngOnDestroy(): void {
    this.subscriptions.forEach((s: Subscription): void => s.unsubscribe());
  }
}

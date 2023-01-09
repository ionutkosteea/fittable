import { Value } from 'fit-core/model/index.js';
import {
  InputControlListener,
  InputControlListenerFactory,
  InputControl,
  FitKeyboardEvent,
  FitHTMLInputElement,
} from 'fit-core/view-model/index.js';

export class FitInputControlListener implements InputControlListener {
  private inputControl!: InputControl;

  private isMouseOver = false;
  private canRevertValueOnClick = false;

  public setInputControl(input: InputControl): this {
    this.inputControl = input;
    return this;
  }

  public getInputControl(): InputControl {
    return this.inputControl;
  }

  public onMouseEnter(): void {
    this.isMouseOver = true;
  }

  public onMouseLeave(): void {
    this.isMouseOver = false;
  }

  public onGlobalMouseDown(): void {
    if (this.isMouseOver) {
      this.canRevertValueOnClick = true;
    } else if (this.canRevertValueOnClick) {
      const oldValue: Value | undefined = this.inputControl.getValue();
      this.inputControl.forceValue$?.next(oldValue);
      this.inputControl.focus$.next(false);
      this.canRevertValueOnClick = false;
    }
  }

  public onKeyDown(event: FitKeyboardEvent): void {
    if (event.key !== 'Enter') return;
    event.preventDefault();
    const htmlInput: FitHTMLInputElement = event.target as FitHTMLInputElement;
    this.inputControl.setValue(Number(htmlInput.value)).run();
    this.inputControl.focus$.next(false);
    this.canRevertValueOnClick = false;
  }
}

export class FitInputControlListenerFactory
  implements InputControlListenerFactory
{
  public createInputControlListener(): InputControlListener {
    return new FitInputControlListener();
  }
}

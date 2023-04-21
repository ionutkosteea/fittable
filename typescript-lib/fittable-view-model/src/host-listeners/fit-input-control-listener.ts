import {
  InputControlListener,
  InputControlListenerFactory,
  InputControl,
  FitKeyboardEvent,
  FitHtmlInputElement,
} from 'fittable-core/view-model/index.js';

export class FitInputControlListener implements InputControlListener {
  constructor(private readonly inputControl: InputControl) {}

  private isMouseOver = false;
  private canRevertValueOnClick = false;

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
      this.inputControl.setFocus(false);
      this.canRevertValueOnClick = false;
    }
  }

  public onKeyDown(event: FitKeyboardEvent): void {
    if (event.key !== 'Enter') return;
    event.preventDefault();
    event.stopPropagation();
    const htmlInput: FitHtmlInputElement = event.target as FitHtmlInputElement;
    this.inputControl.setValue(Number(htmlInput.value)).run();
    this.inputControl.setFocus(false);
    this.canRevertValueOnClick = false;
  }
}

export class FitInputControlListenerFactory
  implements InputControlListenerFactory
{
  public createInputControlListener(
    inputControl: InputControl
  ): InputControlListener {
    return new FitInputControlListener(inputControl);
  }
}

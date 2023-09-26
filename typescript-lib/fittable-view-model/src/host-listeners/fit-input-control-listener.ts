import {
  InputControlListener,
  InputControlListenerFactory,
  InputControl,
  FitKeyboardEvent,
  FitHtmlInputElement,
  FitEvent,
} from 'fittable-core/view-model';

export class FitInputControlListener implements InputControlListener {
  constructor(private readonly inputControl: InputControl) {}

  public onInput(event: FitEvent): void {
    const htmlInput: FitHtmlInputElement = event.target as FitHtmlInputElement;
    const htmlValue: string | undefined = htmlInput.value ?? undefined;
    try {
      if (htmlValue) this.inputControl.setValue(JSON.parse(htmlValue));
      else this.inputControl.setValue('');
    } catch {
      this.inputControl.setValue(htmlValue);
    }
  }

  public onKeyDown(event: FitKeyboardEvent): void {
    if (event.key !== 'Enter') return;
    event.preventDefault();
    event.stopPropagation();
    this.inputControl.run();
    this.inputControl.setFocus(false);
  }

  public onFocusOut(): void {
    this.inputControl.setFocus(false);
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

import { MissingFactoryError } from '../../common/factory-error.js';
import { InputControl } from '../model/controls.js';
import { getViewModelConfig } from '../view-model-config.js';
import { FitEvent, FitKeyboardEvent } from './html-mockups.js';

export interface InputControlListener {
  onInput(event?: FitEvent): void;
  onKeyDown(event?: FitKeyboardEvent): void;
  onFocusOut(event?: FitEvent): void;
}

export interface InputControlListenerFactory {
  createInputControlListener(inputControl: InputControl): InputControlListener;
}

export function createInputControlListener(
  inputControl: InputControl
): InputControlListener {
  const factory: InputControlListenerFactory | undefined =
    getViewModelConfig().inputControlListenerFactory;
  if (factory) return factory.createInputControlListener(inputControl);
  else throw new MissingFactoryError();
}

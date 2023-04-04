import { MissingFactoryError } from '../../common/factory-error.js';
import { InputControl } from '../model/controls.js';
import { getViewModelConfig } from '../view-model-config.js';
import { FitKeyboardEvent, FitMouseEvent } from './html-mockups.js';

export interface InputControlListener {
  onMouseEnter(event?: FitMouseEvent): void;
  onMouseLeave(event?: FitMouseEvent): void;
  onGlobalMouseDown(event?: FitMouseEvent): void;
  onKeyDown(event?: FitKeyboardEvent): void;
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

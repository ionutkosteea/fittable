import { InputControl } from '../model/controls.js';
import { getViewModelConfig } from '../view-model-config.js';
import { FitKeyboardEvent, FitMouseEvent } from './custom-events.js';

export interface InputControlListener {
  setInputControl(control: InputControl): this;
  getInputControl(): InputControl;
  onMouseEnter(event?: FitMouseEvent): void;
  onMouseLeave(event?: FitMouseEvent): void;
  onGlobalMouseDown(event?: FitMouseEvent): void;
  onKeyDown(event?: FitKeyboardEvent): void;
}

export interface InputControlListenerFactory {
  createInputControlListener(): InputControlListener;
}

export function createInputControlListener(): InputControlListener {
  const factory: InputControlListenerFactory | undefined =
    getViewModelConfig().inputControlListenerFactory;
  if (factory) {
    return factory.createInputControlListener();
  } else {
    throw new Error('ToolbarInputListenerFactory is not defined!');
  }
}

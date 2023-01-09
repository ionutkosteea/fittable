import { Window } from '../model/controls.js';
import { getViewModelConfig } from '../view-model-config.js';
import { FitMouseEvent } from './custom-events.js';

export interface WindowListener {
  setWindow(window: Window): this;
  onShow(event?: FitMouseEvent): void;
  onMouseDown(event?: FitMouseEvent): void;
  onGlobalMouseDown(event?: FitMouseEvent): void;
}

export interface WindowListenerFactory {
  createWindowListener(): WindowListener;
}

export function createWindowListener(): WindowListener {
  const factory: WindowListenerFactory | undefined =
    getViewModelConfig().windowListenerFactory;
  if (factory) return factory.createWindowListener();
  else throw new Error('WindowListenerFactory is not defined!');
}

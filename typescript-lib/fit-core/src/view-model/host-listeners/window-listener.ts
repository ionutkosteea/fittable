import { MissingFactoryError } from '../../common/factory-error.js';
import { Window } from '../model/controls.js';
import { getViewModelConfig } from '../view-model-config.js';
import { FitMouseEvent } from './custom-events.js';

export interface WindowListener {
  onShow(event?: FitMouseEvent): void;
  onMouseDown(event?: FitMouseEvent): void;
  onGlobalMouseDown(event?: FitMouseEvent): void;
}

export interface WindowListenerFactory {
  createWindowListener(window: Window): WindowListener;
}

export function createWindowListener(window: Window): WindowListener {
  const factory: WindowListenerFactory | undefined =
    getViewModelConfig().windowListenerFactory;
  if (factory) return factory.createWindowListener(window);
  else throw new MissingFactoryError();
}

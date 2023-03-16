import { MissingFactoryError } from '../../common/factory-error.js';
import { getViewModelConfig } from '../view-model-config.js';
import { ControlArgs, Window } from './controls.js';

export interface ContextMenuFactory {
  createContextMenu(args: ControlArgs): Window;
}

export function createContextMenu(args: ControlArgs): Window {
  const factory: ContextMenuFactory | undefined =
    getViewModelConfig().contextMenuFactory;
  if (factory) return factory.createContextMenu(args);
  else throw new MissingFactoryError();
}

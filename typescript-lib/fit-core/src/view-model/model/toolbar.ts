import { MissingFactoryError } from '../../common/factory-error.js';
import { getViewModelConfig } from '../view-model-config.js';
import { Container, ControlArgs } from './controls.js';

export interface ToolbarFactory {
  createToolbar(args: ControlArgs): Container;
}

export function createToolbar(args: ControlArgs): Container {
  const factory: ToolbarFactory | undefined =
    getViewModelConfig().toolbarFactory;
  if (factory) return factory.createToolbar(args);
  else throw new MissingFactoryError();
}

import { MissingFactoryError } from '../../common/factory-error.js';
import { getViewModelConfig } from '../view-model-config.js';
import { FocusableObject } from './controls.js';
import { ScrollContainer } from './scroll-container.js';
import { TableViewer } from './table-viewer.js';

export interface Statusbar extends FocusableObject {
  getText(): string;
  destroy(): void;
}

export interface StatusbarFactory {
  createStatusbar(
    tableViewer: TableViewer,
    tableScrollContainer: ScrollContainer
  ): Statusbar;
}

export function createStatusbar(
  tableViewer: TableViewer,
  tableScrollContainer: ScrollContainer
): Statusbar {
  const factory: StatusbarFactory | undefined =
    getViewModelConfig().statusbarFactory;
  if (factory) {
    return factory.createStatusbar(tableViewer, tableScrollContainer);
  } else {
    throw new MissingFactoryError();
  }
}

import { MissingFactoryError } from '../../common/factory-error.js';
import { getViewModelConfig } from '../view-model-config.js';
import { FocusableObject } from './controls.js';
import { LanguageDictionary } from './language-dictionary.js';
import { ScrollContainer } from './scroll-container.js';
import { TableViewer } from './table-viewer.js';

export interface Statusbar extends FocusableObject {
  getText(): string;
}

export type StatusbarArgs = {
  dictionary: LanguageDictionary;
  tableViewer: TableViewer;
  tableScroller: ScrollContainer;
};

export interface StatusbarFactory {
  createStatusbar(args: StatusbarArgs): Statusbar;
}

export function createStatusbar(args: StatusbarArgs): Statusbar {
  const factory: StatusbarFactory | undefined =
    getViewModelConfig().statusbarFactory;
  if (factory) return factory.createStatusbar(args);
  else throw new MissingFactoryError();
}

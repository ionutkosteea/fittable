import { MissingFactoryError } from '../../common/factory-error.js';
import { ColFilterExecutor } from '../../model/col-filter-executor.js';
import { OperationExecutor } from '../../operations/operation-core.js';
import { getViewModelConfig } from '../view-model-config.js';
import { OptionsControl } from './controls.js';
import { ImageRegistry } from './image-registry.js';
import { LanguageDictionary } from './language-dictionary.js';
import { ScrollContainer } from './scroll-container.js';

export type ValueCondition = {
  mode: 'Select all' | 'Clear';
  values: (string | undefined)[];
};

export interface ColFilters {
  filterExecutor: ColFilterExecutor;
  loadCol(colId: number): this;
  getPopUpButton(colId: number): OptionsControl;
  getValueConditions(): { [colId: number]: ValueCondition };
  getValueScroller(): ScrollContainer;
  destroy(): void;
}

export type ColFiltersArgs = {
  dictionary: LanguageDictionary;
  imageRegistry: ImageRegistry;
  operationExecutor: OperationExecutor;
};

export interface ColFiltersFactory {
  createColFilters(args: ColFiltersArgs): ColFilters;
}

export function createColFilters(args: ColFiltersArgs): ColFilters {
  const factory: ColFiltersFactory | undefined =
    getViewModelConfig().colFiltersFactory;
  if (factory) return factory.createColFilters(args);
  else throw new MissingFactoryError();
}

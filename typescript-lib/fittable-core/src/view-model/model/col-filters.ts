import { MissingFactoryError } from '../../common/factory-error.js';
import { ColFilterExecutor } from '../../model/filter/col-filter-executor.js';
import { OperationExecutor } from '../../operations/operation-core.js';
import { getViewModelConfig } from '../view-model-config.js';
import { PopupControl } from './controls.js';
import { ScrollContainer } from './scroll-container.js';

export type ValueCondition = {
  mode: 'Select all' | 'Clear';
  values: (string | undefined)[];
};

export interface ColFilters {
  filterExecutor: ColFilterExecutor;
  loadCol(colId: number): this;
  getPopupButton(colId: number): PopupControl;
  getValueConditions(): { [colId: number]: ValueCondition };
  getValueScrollContainer(): ScrollContainer;
  destroy(): void;
}

export interface ColFiltersFactory {
  createColFilters(operationExecutor: OperationExecutor): ColFilters;
}

export function createColFilters(
  operationExecutor: OperationExecutor
): ColFilters {
  const factory: ColFiltersFactory | undefined =
    getViewModelConfig().colFiltersFactory;
  if (factory) return factory.createColFilters(operationExecutor);
  else throw new MissingFactoryError();
}

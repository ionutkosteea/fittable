import { MissingFactoryError } from '../../common/factory-error.js';
import { ColConditionFn, TableBasics, TableColFilters } from '../table/table.js';
import { getModelConfig } from '../model-config.js';

type FitTable = TableBasics & TableColFilters;

export interface ColFilterExecutor {
  table: FitTable;
  addCondition(colId: number, conditionFn: ColConditionFn): this;
  removeCondition(colId: number): this;
  hasCondition(colId: number): boolean;
  clearConditions(): this;
  getTable(colId: number): FitTable | undefined;
  run(): this;
  getFilteredTable(): FitTable | undefined;
}

export interface ColFilterExecutorFactory {
  createColFilterExecutor(table: FitTable): ColFilterExecutor;
}

export function createColFilterExecutor(table: FitTable): ColFilterExecutor {
  const factory: ColFilterExecutorFactory | undefined =
    getModelConfig().colFilterExecutorFactory;
  if (factory) return factory.createColFilterExecutor(table);
  else throw new MissingFactoryError();
}

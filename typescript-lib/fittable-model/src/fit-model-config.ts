import { ModelConfig } from 'fittable-core/model';

import { FitCellCoordFactory } from './table/fit-cell-coord.js';
import { FitCellRangeFactory } from './table/fit-cell-range.js';
import { FitLineRangeFactory } from './table/fit-line-range.js';
import { FitTableFactory } from './table/fit-table.js';
import { FitStyleFactory } from './table/fit-style.js';
import { FitColFilterExecutorFactory } from './filter/fit-col-filter-executor.js';
import { FitCellNumberFormatterFactory } from './cell-formatter/fit-cell-number-formatter.js';
import { FitCellDateFormatterFactory } from './cell-formatter/fit-cell-date-formatter.js';
import { FitCellBooleanFormatterFactory } from './cell-formatter/fit-cell-boolean-formatter.js';
import { FitLanguageDictionaryFactory } from './language/fit-language-dictionary.js';

export const FIT_MODEL_CONFIG: ModelConfig = {
  languageDictionaryFactory: new FitLanguageDictionaryFactory(),
  cellCoordFactory: new FitCellCoordFactory(),
  cellRangeFactory: new FitCellRangeFactory(),
  lineRangeFactory: new FitLineRangeFactory(),
  styleFactory: new FitStyleFactory(),
  tableFactory: new FitTableFactory(),
  colFilterExecutorFactory: new FitColFilterExecutorFactory(),
  cellNumberFormatterFactory: new FitCellNumberFormatterFactory(),
  cellDateFormatterFactory: new FitCellDateFormatterFactory(),
  cellBooleanFormatterFactory: new FitCellBooleanFormatterFactory(),
};

import { ModelConfig } from 'fit-core/model/index.js';

import { FitCellCoordFactory } from './table/fit-cell-coord.js';
import { FitCellRangeFactory } from './table/fit-cell-range.js';
import { FitLineRangeFactory } from './table/fit-line-range.js';
import { FitStyleFactory } from './table/fit-style.js';
import { FitTableFactory } from './table/fit-table.js';

export const FIT_MODEL_CONFIG: ModelConfig = {
  cellCoordFactory: new FitCellCoordFactory(),
  cellRangeFactory: new FitCellRangeFactory(),
  lineRangeFactory: new FitLineRangeFactory(),
  styleFactory: new FitStyleFactory(),
  tableFactory: new FitTableFactory(),
};

import { ModelConfig } from 'fit-core/model/index.js';

import { FitCellCoordFactory } from './table/fit-cell-coord.js';
import { FitCellFactory } from './table/fit-cell.js';
import { FitCellRangeFactory } from './table/fit-cell-range.js';
import { FitColumnFactory } from './table/fit-column.js';
import { FitColumnHeaderFactory } from './table/fit-column-header.js';
import { FitLineRangeFactory } from './table/fit-line-range.js';
import { FitMergedRegionsFactory } from './table/fit-merged-regions.js';
import { FitRowFactory } from './table/fit-row.js';
import { FitRowHeaderFactory } from './table/fit-row-header.js';
import { FitStyleFactory } from './table/fit-style.js';
import { FitTableFactory } from './table/fit-table.js';

export const FIT_MODEL_CONFIG: ModelConfig = {
  cellCoordFactory: new FitCellCoordFactory(),
  cellFactory: new FitCellFactory(),
  cellRangeFactory: new FitCellRangeFactory(),
  columnFactory: new FitColumnFactory(),
  columnHeaderFactory: new FitColumnHeaderFactory(),
  lineRangeFactory: new FitLineRangeFactory(),
  mergedRegionsFactory: new FitMergedRegionsFactory(),
  rowFactory: new FitRowFactory(),
  rowHeaderFactory: new FitRowHeaderFactory(),
  styleFactory: new FitStyleFactory(),
  tableFactory: new FitTableFactory(),
};

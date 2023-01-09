import { ModelConfig } from '../../../dist/model/index.js';
import { TstTableFactory } from './tst-table.js';
import { TstCellFactory } from './tst-cell.js';
import { TstCellCoordFactory } from './tst-cell-coord.js';
import { TstCellRangeFactory } from './tst-cell-range.js';
import { TstLineRangeFactory } from './tst-line-range.js';

export const tstModelConfig: ModelConfig = {
  tableFactory: new TstTableFactory(),
  cellFactory: new TstCellFactory(),
  cellCoordFactory: new TstCellCoordFactory(),
  cellRangeFactory: new TstCellRangeFactory(),
  lineRangeFactory: new TstLineRangeFactory(),
};

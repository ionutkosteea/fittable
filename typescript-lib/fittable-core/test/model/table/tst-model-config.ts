import { ModelConfig } from '../../../dist/model/index.js';
import { TstTableFactory } from './tst-table.js';
import { TstCellCoordFactory } from './tst-cell-coord.js';
import { TstCellRangeFactory } from './tst-cell-range.js';
import { TstLineRangeFactory } from './tst-line-range.js';
import { TstLanguageDictionaryFactory } from '../language/tst-language-dictionary.js';

export const TST_MODEL_CONFIG: ModelConfig = {
  languageDictionaryFactory: new TstLanguageDictionaryFactory(),
  tableFactory: new TstTableFactory(),
  cellCoordFactory: new TstCellCoordFactory(),
  cellRangeFactory: new TstCellRangeFactory(),
  lineRangeFactory: new TstLineRangeFactory(),
};

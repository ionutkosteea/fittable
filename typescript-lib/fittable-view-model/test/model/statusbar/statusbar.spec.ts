import {} from 'jasmine';

import {
  createTable,
  registerModelConfig,
  Table,
  unregisterModelConfig,
} from 'fittable-core/model';
import {
  registerOperationConfig,
  unregisterOperationConfig,
} from 'fittable-core/operations';
import {
  createLanguageDictionary,
  createScrollContainer,
  createStatusbar,
  createTableViewer,
  LanguageDictionary,
  registerViewModelConfig,
  ScrollContainer,
  Statusbar,
  TableViewer,
  unregisterViewModelConfig,
} from 'fittable-core/view-model';
import { FIT_MODEL_CONFIG } from 'fittable-model';
import { FIT_OPERATION_CONFIG } from 'fittable-model-operations';

import { FIT_VIEW_MODEL_CONFIG } from '../../../dist/index.js';

import { TstSize } from '../common/tst-size.js';
import { TstScroller } from '../common/tst-scroller.js';

describe('Statusbar', (): void => {
  beforeAll((): void => {
    registerModelConfig(FIT_MODEL_CONFIG);
    registerOperationConfig(FIT_OPERATION_CONFIG);
    registerViewModelConfig(FIT_VIEW_MODEL_CONFIG);
  });
  afterAll((): void => {
    unregisterModelConfig();
    unregisterOperationConfig();
    unregisterViewModelConfig();
  });

  it('statusbar text', (): void => {
    const dictionary: LanguageDictionary = createLanguageDictionary();
    const table: Table = createTable() //
      .setNumberOfRows(10)
      .setNumberOfCols(5);
    const tableViewer: TableViewer = createTableViewer(table);
    const tableScrollContainer: ScrollContainer =
      createScrollContainer(tableViewer);
    const statusbar: Statusbar = createStatusbar({
      dictionary,
      tableViewer,
      tableScrollContainer,
    });
    tableScrollContainer
      .setSize(new TstSize(100, 200))
      .setScroller(new TstScroller(0, 0))
      .renderModel();
    const text: string = 'Rows: 10 [0,9] Columns: 5 [0,4]';
    expect(text === statusbar.getText()).toBeTruthy();
    statusbar.destroy();
  });
});

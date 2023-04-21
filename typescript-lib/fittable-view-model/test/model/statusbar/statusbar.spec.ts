import {} from 'jasmine';

import {
  createTable,
  registerModelConfig,
  Table,
  unregisterModelConfig,
} from 'fittable-core/model/index.js';
import {
  registerOperationConfig,
  unregisterOperationConfig,
} from 'fittable-core/operations/index.js';
import {
  createLanguageDictionary,
  createScrollContainer,
  createStatusbar,
  createTableViewer,
  LanguageDictionary,
  registerViewModelConfig,
  ScrollContainer,
  ScrollElement,
  Statusbar,
  TableViewer,
  unregisterViewModelConfig,
} from 'fittable-core/view-model/index.js';

import { FIT_MODEL_CONFIG } from '../../../../fittable-model/dist/index.js';
import { FIT_OPERATION_CONFIG } from '../../../../fittable-model-operations/dist/index.js';
import { FIT_VIEW_MODEL_CONFIG } from '../../../dist/index.js';

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
    const tableScroller: ScrollContainer = createScrollContainer(tableViewer);
    tableScroller.init(new TstScrollElement());
    const statusbar: Statusbar = createStatusbar({
      dictionary,
      tableViewer,
      tableScroller,
    });
    const text: string = 'Rows: 10 [0,9] Columns: 5 [0,4]';
    expect(text === statusbar.getText()).toBeTruthy();
  });
});

class TstScrollElement implements ScrollElement {
  clientHeight = 200;
  clientWidth = 100;
  scrollLeft = 0;
  scrollTop = 0;
  scrollTo(left: number, top: number): void {
    this.scrollLeft = left;
    this.scrollTop = top;
  }
}

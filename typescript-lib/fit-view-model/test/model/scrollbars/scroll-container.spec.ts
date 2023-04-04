import {} from 'jasmine';

import {
  registerModelConfig,
  unregisterModelConfig,
} from 'fit-core/model/index.js';
import {
  registerOperationConfig,
  unregisterOperationConfig,
} from 'fit-core/operations/index.js';
import {
  createScrollContainer,
  registerViewModelConfig,
  ScrollContainer,
  ScrollElement,
  unregisterViewModelConfig,
} from 'fit-core/view-model/index.js';

import { FIT_MODEL_CONFIG } from '../../../../fit-model/dist/index.js';
import { FIT_OPERATION_CONFIG } from '../../../../fit-model-operations/dist/index.js';
import { FIT_VIEW_MODEL_CONFIG } from '../../../dist/index.js';

describe('Scroll container', (): void => {
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

  it('traverse row indexes', (): void => {
    const scrollContainer: ScrollContainer = createScrollContainer({
      getNumberOfRows: () => 10,
      getNumberOfCols: () => 5,
    });
    scrollContainer.init(new TstScrollElement());
    let firstRow: number | undefined = 0;
    let lastRow = 0;
    for (const i of scrollContainer.getRenderableRows()) {
      if (firstRow === undefined) firstRow = i;
      lastRow = i;
    }
    expect(firstRow === 0).toBeTruthy();
    expect(lastRow === 9).toBeTruthy();
  });

  it('traverse column indexes', (): void => {
    const scrollContainer: ScrollContainer = createScrollContainer({
      getNumberOfRows: () => 10,
      getNumberOfCols: () => 5,
    });
    scrollContainer.init(new TstScrollElement());
    let firstCol: number | undefined = 0;
    let lastCol = 0;
    for (const i of scrollContainer.getRenderableCols()) {
      if (firstCol === undefined) firstCol = i;
      lastCol = i;
    }
    expect(firstCol === 0).toBeTruthy();
    expect(lastCol === 4).toBeTruthy();
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

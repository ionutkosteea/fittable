import {} from 'jasmine';

import {
  registerModelConfig,
  unregisterModelConfig,
} from 'fittable-core/model';
import {
  registerOperationConfig,
  unregisterOperationConfig,
} from 'fittable-core/operations';
import {
  createScrollContainer,
  registerViewModelConfig,
  ScrollContainer,
  unregisterViewModelConfig,
} from 'fittable-core/view-model';
import { FIT_MODEL_CONFIG } from 'fittable-model';
import { FIT_OPERATION_CONFIG } from 'fittable-model-operations';

import { FIT_VIEW_MODEL_CONFIG } from '../../../dist/index.js';

import { TstGrid } from '../common/tst-grid.js';
import { TstSize } from '../common/tst-size.js';
import { TstScroller } from '../common/tst-scroller.js';

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
    const scrollContainer: ScrollContainer = //
      createScrollContainer(new TstGrid(10, 5))
        .setSize(new TstSize(100, 200))
        .setScroller(new TstScroller(0, 0));

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
    const scrollContainer: ScrollContainer = //
      createScrollContainer(new TstGrid(10, 5))
        .setSize(new TstSize(100, 200))
        .setScroller(new TstScroller(0, 0));

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

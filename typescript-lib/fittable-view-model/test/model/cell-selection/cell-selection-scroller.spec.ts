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
  CellSelectionScroller,
  createCellSelectionScroller,
  createScrollContainer,
  createTableViewer,
  registerViewModelConfig,
  ScrollContainer,
  TableViewer,
  unregisterViewModelConfig,
} from 'fittable-core/view-model';
import { FIT_MODEL_CONFIG } from 'fittable-model';
import { FIT_OPERATION_CONFIG } from 'fittable-model-operations';

import { FIT_VIEW_MODEL_CONFIG } from '../../../dist/index.js';

import { TstSize } from '../common/tst-size.js';
import { TstScroller } from '../common/tst-scroller.js';

describe('Cell selection scroller', (): void => {
  beforeAll((): void => {
    registerModelConfig(FIT_MODEL_CONFIG);
    registerOperationConfig(FIT_OPERATION_CONFIG);
    registerViewModelConfig(FIT_VIEW_MODEL_CONFIG);
  });
  afterAll(() => {
    unregisterModelConfig();
    unregisterOperationConfig();
    unregisterViewModelConfig();
  });

  it('scroll down', (): void => {
    const table: Table = createTable() //
      .setNumberOfRows(50)
      .setNumberOfCols(10);
    const tableViewer: TableViewer = createTableViewer(table);
    const tableScrollContainer: ScrollContainer = //
      createScrollContainer(tableViewer)
        .setSize(new TstSize(1000, 210))
        .setScroller(new TstScroller(0, 0));
    const cellSelectionScroller: CellSelectionScroller =
      createCellSelectionScroller(tableViewer, tableScrollContainer);
    cellSelectionScroller
      .setRowId(9)
      .setColId(0)
      .setScrollDirection('Down')
      .scroll();

    expect(tableScrollContainer.getScroller().getTop() === 42).toBeTruthy(); // incl. col header
  });

  it('scroll up', (): void => {
    const table: Table = createTable() //
      .setNumberOfRows(50)
      .setNumberOfCols(10);
    const tableViewer: TableViewer = createTableViewer(table);
    const tableScrollContainer: ScrollContainer = //
      createScrollContainer(tableViewer)
        .setSize(new TstSize(1000, 210))
        .setScroller(new TstScroller(0, 21));
    const cellSelectionScroller: CellSelectionScroller =
      createCellSelectionScroller(tableViewer, tableScrollContainer);
    cellSelectionScroller
      .setRowId(1)
      .setColId(0)
      .setScrollDirection('Up')
      .scroll();

    expect(tableScrollContainer.getScroller().getTop() === 0).toBeTruthy(); // incl. col header
  });

  it('scroll right', (): void => {
    const table: Table = createTable() //
      .setNumberOfRows(50)
      .setNumberOfCols(20);
    const tableViewer: TableViewer = createTableViewer(table);
    const tableScrollContainer: ScrollContainer = //
      createScrollContainer(tableViewer)
        .setSize(new TstSize(1000, 210))
        .setScroller(new TstScroller(0, 0));
    const cellSelectionScroller: CellSelectionScroller =
      createCellSelectionScroller(tableViewer, tableScrollContainer);
    cellSelectionScroller
      .setRowId(0)
      .setColId(9)
      .setScrollDirection('Right')
      .scroll();

    expect(tableScrollContainer.getScroller().getLeft() === 140).toBeTruthy(); // incl. row header
  });

  it('scroll left', (): void => {
    const table: Table = createTable() //
      .setNumberOfRows(50)
      .setNumberOfCols(20);
    const tableViewer: TableViewer = createTableViewer(table);
    const tableScrollContainer: ScrollContainer = //
      createScrollContainer(tableViewer)
        .setSize(new TstSize(1000, 210))
        .setScroller(new TstScroller(140, 0));
    const cellSelectionScroller: CellSelectionScroller =
      createCellSelectionScroller(tableViewer, tableScrollContainer);
    cellSelectionScroller
      .setRowId(0)
      .setColId(1)
      .setScrollDirection('Left')
      .scroll();

    expect(tableScrollContainer.getScroller().getLeft() === 0).toBeTruthy(); // incl. row header
  });
});

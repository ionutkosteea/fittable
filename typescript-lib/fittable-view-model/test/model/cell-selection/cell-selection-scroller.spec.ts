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
  CellSelectionScroller,
  createCellSelectionScroller,
  createScrollContainer,
  createTableViewer,
  registerViewModelConfig,
  ScrollContainer,
  ScrollElement,
  TableViewer,
  unregisterViewModelConfig,
} from 'fittable-core/view-model/index.js';

import { FIT_MODEL_CONFIG } from '../../../../fittable-model/dist/index.js';
import { FIT_OPERATION_CONFIG } from '../../../../fittable-model-operations/dist/index.js';
import { FIT_VIEW_MODEL_CONFIG } from '../../../dist/index.js';

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
    const tableScroller: ScrollContainer = createScrollContainer(tableViewer);
    tableScroller.init(new TstScrollElement());
    const cellSelectionScroller: CellSelectionScroller =
      createCellSelectionScroller(tableViewer, tableScroller);
    cellSelectionScroller
      .setRowId(9)
      .setColId(0)
      .setScrollDirection('Down')
      .scroll();

    expect(tableScroller.getTop() === 42).toBeTruthy(); // incl. col header
  });

  it('scroll up', (): void => {
    const table: Table = createTable() //
      .setNumberOfRows(50)
      .setNumberOfCols(10);
    const tableViewer: TableViewer = createTableViewer(table);
    const tableScroller: ScrollContainer = createScrollContainer(tableViewer);
    const scrollElement: TstScrollElement = new TstScrollElement();
    scrollElement.scrollTop = 21;
    tableScroller.init(scrollElement);
    const cellSelectionScroller: CellSelectionScroller =
      createCellSelectionScroller(tableViewer, tableScroller);
    cellSelectionScroller
      .setRowId(1)
      .setColId(0)
      .setScrollDirection('Up')
      .scroll();

    expect(tableScroller.getTop() === 0).toBeTruthy(); // incl. col header
  });

  it('scroll right', (): void => {
    const table: Table = createTable() //
      .setNumberOfRows(50)
      .setNumberOfCols(20);
    const tableViewer: TableViewer = createTableViewer(table);
    const tableScroller: ScrollContainer = createScrollContainer(tableViewer);
    tableScroller.init(new TstScrollElement());
    const cellSelectionScroller: CellSelectionScroller =
      createCellSelectionScroller(tableViewer, tableScroller);
    cellSelectionScroller
      .setRowId(0)
      .setColId(9)
      .setScrollDirection('Right')
      .scroll();

    expect(tableScroller.getLeft() === 140).toBeTruthy(); // incl. row header
  });

  it('scroll left', (): void => {
    const table: Table = createTable() //
      .setNumberOfRows(50)
      .setNumberOfCols(20);
    const tableViewer: TableViewer = createTableViewer(table);
    const tableScroller: ScrollContainer = createScrollContainer(tableViewer);
    const scrollElement: TstScrollElement = new TstScrollElement();
    scrollElement.scrollLeft = 140;
    tableScroller.init(scrollElement);
    const cellSelectionScroller: CellSelectionScroller =
      createCellSelectionScroller(tableViewer, tableScroller);
    cellSelectionScroller
      .setRowId(0)
      .setColId(1)
      .setScrollDirection('Left')
      .scroll();

    expect(tableScroller.getLeft() === 0).toBeTruthy(); // incl. row header
  });
});

class TstScrollElement implements ScrollElement {
  clientHeight = 210;
  clientWidth = 1000;
  scrollLeft = 0;
  scrollTop = 0;
  scrollTo(left: number, top: number): void {
    this.scrollLeft = left;
    this.scrollTop = top;
  }
}

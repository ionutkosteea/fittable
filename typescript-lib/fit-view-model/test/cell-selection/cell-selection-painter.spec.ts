import {} from 'jasmine';

import {
  registerModelConfig,
  createCellCoord,
  unregisterModelConfig,
} from 'fit-core/model/index.js';
import {
  registerViewModelConfig,
  CellSelectionPainter,
  Rectangle,
  unregisterViewModelConfig,
  getViewModelConfig,
  ViewModelConfig,
} from 'fit-core/view-model/index.js';

import { FIT_MODEL_CONFIG } from '../../../fit-model/dist/index.js';

import { TST_VIEW_MODEL_CONFIG } from '../model/tst-view-model-config.js';
import { CellSelectionPainterBuilder } from '../model/cell-selection-painter-builder.js';

let config: ViewModelConfig | undefined;

describe('Test CellSelectionPainter', (): void => {
  beforeAll((): void => {
    registerModelConfig(FIT_MODEL_CONFIG);
    registerViewModelConfig(TST_VIEW_MODEL_CONFIG);
    config = getViewModelConfig();
  });
  afterAll(() => {
    unregisterModelConfig();
    unregisterViewModelConfig();
    config = undefined;
  });

  it('select table body cell [0,0]', () => {
    const builder: CellSelectionPainterBuilder =
      new CellSelectionPainterBuilder()
        .setNumberOfTableRows(10)
        .setNumberOfTableColumns(5)
        .selectBodyRange(createCellCoord(0, 0));
    const painter: CellSelectionPainter = builder.build();
    const bodyRange: Rectangle = painter.body.getRectangles()[0];
    expect(bodyRange.top === 0).toBeTruthy();
    expect(bodyRange.left === 0).toBeTruthy();
    expect(bodyRange.width === config!.columnWidth).toBeTruthy();
    expect(bodyRange.height === config!.rowHeight).toBeTruthy();
    builder.destroy();
  });

  it('select table body cell [1,1]', () => {
    const builder: CellSelectionPainterBuilder =
      new CellSelectionPainterBuilder()
        .setNumberOfTableRows(10)
        .setNumberOfTableColumns(5)
        .selectBodyRange(createCellCoord(1, 1));
    const painter: CellSelectionPainter = builder.build();
    const bodyRange: Rectangle = painter.body.getRectangles()[0];
    expect(bodyRange.top === config!.rowHeight).toBeTruthy();
    expect(bodyRange.left === config!.columnWidth).toBeTruthy();
    expect(bodyRange.width === config!.columnWidth).toBeTruthy();
    expect(bodyRange.height === config!.rowHeight).toBeTruthy();
    builder.destroy();
  });

  it('select table body range [0,0,1,1]', () => {
    const builder: CellSelectionPainterBuilder =
      new CellSelectionPainterBuilder()
        .setNumberOfTableRows(10)
        .setNumberOfTableColumns(5)
        .selectBodyRange(createCellCoord(0, 0), createCellCoord(1, 1));
    const painter: CellSelectionPainter = builder.build();
    const bodyRange: Rectangle = painter.body.getRectangles()[0];
    expect(bodyRange.top === 0).toBeTruthy();
    expect(bodyRange.left === 0).toBeTruthy();
    expect(bodyRange.width === 2 * config!.columnWidth).toBeTruthy();
    expect(bodyRange.height === 2 * config!.rowHeight).toBeTruthy();
    builder.destroy();
  });

  it('select table body ranges [0,0] and [1,0,1,1]', () => {
    const builder: CellSelectionPainterBuilder =
      new CellSelectionPainterBuilder()
        .setNumberOfTableRows(10)
        .setNumberOfTableColumns(5)
        .selectBodyRange(createCellCoord(0, 0))
        .selectBodyRange(createCellCoord(1, 0), createCellCoord(1, 1));
    const painter: CellSelectionPainter = builder.build();
    const bodyRange1: Rectangle = painter.body.getRectangles()[0];
    expect(bodyRange1.top === 0).toBeTruthy();
    expect(bodyRange1.left === 0).toBeTruthy();
    expect(bodyRange1.width === config!.columnWidth).toBeTruthy();
    expect(bodyRange1.height === config!.rowHeight).toBeTruthy();
    const bodyRange2: Rectangle = painter.body.getRectangles()[1];
    expect(bodyRange2.top === config!.rowHeight).toBeTruthy();
    expect(bodyRange2.left === 0).toBeTruthy();
    expect(bodyRange2.width === 2 * config!.columnWidth).toBeTruthy();
    expect(bodyRange2.height === config!.rowHeight).toBeTruthy();
    builder.destroy();
  });

  it('select range [0,0,1,1] in table with row - and column header', () => {
    getViewModelConfig().rowHeaderWidth = 40;
    getViewModelConfig().columnHeaderHeight = 21;
    const builder: CellSelectionPainterBuilder =
      new CellSelectionPainterBuilder()
        .setNumberOfTableRows(10)
        .setNumberOfTableColumns(5)
        .setTableRowHeaders(true)
        .setTableColumnHeaders(true)
        .selectBodyRange(createCellCoord(0, 0), createCellCoord(1, 1));
    const painter: CellSelectionPainter = builder.build();
    const bodyRange: Rectangle = painter.body.getRectangles()[0];
    expect(bodyRange.top === config!.rowHeight).toBeTruthy();
    expect(bodyRange.left === config!.rowHeaderWidth).toBeTruthy();
    expect(bodyRange.width === 2 * config!.columnWidth).toBeTruthy();
    expect(bodyRange.height === 2 * config!.rowHeight).toBeTruthy();
    builder.destroy();
    getViewModelConfig().rowHeaderWidth = undefined;
    getViewModelConfig().columnHeaderHeight = undefined;
  });
});

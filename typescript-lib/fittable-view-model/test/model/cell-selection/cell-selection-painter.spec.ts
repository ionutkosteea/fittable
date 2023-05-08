import {} from 'jasmine';

import {
  registerModelConfig,
  createCellCoord,
  unregisterModelConfig,
} from 'fittable-core/model';
import {
  registerViewModelConfig,
  CellSelectionPainter,
  Rectangle,
  unregisterViewModelConfig,
  getViewModelConfig,
  ViewModelConfig,
} from 'fittable-core/view-model';
import { FIT_MODEL_CONFIG } from 'fittable-model';

import { TST_VIEW_MODEL_CONFIG } from '../../tst-view-model-config.js';
import { CellSelectionPainterBuilder } from './cell-selection-painter-builder.js';

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
        .setNumberOfTableCols(5)
        .selectBodyRange(createCellCoord(0, 0));
    const painter: CellSelectionPainter = builder.build();
    const bodyRange: Rectangle = painter.body.getRectangles()[0];
    expect(bodyRange.top === 0).toBeTruthy();
    expect(bodyRange.left === 0).toBeTruthy();
    expect(bodyRange.width === config!.colWidths).toBeTruthy();
    expect(bodyRange.height === config!.rowHeights).toBeTruthy();
    builder.destroy();
  });

  it('select table body cell [1,1]', () => {
    const builder: CellSelectionPainterBuilder =
      new CellSelectionPainterBuilder()
        .setNumberOfTableRows(10)
        .setNumberOfTableCols(5)
        .selectBodyRange(createCellCoord(1, 1));
    const painter: CellSelectionPainter = builder.build();
    const bodyRange: Rectangle = painter.body.getRectangles()[0];
    expect(bodyRange.top === config!.rowHeights).toBeTruthy();
    expect(bodyRange.left === config!.colWidths).toBeTruthy();
    expect(bodyRange.width === config!.colWidths).toBeTruthy();
    expect(bodyRange.height === config!.rowHeights).toBeTruthy();
    builder.destroy();
  });

  it('select table body range [0,0,1,1]', () => {
    const builder: CellSelectionPainterBuilder =
      new CellSelectionPainterBuilder()
        .setNumberOfTableRows(10)
        .setNumberOfTableCols(5)
        .selectBodyRange(createCellCoord(0, 0), createCellCoord(1, 1));
    const painter: CellSelectionPainter = builder.build();
    const bodyRange: Rectangle = painter.body.getRectangles()[0];
    expect(bodyRange.top === 0).toBeTruthy();
    expect(bodyRange.left === 0).toBeTruthy();
    expect(bodyRange.width === 2 * config!.colWidths).toBeTruthy();
    expect(bodyRange.height === 2 * config!.rowHeights).toBeTruthy();
    builder.destroy();
  });

  it('select table body ranges [0,0] and [1,0,1,1]', () => {
    const builder: CellSelectionPainterBuilder =
      new CellSelectionPainterBuilder()
        .setNumberOfTableRows(10)
        .setNumberOfTableCols(5)
        .selectBodyRange(createCellCoord(0, 0))
        .selectBodyRange(createCellCoord(1, 0), createCellCoord(1, 1));
    const painter: CellSelectionPainter = builder.build();
    const bodyRange1: Rectangle = painter.body.getRectangles()[0];
    expect(bodyRange1.top === 0).toBeTruthy();
    expect(bodyRange1.left === 0).toBeTruthy();
    expect(bodyRange1.width === config!.colWidths).toBeTruthy();
    expect(bodyRange1.height === config!.rowHeights).toBeTruthy();
    const bodyRange2: Rectangle = painter.body.getRectangles()[1];
    expect(bodyRange2.top === config!.rowHeights).toBeTruthy();
    expect(bodyRange2.left === 0).toBeTruthy();
    expect(bodyRange2.width === 2 * config!.colWidths).toBeTruthy();
    expect(bodyRange2.height === config!.rowHeights).toBeTruthy();
    builder.destroy();
  });

  it('select range [0,0,1,1] in table with row - and column header', () => {
    getViewModelConfig().rowHeaderWidth = 40;
    getViewModelConfig().colHeaderHeight = 21;
    const builder: CellSelectionPainterBuilder =
      new CellSelectionPainterBuilder()
        .setNumberOfTableRows(10)
        .setNumberOfTableCols(5)
        .selectBodyRange(createCellCoord(0, 0), createCellCoord(1, 1));
    const painter: CellSelectionPainter = builder.build();
    const bodyRange: Rectangle = painter.body.getRectangles()[0];
    expect(bodyRange.top === config!.rowHeights).toBeTruthy();
    expect(bodyRange.left === config!.rowHeaderWidth).toBeTruthy();
    expect(bodyRange.width === 2 * config!.colWidths).toBeTruthy();
    expect(bodyRange.height === 2 * config!.rowHeights).toBeTruthy();
    builder.destroy();
    getViewModelConfig().rowHeaderWidth = undefined;
    getViewModelConfig().colHeaderHeight = undefined;
  });
});

import {} from 'jasmine';
import { Subject } from 'rxjs';

import {
  registerModelConfig,
  Table,
  createTable,
  CellCoord,
  createCellCoord,
  unregisterModelConfig,
  CellRange,
} from 'fit-core/model/index.js';
import {
  registerViewModelConfig,
  unregisterViewModelConfig,
} from 'fit-core/view-model/index.js';
import { FIT_MODEL_CONFIG } from '../../../fit-model/dist/index.js';
import { FIT_VIEW_MODEL_CONFIG } from '../../../fit-view-model/dist/index.js';

import { FitTableViewer } from '../../dist/model/table-viewer/fit-table-viewer.js';
import { FitCellSelection } from '../../dist/model/cell-selection/fit-cell-selection.js';

describe('Test CellSelectionRanges', () => {
  beforeAll((): void => {
    registerModelConfig(FIT_MODEL_CONFIG);
    registerViewModelConfig(FIT_VIEW_MODEL_CONFIG);
  });
  afterAll((): void => {
    unregisterModelConfig();
    unregisterViewModelConfig();
  });

  let cellSelector: FitCellSelection;
  beforeEach(() => {
    const table: Table = createTable();
    cellSelector = new FitCellSelection(new FitTableViewer(table));
    cellSelector.body.createRange();
  });

  it('simulate [1,1] cell selection', () => {
    cellSelector.body.addCell(createCellCoord(1, 1));
    expect(cellSelector.body.getFirstCell()).toBeTruthy();
    expect(!cellSelector.body.getLastCell()).toBeTruthy();
  });

  it('simulate [1,1] -> [1,2] cell selection', () => {
    cellSelector.body
      .addCell(createCellCoord(1, 1))
      .addCell(createCellCoord(1, 2));
    expect(cellSelector.body.getFirstCell()).toBeTruthy();
    expect(cellSelector.body.getLastCell()).toBeTruthy();
    expect(
      cellSelector.body.getFirstCell()?.equals(createCellCoord(1, 1))
    ).toBeTruthy();
    expect(
      cellSelector.body.getLastCell()?.equals(createCellCoord(1, 2))
    ).toBeTruthy();
  });

  it('check cell inside selection', () => {
    cellSelector.body
      .addCell(createCellCoord(3, 3))
      .addCell(createCellCoord(2, 3))
      .addCell(createCellCoord(1, 3))
      .addCell(createCellCoord(1, 2))
      .addCell(createCellCoord(1, 1));
    expect(cellSelector.body.hasCell(createCellCoord(2, 2))).toBeTruthy();
  });

  it('check cell outside of selection', () => {
    cellSelector.body
      .addCell(createCellCoord(3, 3))
      .addCell(createCellCoord(2, 3))
      .addCell(createCellCoord(1, 3))
      .addCell(createCellCoord(1, 2))
      .addCell(createCellCoord(1, 1));
    expect(cellSelector.body.hasCell(createCellCoord(4, 4))).toBeFalsy();
  });

  it('check end-selection observable', () => {
    let testCoord: CellCoord | undefined;
    cellSelector.body
      .onEnd$()
      .subscribe(() => (testCoord = cellSelector.body.getLastCell()));
    cellSelector.body
      .removeRanges()
      .createRange()
      .addCell(createCellCoord(1, 1))
      .addCell(createCellCoord(1, 2))
      .end();
    expect(testCoord && testCoord.equals(createCellCoord(1, 2))).toBeTruthy();
  });

  it('check selected cells', () => {
    cellSelector.body
      .addCell(createCellCoord(4, 1))
      .addCell(createCellCoord(4, 2))
      .addCell(createCellCoord(5, 2));
    let numberOfCells = 0;
    cellSelector.body.forEachCell(() => numberOfCells++);
    expect(numberOfCells === 4).toBeTruthy();
  });

  it('check selection ranges', () => {
    cellSelector.body
      .addCell(createCellCoord(4, 1))
      .addCell(createCellCoord(4, 2))
      .addCell(createCellCoord(5, 2))
      .createRange()
      .addCell(createCellCoord(6, 6));
    expect(cellSelector.body.hasCell(createCellCoord(4, 1))).toBeTruthy();
    expect(cellSelector.body.hasCell(createCellCoord(4, 2))).toBeTruthy();
    expect(cellSelector.body.hasCell(createCellCoord(5, 1))).toBeTruthy();
    expect(cellSelector.body.hasCell(createCellCoord(5, 2))).toBeTruthy();
    expect(cellSelector.body.hasCell(createCellCoord(6, 6))).toBeTruthy();
  });

  it('remove range methods', () => {
    cellSelector.body
      .addRange(createCellCoord(0, 0), createCellCoord(1, 1))
      .addRange(createCellCoord(2, 2))
      .addRange(createCellCoord(3, 3));

    const getLastCell = (): CellCoord | undefined =>
      cellSelector.body.getLastCell() ?? cellSelector.body.getFirstCell();

    expect(getLastCell()?.equals(createCellCoord(3, 3))).toBeTrue();

    cellSelector.body.removeLastRange();
    expect(getLastCell()?.equals(createCellCoord(2, 2))).toBeTrue();

    cellSelector.body.removePreviousRanges();
    expect(cellSelector.body.getRanges().length === 1).toBeTrue();
    expect(getLastCell()?.equals(createCellCoord(2, 2))).toBeTrue();
  });
});

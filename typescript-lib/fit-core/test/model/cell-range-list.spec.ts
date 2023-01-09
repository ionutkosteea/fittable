import {} from 'jasmine';

import {
  registerModelConfig,
  unregisterModelConfig,
  CellRangeList,
  CellRange,
  createCellCoord,
  createCellRange,
} from '../../dist/model/index.js';

import { tstModelConfig } from '../model/table/tst-model-config.js';

describe('Test CellRangeList', () => {
  beforeAll(() => registerModelConfig(tstModelConfig));
  afterAll(() => unregisterModelConfig());

  it('one cell selection', () => {
    const rangeList: CellRangeList = new CellRangeList().addCell(0, 0);
    const ranges: CellRange[] = rangeList.getRanges();
    expect(ranges.length === 1).toBeTruthy();
    expect(ranges[0].getFrom().equals(createCellCoord(0, 0))).toBeTruthy();
    expect(ranges[0].getTo().equals(createCellCoord(0, 0))).toBeTruthy();
  });

  it('one row selection', () => {
    const rangeList: CellRangeList = new CellRangeList()
      .addCell(0, 0)
      .addCell(0, 1)
      .addCell(0, 2);
    const ranges: CellRange[] = rangeList.getRanges();
    expect(ranges.length === 1).toBeTruthy();
    expect(ranges[0].getFrom().equals(createCellCoord(0, 0))).toBeTruthy();
    expect(ranges[0].getTo().equals(createCellCoord(0, 2))).toBeTruthy();
  });

  it('one column selection', () => {
    const rangeList: CellRangeList = new CellRangeList()
      .addCell(0, 0)
      .addCell(1, 0)
      .addCell(2, 0);
    const ranges: CellRange[] = rangeList.getRanges();
    expect(ranges.length === 1).toBeTruthy();
    expect(ranges[0].getFrom().equals(createCellCoord(0, 0))).toBeTruthy();
    expect(ranges[0].getTo().equals(createCellCoord(2, 0))).toBeTruthy();
  });

  it('two rows selection', () => {
    const rangeList: CellRangeList = new CellRangeList()
      .addCell(0, 0)
      .addCell(0, 1)
      .addCell(0, 2)
      .addCell(1, 0)
      .addCell(1, 1)
      .addCell(1, 2);

    const ranges: CellRange[] = rangeList.getRanges();
    expect(ranges.length === 1).toBeTruthy();
    expect(ranges[0].getFrom().equals(createCellCoord(0, 0))).toBeTruthy();
    expect(ranges[0].getTo().equals(createCellCoord(1, 2))).toBeTruthy();
  });

  it('three rows selection', () => {
    const rangeList: CellRangeList = new CellRangeList()
      .addCell(0, 0)
      .addCell(0, 1)
      .addCell(0, 2)
      .addCell(1, 0)
      .addCell(1, 1)
      .addCell(1, 2)
      .addCell(2, 0)
      .addCell(2, 1)
      .addCell(2, 2);
    const ranges: CellRange[] = rangeList.getRanges();
    expect(ranges.length === 1).toBeTruthy();
    expect(ranges[0].getFrom().equals(createCellCoord(0, 0))).toBeTruthy();
    expect(ranges[0].getTo().equals(createCellCoord(2, 2))).toBeTruthy();
  });

  it('[0,0], [0,1], [1,0]', () => {
    const rangeList: CellRangeList = new CellRangeList()
      .addCell(0, 0)
      .addCell(0, 1)
      .addCell(1, 0);
    const ranges: CellRange[] = rangeList.getRanges();
    expect(ranges.length === 2).toBeTruthy();
    expect(ranges[0].getFrom().equals(createCellCoord(0, 0))).toBeTruthy();
    expect(ranges[0].getTo().equals(createCellCoord(0, 1))).toBeTruthy();
    expect(ranges[1].getFrom().equals(createCellCoord(1, 0))).toBeTruthy();
    expect(ranges[1].getTo().equals(createCellCoord(1, 0))).toBeTruthy();
  });

  it('[0,0], [1,0], [1,1]', () => {
    const rangeList: CellRangeList = new CellRangeList()
      .addCell(0, 0)
      .addCell(1, 0)
      .addCell(1, 1);
    const ranges: CellRange[] = rangeList.getRanges();
    expect(ranges.length === 2).toBeTruthy();
    expect(ranges[0].getFrom().equals(createCellCoord(0, 0))).toBeTruthy();
    expect(ranges[0].getTo().equals(createCellCoord(1, 0))).toBeTruthy();
    expect(ranges[1].getFrom().equals(createCellCoord(1, 1))).toBeTruthy();
    expect(ranges[1].getTo().equals(createCellCoord(1, 1))).toBeTruthy();
  });

  it('[0,1], [1,0], [1,1]', () => {
    const rangeList: CellRangeList = new CellRangeList()
      .addCell(0, 1)
      .addCell(1, 0)
      .addCell(1, 1);
    const ranges: CellRange[] = rangeList.getRanges();
    expect(ranges.length === 2).toBeTruthy();
    expect(ranges[0].getFrom().equals(createCellCoord(0, 1))).toBeTruthy();
    expect(ranges[0].getTo().equals(createCellCoord(0, 1))).toBeTruthy();
    expect(ranges[1].getFrom().equals(createCellCoord(1, 0))).toBeTruthy();
    expect(ranges[1].getTo().equals(createCellCoord(1, 1))).toBeTruthy();
  });

  it('[0,1], [1,0], [1,1], [1,2], [2,1]', () => {
    const rangeList: CellRangeList = new CellRangeList()
      .addCell(0, 1)
      .addCell(1, 0)
      .addCell(1, 1)
      .addCell(1, 2)
      .addCell(2, 1);
    const ranges: CellRange[] = rangeList.getRanges();
    expect(ranges.length === 3).toBeTruthy();
    expect(ranges[0].getFrom().equals(createCellCoord(0, 1))).toBeTruthy();
    expect(ranges[0].getTo().equals(createCellCoord(0, 1))).toBeTruthy();
    expect(ranges[1].getFrom().equals(createCellCoord(1, 0))).toBeTruthy();
    expect(ranges[1].getTo().equals(createCellCoord(1, 2))).toBeTruthy();
    expect(ranges[2].getFrom().equals(createCellCoord(2, 1))).toBeTruthy();
    expect(ranges[2].getTo().equals(createCellCoord(2, 1))).toBeTruthy();
  });

  it('[0,0], [0,1], [1,0], [1,1], [1,1], [1,2], [2,1], [2,2]', () => {
    const rangeList: CellRangeList = new CellRangeList();
    const inputRangeList: CellRange[] = [
      createCellRange(createCellCoord(0, 0), createCellCoord(1, 1)),
      createCellRange(createCellCoord(1, 1), createCellCoord(2, 2)),
    ];
    for (const range of inputRangeList) {
      range.forEachCell((rowId: number, colId: number) =>
        rangeList.addCell(rowId, colId)
      );
    }
    const ranges: CellRange[] = rangeList.getRanges();
    expect(ranges.length === 3).toBeTruthy();
    expect(ranges[0].getFrom().equals(createCellCoord(0, 0))).toBeTruthy();
    expect(ranges[0].getTo().equals(createCellCoord(1, 1))).toBeTruthy();
    expect(ranges[1].getFrom().equals(createCellCoord(1, 2))).toBeTruthy();
    expect(ranges[1].getTo().equals(createCellCoord(1, 2))).toBeTruthy();
    expect(ranges[2].getFrom().equals(createCellCoord(2, 1))).toBeTruthy();
    expect(ranges[2].getTo().equals(createCellCoord(2, 2))).toBeTruthy();
  });

  it('[1,1], [1,2], [1,3], [2,3], [3,3]', () => {
    const rangeList: CellRangeList = new CellRangeList()
      .addCell(1, 1)
      .addCell(1, 2)
      .addCell(1, 3)
      .addCell(2, 3)
      .addCell(3, 3);
    expect(rangeList.getRanges().length === 2).toBeTruthy();
  });
});

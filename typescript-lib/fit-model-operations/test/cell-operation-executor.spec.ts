import {} from 'jasmine';

import { TableOperationExecutor } from './model/table-operation-executor.js';

describe('Cell Operation Executor', () => {
  let executor: TableOperationExecutor;

  beforeEach(() => {
    executor = new TableOperationExecutor();
  });

  it('update cell with defined value', () => {
    executor //
      .createTable(1, 1)
      .runCellValue(0, 0, 1000);

    expect(executor.getCellValue(0, 0) === 1000).toBeTruthy();
  });

  it('undo update cell with defined value', () => {
    executor //
      .createTable(1, 1)
      .runCellValue(0, 0, 1000)
      .runUndo();

    expect(executor.getCellValue(0, 0)).toBeFalsy();
  });

  it('update cell with undefined value', () => {
    executor //
      .createTable(1, 1)
      .setCellValue(0, 0, 1000)
      .runCellValue(0, 0, undefined);

    expect(executor.getCellValue(0, 0)).toBeFalsy();
  });

  it('undo update cell with undefined value', () => {
    executor //
      .createTable(1, 1)
      .setCellValue(0, 0, 1000)
      .runCellValue(0, 0, undefined)
      .runUndo();

    expect(executor.getCellValue(0, 0) === 1000).toBeTruthy();
  });

  it('remove cell with defined value', () => {
    executor //
      .createTable(1, 1)
      .setCellValue(0, 0, 1000)
      .selectCell(0, 0)
      .runRemoveCells();

    expect(executor.getCellValue(0, 0)).toBeFalsy();
  });

  it('remove cell with defined style', () => {
    executor //
      .createTable(1, 1)
      .addStyle('s0', { color: 'blue' })
      .setCellStyleName(0, 0, 's0')
      .selectCell(0, 0)
      .runRemoveCells();

    expect(executor.getStyle('s0')).toBeFalsy();
    expect(executor.getCellValue(0, 0)).toBeFalsy();
  });

  it('remove cell with defined value and style', () => {
    executor //
      .createTable(1, 1)
      .addStyle('s0', { color: 'blue' })
      .setCellStyleName(0, 0, 's0')
      .setCellValue(0, 0, 1000)
      .selectCell(0, 0)
      .runRemoveCells();

    expect(executor.getStyle('s0')).toBeFalsy();
    expect(executor.getCellValue(0, 0)).toBeFalsy();
  });

  it('remove cell with defined style (style shall not be removed)', () => {
    executor //
      .createTable(2, 1)
      .addStyle('s0', { color: 'blue' })
      .setCellStyleName(0, 0, 's0')
      .setCellStyleName(1, 0, 's0')
      .selectCell(0, 0)
      .runRemoveCells();

    expect(executor.getStyle('s0')).toBeTruthy();
    expect(executor.getCellStyleName(0, 0)).toBeFalsy();
    expect(executor.getCellStyleName(1, 0)).toBeTruthy();
  });

  it('remove two cells with defined value)', () => {
    executor //
      .createTable(2, 1)
      .setCellValue(0, 0, 1000)
      .setCellValue(1, 0, 2000)
      .selectCell(0, 0)
      .selectCell(1, 0)
      .runRemoveCells();

    expect(executor.getCellValue(0, 0)).toBeFalsy();
    expect(executor.getCellValue(1, 0)).toBeFalsy();
  });

  it('undo - remove cell with defined value', () => {
    executor //
      .createTable(1, 1)
      .setCellValue(0, 0, 1000)
      .selectCell(0, 0)
      .runRemoveCells()
      .runUndo();

    expect(executor.getCellValue(0, 0) === 1000).toBeTruthy();
  });

  it('redo - remove cell with defined value', () => {
    executor //
      .createTable(1, 1)
      .setCellValue(0, 0, 1000)
      .selectCell(0, 0)
      .runRemoveCells()
      .runUndo()
      .runRedo();

    expect(executor.getCellValue(0, 0)).toBeFalsy();
  });

  it('undo - remove cell with defined style', () => {
    executor //
      .createTable(1, 1)
      .addStyle('s0', { color: 'blue' })
      .setCellStyleName(0, 0, 's0')
      .selectCell(0, 0)
      .runRemoveCells()
      .runUndo();

    expect(executor.getStyle('s0')?.get('color') === 'blue').toBeTruthy();
    expect(executor.getCellStyleName(0, 0) === 's0').toBeTruthy();
  });

  it('undo - remove cell with defined style', () => {
    executor //
      .createTable(1, 1)
      .addStyle('s0', { color: 'blue' })
      .setCellStyleName(0, 0, 's0')
      .selectCell(0, 0)
      .runRemoveCells()
      .runUndo()
      .runRedo();

    expect(executor.getStyle('s0')).toBeFalsy();
    expect(executor.getCellStyleName(0, 0)).toBeFalsy();
  });
});

import {} from 'jasmine';

import { TableOperationExecutor } from './model/table-operation-executor.js';

describe('Line Operation Executor', () => {
  let executor: TableOperationExecutor;

  beforeEach(() => {
    executor = new TableOperationExecutor();
  });

  it('remove first row from two rows table', () => {
    executor //
      .createTable(2, 1)
      .setCellValue(0, 0, 1000)
      .setCellValue(1, 0, 2000)
      .selectCell(0, 0)
      .runRemoveRows();

    expect(executor.getNumberOfRows() === 1).toBeTruthy();
    expect(executor.getCellValue(0, 0) === 2000).toBeTruthy();
  });

  it('remove last row from two rows table', () => {
    executor //
      .createTable(2, 1)
      .setCellValue(0, 0, 1000)
      .setCellValue(1, 0, 2000)
      .selectCell(1, 0)
      .runRemoveRows();

    expect(executor.getNumberOfRows() === 1).toBeTruthy();
    expect(executor.getCellValue(0, 0) === 1000).toBeTruthy();
  });

  it('remove first row from three rows table', () => {
    executor //
      .createTable(3, 1)
      .setCellValue(0, 0, 1000)
      .setCellValue(1, 0, 2000)
      .setCellValue(2, 0, 3000)
      .selectCell(0, 0)
      .runRemoveRows();

    expect(executor.getNumberOfRows() === 2).toBeTruthy();
    expect(executor.getCellValue(0, 0) === 2000).toBeTruthy();
    expect(executor.getCellValue(1, 0) === 3000).toBeTruthy();
  });

  it('remove last row from three rows table', () => {
    executor //
      .createTable(3, 1)
      .setCellValue(0, 0, 1000)
      .setCellValue(1, 0, 2000)
      .setCellValue(2, 0, 3000)
      .selectCell(2, 0)
      .runRemoveRows();

    expect(executor.getNumberOfRows() === 2).toBeTruthy();
    expect(executor.getCellValue(0, 0) === 1000).toBeTruthy();
    expect(executor.getCellValue(1, 0) === 2000).toBeTruthy();
  });

  it('remove middle row from three rows table', () => {
    executor //
      .createTable(3, 1)
      .setCellValue(0, 0, 1000)
      .setCellValue(1, 0, 2000)
      .setCellValue(2, 0, 3000)
      .selectCell(1, 0)
      .runRemoveRows();

    expect(executor.getNumberOfRows() === 2).toBeTruthy();
    expect(executor.getCellValue(0, 0) === 1000).toBeTruthy();
    expect(executor.getCellValue(1, 0) === 3000).toBeTruthy();
  });

  it('remove last two rows of three rows table', () => {
    executor //
      .createTable(3, 1)
      .setCellValue(0, 0, 1000)
      .setCellValue(1, 0, 2000)
      .setCellValue(2, 0, 3000)
      .selectCell(1, 0)
      .selectCell(2, 0)
      .runRemoveRows();

    expect(executor.getNumberOfRows() === 1).toBeTruthy();
    expect(executor.getCellValue(0, 0) === 1000).toBeTruthy();
  });

  it('remove first two rows of three rows table', () => {
    executor //
      .createTable(3, 1)
      .setCellValue(0, 0, 1000)
      .setCellValue(1, 0, 2000)
      .setCellValue(2, 0, 3000)
      .selectCell(0, 0)
      .selectCell(1, 0)
      .runRemoveRows();

    expect(executor.getNumberOfRows() === 1).toBeTruthy();
    expect(executor.getCellValue(0, 0) === 3000).toBeTruthy();
  });

  it('remove row one and three of three rows table', () => {
    executor //
      .createTable(3, 1)
      .setCellValue(0, 0, 1000)
      .setCellValue(1, 0, 2000)
      .setCellValue(2, 0, 3000)
      .selectCell(0, 0)
      .selectCell(2, 0)
      .runRemoveRows();

    expect(executor.getNumberOfRows() === 1).toBeTruthy();
    expect(executor.getCellValue(0, 0) === 2000).toBeTruthy();
  });

  it('insert before -> one row at the beginning of the table', () => {
    executor //
      .createTable(2, 1)
      .setCellValue(0, 0, 1000)
      .setCellValue(1, 0, 2000)
      .selectCell(0, 0)
      .runInsertRowsBefore(1);

    expect(executor.getNumberOfRows() === 3).toBeTruthy();
    expect(executor.getCellValue(0, 0)).toBeFalsy();
    expect(executor.getCellValue(1, 0) === 1000).toBeTruthy();
    expect(executor.getCellValue(2, 0) === 2000).toBeTruthy();
  });

  it('insert before -> one row in the middle of the table', () => {
    executor //
      .createTable(2, 1)
      .setCellValue(0, 0, 1000)
      .setCellValue(1, 0, 2000)
      .selectCell(1, 0)
      .runInsertRowsBefore(1);

    expect(executor.getNumberOfRows() === 3).toBeTruthy();
    expect(executor.getCellValue(0, 0) === 1000).toBeTruthy();
    expect(executor.getCellValue(1, 0)).toBeFalsy();
    expect(executor.getCellValue(2, 0) === 2000).toBeTruthy();
  });

  it('insert before -> one row at the end of the table', () => {
    executor //
      .createTable(2, 1)
      .setCellValue(0, 0, 1000)
      .setCellValue(1, 0, 2000)
      .selectCell(2, 0)
      .runInsertRowsBefore(1);

    expect(executor.getNumberOfRows() === 3).toBeTruthy();
    expect(executor.getCellValue(0, 0) === 1000).toBeTruthy();
    expect(executor.getCellValue(1, 0) === 2000).toBeTruthy();
    expect(executor.getCellValue(2, 0)).toBeFalsy();
  });

  it('insert before -> two rows at the begining of the table', () => {
    executor //
      .createTable(2, 1)
      .setCellValue(0, 0, 1000)
      .setCellValue(1, 0, 2000)
      .selectCell(0, 0)
      .runInsertRowsBefore(2);

    expect(executor.getNumberOfRows() === 4).toBeTruthy();
    expect(executor.getCellValue(0, 0)).toBeFalsy();
    expect(executor.getCellValue(1, 0)).toBeFalsy();
    expect(executor.getCellValue(2, 0) === 1000).toBeTruthy();
    expect(executor.getCellValue(3, 0) === 2000).toBeTruthy();
  });

  it('insert after -> one row after the the first row', () => {
    executor //
      .createTable(2, 1)
      .setCellValue(0, 0, 1000)
      .setCellValue(1, 0, 2000)
      .selectCell(0, 0)
      .runInsertRowsAfter(1);

    expect(executor.getNumberOfRows() === 3).toBeTruthy();
    expect(executor.getCellValue(0, 0) === 1000).toBeTruthy();
    expect(executor.getCellValue(1, 0)).toBeFalsy();
    expect(executor.getCellValue(2, 0) === 2000).toBeTruthy();
  });

  it('insert after -> two rows at the middle of the table', () => {
    executor //
      .createTable(2, 1)
      .setCellValue(0, 0, 1000)
      .setCellValue(1, 0, 2000)
      .selectCell(0, 0)
      .runInsertRowsAfter(2);

    expect(executor.getNumberOfRows() === 4).toBeTruthy();
    expect(executor.getCellValue(0, 0) === 1000).toBeTruthy();
    expect(executor.getCellValue(1, 0)).toBeFalsy();
    expect(executor.getCellValue(2, 0)).toBeFalsy();
    expect(executor.getCellValue(3, 0) === 2000).toBeTruthy();
  });

  it('insert after -> one row after the last row', () => {
    executor //
      .createTable(2, 1)
      .setCellValue(0, 0, 1000)
      .setCellValue(1, 0, 2000)
      .selectCell(1, 0)
      .runInsertRowsAfter(1);

    expect(executor.getNumberOfRows() === 3).toBeTruthy();
    expect(executor.getCellValue(0, 0) === 1000).toBeTruthy();
    expect(executor.getCellValue(1, 0) === 2000).toBeTruthy();
    expect(executor.getCellValue(2, 0)).toBeFalsy();
  });

  it('insert after -> two rows after the last row', () => {
    executor //
      .createTable(1, 1)
      .setCellValue(0, 0, 1000)
      .selectCell(0, 0)
      .runInsertRowsAfter(2);

    expect(executor.getNumberOfRows() === 3).toBeTruthy();
    expect(executor.getCellValue(0, 0) === 1000).toBeTruthy();
    expect(executor.getCellValue(1, 0)).toBeFalsy();
    expect(executor.getCellValue(2, 0)).toBeFalsy();
  });

  it('undo -> remove first row', () => {
    executor //
      .createTable(2, 1)
      .setCellValue(0, 0, 1000)
      .setCellValue(1, 0, 2000)
      .selectCell(0, 0)
      .runRemoveRows()
      .runUndo();

    expect(executor.getNumberOfRows() === 2).toBeTruthy();
    expect(executor.getCellValue(0, 0) === 1000).toBeTruthy();
    expect(executor.getCellValue(1, 0) === 2000).toBeTruthy();
  });

  it('undo -> remove two middle rows', () => {
    executor //
      .createTable(4, 1)
      .setCellValue(0, 0, 1000)
      .setCellValue(1, 0, 2000)
      .setCellValue(2, 0, 3000)
      .setCellValue(3, 0, 4000)
      .selectCell(1, 0)
      .selectCell(2, 0)
      .runRemoveRows()
      .runUndo();

    expect(executor.getNumberOfRows() === 4).toBeTruthy();
    expect(executor.getCellValue(0, 0) === 1000).toBeTruthy();
    expect(executor.getCellValue(1, 0) === 2000).toBeTruthy();
    expect(executor.getCellValue(2, 0) === 3000).toBeTruthy();
    expect(executor.getCellValue(3, 0) === 4000).toBeTruthy();
  });

  it('undo -> remove two different row groups', () => {
    executor //
      .createTable(5, 1)
      .setCellValue(0, 0, 1000)
      .setCellValue(1, 0, 2000)
      .setCellValue(2, 0, 3000)
      .setCellValue(3, 0, 4000)
      .setCellValue(4, 0, 5000)
      .selectCell(1, 0)
      .selectCell(2, 0)
      .selectCell(4, 0)
      .runRemoveRows()
      .runUndo();

    expect(executor.getNumberOfRows() === 5).toBeTruthy();
    expect(executor.getCellValue(0, 0) === 1000).toBeTruthy();
    expect(executor.getCellValue(1, 0) === 2000).toBeTruthy();
    expect(executor.getCellValue(2, 0) === 3000).toBeTruthy();
    expect(executor.getCellValue(3, 0) === 4000).toBeTruthy();
    expect(executor.getCellValue(4, 0) === 5000).toBeTruthy();
  });

  it('undo -> remove styled row', () => {
    executor //
      .createTable(2, 1)
      .addStyle('s0', { color: 'blue' })
      .setCellStyleName(0, 0, 's0')
      .setCellStyleName(1, 0, 's0')
      .selectCell(0, 0)
      .selectCell(1, 0)
      .runRemoveCells()
      .runUndo();

    expect(executor.getNumberOfStyles() === 1).toBeTruthy();
    expect(executor.getCellStyleName(0, 0) === 's0').toBeTruthy();
    expect(executor.getCellStyleName(1, 0) === 's0').toBeTruthy();
  });

  it('undo -> insert first row', () => {
    executor //
      .createTable(2, 1)
      .setCellValue(0, 0, 1000)
      .setCellValue(1, 0, 2000)
      .selectCell(1, 0)
      .runInsertRowsBefore(1)
      .runUndo();

    expect(executor.getNumberOfRows() === 2).toBeTruthy();
    expect(executor.getCellValue(0, 0) === 1000).toBeTruthy();
    expect(executor.getCellValue(1, 0) === 2000).toBeTruthy();
  });

  it('undo -> insert two rows at the middle of the table', () => {
    executor //
      .createTable(2, 1)
      .setCellValue(0, 0, 1000)
      .setCellValue(1, 0, 2000)
      .selectCell(1, 0)
      .runInsertRowsBefore(2)
      .runUndo();

    expect(executor.getNumberOfRows() === 2).toBeTruthy();
    expect(executor.getCellValue(0, 0) === 1000).toBeTruthy();
    expect(executor.getCellValue(1, 0) === 2000).toBeTruthy();
  });

  it('undo -> insert row at the end of the table', () => {
    executor //
      .createTable(2, 1)
      .setCellValue(0, 0, 1000)
      .setCellValue(1, 0, 2000)
      .selectCell(1, 0)
      .runInsertRowsAfter(1)
      .runUndo();

    expect(executor.getNumberOfRows() === 2).toBeTruthy();
    expect(executor.getCellValue(0, 0) === 1000).toBeTruthy();
    expect(executor.getCellValue(1, 0) === 2000).toBeTruthy();
  });

  it('remove first column', () => {
    executor //
      .createTable(1, 3)
      .setCellValue(0, 0, 1000)
      .setCellValue(0, 1, 2000)
      .setCellValue(0, 2, 3000)
      .selectCell(0, 0)
      .runRemoveColumns();

    expect(executor.getNumberOfColumns() === 2).toBeTruthy();
    expect(executor.getCellValue(0, 0) === 2000).toBeTruthy();
    expect(executor.getCellValue(0, 1) === 3000).toBeTruthy();
  });

  it('remove last column', () => {
    executor //
      .createTable(1, 3)
      .setCellValue(0, 0, 1000)
      .setCellValue(0, 1, 2000)
      .setCellValue(0, 2, 3000)
      .selectCell(0, 2)
      .runRemoveColumns();

    expect(executor.getNumberOfColumns() === 2).toBeTruthy();
    expect(executor.getCellValue(0, 0) === 1000).toBeTruthy();
    expect(executor.getCellValue(0, 1) === 2000).toBeTruthy();
  });

  it('remove middle column', () => {
    executor //
      .createTable(1, 3)
      .setCellValue(0, 0, 1000)
      .setCellValue(0, 1, 2000)
      .setCellValue(0, 2, 3000)
      .selectCell(0, 1)
      .runRemoveColumns();

    expect(executor.getNumberOfColumns() === 2).toBeTruthy();
    expect(executor.getCellValue(0, 0) === 1000).toBeTruthy();
    expect(executor.getCellValue(0, 1) === 3000).toBeTruthy();
  });

  it('remove multiple columns', () => {
    executor //
      .createTable(1, 3)
      .setCellValue(0, 0, 1000)
      .setCellValue(0, 1, 2000)
      .setCellValue(0, 2, 3000)
      .selectCell(0, 0)
      .selectCell(0, 2)
      .runRemoveColumns();

    expect(executor.getNumberOfColumns() === 1).toBeTruthy();
    expect(executor.getCellValue(0, 0) === 2000).toBeTruthy();
  });

  it('remove styled column', () => {
    executor //
      .createTable(1, 1)
      .addStyle('s0', { color: 'blue' })
      .setCellStyleName(0, 0, 's0')
      .selectCell(0, 0)
      .runRemoveColumns();

    expect(executor.getNumberOfStyles() === 0);
    expect(executor.getCellStyleName(0, 0)).toBeFalsy();
  });

  it('insert column before', () => {
    executor //
      .createTable(1, 1)
      .setCellValue(0, 0, 1000)
      .selectCell(0, 0)
      .runInsertColumnsBefore(1);

    expect(executor.getNumberOfColumns() === 2).toBeTruthy();
    expect(executor.getCellValue(0, 0)).toBeFalsy();
    expect(executor.getCellValue(0, 1) === 1000).toBeTruthy();
  });

  it('insert column after', () => {
    executor //
      .createTable(1, 1)
      .setCellValue(0, 0, 1000)
      .selectCell(0, 0)
      .runInsertColumnsAfter(1);

    expect(executor.getNumberOfColumns() === 2).toBeTruthy();
    expect(executor.getCellValue(0, 0) === 1000).toBeTruthy();
    expect(executor.getCellValue(0, 1)).toBeFalsy();
  });

  it('insert multiple columns in the middle', () => {
    executor //
      .createTable(1, 2)
      .setCellValue(0, 0, 1000)
      .setCellValue(0, 1, 2000)
      .selectCell(0, 1)
      .runInsertColumnsBefore(2);

    expect(executor.getNumberOfColumns() === 4).toBeTruthy();
    expect(executor.getCellValue(0, 0) === 1000).toBeTruthy();
    expect(executor.getCellValue(0, 1)).toBeFalsy();
    expect(executor.getCellValue(0, 2)).toBeFalsy();
    expect(executor.getCellValue(0, 3) === 2000).toBeTruthy();
  });

  it('insert 2 columns one after another', () => {
    executor //
      .createTable(1, 1)
      .setCellValue(0, 0, 1000)
      .selectCell(0, 0)
      .runInsertColumnsAfter(1)
      .runInsertColumnsAfter(1);

    expect(executor.getNumberOfColumns() === 3).toBeTruthy();
    expect(executor.getCellValue(0, 0) === 1000).toBeTruthy();
    expect(executor.getCellValue(0, 1)).toBeFalsy();
    expect(executor.getCellValue(0, 2)).toBeFalsy();
  });

  it('undo -> remove first column', () => {
    executor //
      .createTable(1, 2)
      .setCellValue(0, 0, 1000)
      .setCellValue(0, 1, 2000)
      .selectCell(0, 0)
      .runRemoveColumns()
      .runUndo();

    expect(executor.getNumberOfColumns() === 2).toBeTruthy();
    expect(executor.getCellValue(0, 0) === 1000).toBeTruthy();
    expect(executor.getCellValue(0, 1) === 2000).toBeTruthy();
  });

  it('redo -> remove first column', () => {
    executor //
      .createTable(1, 2)
      .setCellValue(0, 0, 1000)
      .setCellValue(0, 1, 2000)
      .selectCell(0, 0)
      .runRemoveColumns()
      .runUndo()
      .runRedo();

    expect(executor.getNumberOfColumns() === 1).toBeTruthy();
    expect(executor.getCellValue(0, 0) === 2000).toBeTruthy();
  });

  it('undo -> remove last column', () => {
    executor //
      .createTable(1, 2)
      .setCellValue(0, 0, 1000)
      .setCellValue(0, 1, 2000)
      .selectCell(0, 1)
      .runRemoveColumns()
      .runUndo();

    expect(executor.getNumberOfColumns() === 2).toBeTruthy();
    expect(executor.getCellValue(0, 0) === 1000).toBeTruthy();
    expect(executor.getCellValue(0, 1) === 2000).toBeTruthy();
  });

  it('redo -> remove last column', () => {
    executor //
      .createTable(1, 2)
      .setCellValue(0, 0, 1000)
      .setCellValue(0, 1, 2000)
      .selectCell(0, 1)
      .runRemoveColumns()
      .runUndo()
      .runRedo();

    expect(executor.getNumberOfColumns() === 1).toBeTruthy();
    expect(executor.getCellValue(0, 0) === 1000).toBeTruthy();
  });

  it('undo -> remove middle columns', () => {
    executor //
      .createTable(1, 4)
      .setCellValue(0, 0, 1000)
      .setCellValue(0, 1, 2000)
      .setCellValue(0, 2, 3000)
      .setCellValue(0, 3, 4000)
      .selectCell(0, 1)
      .selectCell(0, 2)
      .runRemoveColumns()
      .runUndo();

    expect(executor.getNumberOfColumns() === 4).toBeTruthy();
    expect(executor.getCellValue(0, 0) === 1000).toBeTruthy();
    expect(executor.getCellValue(0, 1) === 2000).toBeTruthy();
    expect(executor.getCellValue(0, 2) === 3000).toBeTruthy();
    expect(executor.getCellValue(0, 3) === 4000).toBeTruthy();
  });

  it('undo -> remove columns, incl. cell styles and values', () => {
    executor //
      .createTable(2, 2)
      .addStyle('s0', { color: 'blue' })
      .setCellValue(0, 0, 1000)
      .setCellValue(0, 1, 2000)
      .setCellValue(1, 0, 3000)
      .setCellValue(1, 1, 4000)
      .setCellStyleName(0, 0, 's0')
      .setCellStyleName(0, 1, 's0')
      .setCellStyleName(1, 0, 's0')
      .selectCell(0, 0)
      .selectCell(0, 1)
      .runRemoveColumns()
      .runUndo();

    expect(executor.getNumberOfStyles() === 1).toBeTruthy();
    expect(executor.getCellValue(0, 0) === 1000).toBeTruthy();
    expect(executor.getCellValue(0, 1) === 2000).toBeTruthy();
    expect(executor.getCellValue(1, 0) === 3000).toBeTruthy();
    expect(executor.getCellValue(1, 1) === 4000).toBeTruthy();
    expect(executor.getCellStyleName(0, 0) === 's0').toBeTruthy();
    expect(executor.getCellStyleName(0, 1) === 's0').toBeTruthy();
    expect(executor.getCellStyleName(1, 0) === 's0').toBeTruthy();
  });

  it('resize one inexistent row', () => {
    executor //
      .createTable(1, 1)
      .selectCell(0, 0)
      .runResizeRows(40);

    expect(executor.getRowHeight(0) === 40).toBeTruthy();
  });

  it('resize two inexistent rows', () => {
    executor //
      .createTable(2, 1)
      .selectCell(0, 0)
      .selectCell(1, 0)
      .runResizeRows(40);

    expect(executor.getRowHeight(0) === 40).toBeTruthy();
    expect(executor.getRowHeight(1) === 40).toBeTruthy();
  });

  it('resize row with no height defined', () => {
    executor //
      .createTable(1, 1)
      .setCellValue(0, 0, 1000)
      .selectCell(0, 0)
      .runResizeRows(40);

    expect(executor.getRowHeight(0) === 40).toBeTruthy();
  });

  it('resize one inexistent column', () => {
    executor //
      .createTable(1, 1)
      .selectCell(0, 0)
      .runResizeColumns(200);

    expect(executor.getColumnWidth(0) === 200).toBeTruthy();
  });

  it('undo -> remove first - and third row from three rows table', () => {
    executor //
      .createTable(3, 1)
      .setCellValue(0, 0, 1)
      .setCellValue(1, 0, 2)
      .setCellValue(2, 0, 3)
      .selectCell(0, 0)
      .selectCell(1, 0)
      .runRemoveRows()
      .runUndo();

    expect(executor.getCellValue(0, 0) === 1).toBeTruthy();
    expect(executor.getCellValue(1, 0) === 2).toBeTruthy();
    expect(executor.getCellValue(2, 0) === 3).toBeTruthy();
  });

  it('remove absent row', () => {
    executor //
      .createTable(1, 1)
      .selectCell(0, 0)
      .runRemoveRows()
      .runRemoveColumns();

    expect(executor.getTable().getNumberOfRows() === 0).toBeTruthy();
    expect(executor.getTable().getNumberOfColumns() === 0).toBeTruthy();
  });
});

import { } from 'jasmine';

import {
  CellRange,
  createCellCoord,
  createCellRange,
  createStyle,
  createTable,
  registerModelConfig,
  unregisterModelConfig,
} from 'fittable-core/model';
import {
  createOperationExecutor,
  OperationExecutor,
  registerOperationConfig,
  unregisterOperationConfig,
} from 'fittable-core/operations';
import {
  asValueControl,
  Control,
  createContextMenu,
  registerViewModelConfig,
  unregisterViewModelConfig,
  Window,
} from 'fittable-core/view-model';
import { FitStyle, FitTable, FIT_MODEL_CONFIG } from 'fittable-model';
import { FIT_OPERATION_CONFIG } from 'fittable-model-operations';

import {
  FitContextMenuControlId,
  FIT_VIEW_MODEL_CONFIG,
} from '../../../dist/index.js';

describe('Context menu', (): void => {
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

  it('resize rows', (): void => {
    const table: FitTable = createTable<FitTable>();
    const operationExecutor: OperationExecutor = createOperationExecutor()
      .setTable(table);
    const contextMenu: Window = createContextMenu({
      operationExecutor,
      getSelectedCells: (): CellRange[] => [
        createCellRange(createCellCoord(1, 0), createCellCoord(2, 0)),
      ],
    });
    const controlId: FitContextMenuControlId = 'row-height';
    const control: Control = contextMenu.getControl(controlId);
    asValueControl(control)?.setValue(42).run();

    expect(table.getRowHeight(1) === 42).toBeTruthy();
    expect(table.getRowHeight(2) === 42).toBeTruthy();
  });

  it('insert rows above', (): void => {
    const table: FitTable = createTable<FitTable>()
      .setNumberOfRows(10)
      .setNumberOfCols(10)
      .setCellValue(0, 0, 'bookmark');
    const operationExecutor: OperationExecutor = createOperationExecutor()
      .setTable(table);
    const contextMenu: Window = createContextMenu({
      operationExecutor,
      getSelectedCells: (): CellRange[] => [
        createCellRange(createCellCoord(0, 0)),
      ],
    });
    const controlId: FitContextMenuControlId = 'row-insert-before';
    contextMenu.getControl(controlId).run();

    expect(table.getNumberOfRows() === 11).toBeTruthy();
    expect(table.getCellValue(1, 0) === 'bookmark').toBeTruthy();
  });

  it('insert rows below', (): void => {
    const table: FitTable = createTable<FitTable>()
      .setNumberOfRows(10)
      .setNumberOfCols(10)
      .setCellValue(0, 0, 'bookmark');
    const operationExecutor: OperationExecutor = createOperationExecutor()
      .setTable(table);
    const contextMenu: Window = createContextMenu({
      operationExecutor,
      getSelectedCells: (): CellRange[] => [
        createCellRange(createCellCoord(0, 0)),
      ],
    });
    const controlId: FitContextMenuControlId = 'row-insert-after';
    contextMenu.getControl(controlId).run();

    expect(table.getNumberOfRows() === 11).toBeTruthy();
    expect(table.getCellValue(0, 0) === 'bookmark').toBeTruthy();
  });

  it('remove rows', (): void => {
    const table: FitTable = createTable<FitTable>()
      .setNumberOfRows(10)
      .setNumberOfCols(10)
      .setCellValue(2, 0, 'bookmark');
    const operationExecutor: OperationExecutor = createOperationExecutor()
      .setTable(table);
    const contextMenu: Window = createContextMenu({
      operationExecutor,
      getSelectedCells: (): CellRange[] => [
        createCellRange(createCellCoord(0, 0), createCellCoord(1, 0)),
      ],
    });
    const controlId: FitContextMenuControlId = 'row-remove';
    contextMenu.getControl(controlId).run();

    expect(table.getNumberOfRows() === 8).toBeTruthy();
    expect(table.getCellValue(0, 0) === 'bookmark').toBeTruthy();
  });

  it('resize columns', (): void => {
    const table: FitTable = createTable<FitTable>();
    const operationExecutor: OperationExecutor = createOperationExecutor()
      .setTable(table);
    const contextMenu: Window = createContextMenu({
      operationExecutor,
      getSelectedCells: (): CellRange[] => [
        createCellRange(createCellCoord(0, 1), createCellCoord(0, 2)),
      ],
    });
    const controlId: FitContextMenuControlId = 'column-width';
    const control: Control = contextMenu.getControl(controlId);
    asValueControl(control)?.setValue(50).run();

    expect(table.getColWidth(1) === 50).toBeTruthy();
    expect(table.getColWidth(2) === 50).toBeTruthy();
  });

  it('insert columns left', (): void => {
    const table: FitTable = createTable<FitTable>()
      .setNumberOfRows(10)
      .setNumberOfCols(10)
      .setCellValue(0, 0, 'bookmark');
    const operationExecutor: OperationExecutor = createOperationExecutor()
      .setTable(table);
    const contextMenu: Window = createContextMenu({
      operationExecutor,
      getSelectedCells: (): CellRange[] => [
        createCellRange(createCellCoord(0, 0)),
      ],
    });
    const controlId: FitContextMenuControlId = 'column-insert-before';
    contextMenu.getControl(controlId).run();

    expect(table.getNumberOfCols() === 11).toBeTruthy();
    expect(table.getCellValue(0, 1) === 'bookmark').toBeTruthy();
  });

  it('insert columns right', (): void => {
    const table: FitTable = createTable<FitTable>()
      .setNumberOfRows(10)
      .setNumberOfCols(10)
      .setCellValue(0, 0, 'bookmark');
    const operationExecutor: OperationExecutor = createOperationExecutor()
      .setTable(table);
    const contextMenu: Window = createContextMenu({
      operationExecutor,
      getSelectedCells: (): CellRange[] => [
        createCellRange(createCellCoord(0, 0)),
      ],
    });
    const controlId: FitContextMenuControlId = 'column-insert-after';
    contextMenu.getControl(controlId).run();

    expect(table.getNumberOfCols() === 11).toBeTruthy();
    expect(table.getCellValue(0, 0) === 'bookmark').toBeTruthy();
  });

  it('remove columns', (): void => {
    const table: FitTable = createTable<FitTable>()
      .setNumberOfRows(10)
      .setNumberOfCols(10)
      .setCellValue(0, 2, 'bookmark');
    const operationExecutor: OperationExecutor = createOperationExecutor()
      .setTable(table);
    const contextMenu: Window = createContextMenu({
      operationExecutor,
      getSelectedCells: (): CellRange[] => [
        createCellRange(createCellCoord(0, 0), createCellCoord(0, 1)),
      ],
    });
    const controlId: FitContextMenuControlId = 'column-remove';
    contextMenu.getControl(controlId).run();

    expect(table.getNumberOfCols() === 8).toBeTruthy();
    expect(table.getCellValue(0, 0) === 'bookmark').toBeTruthy();
  });

  it('clear cells', (): void => {
    const table: FitTable = createTable<FitTable>()
      .setStyle('s0', createStyle<FitStyle>().set('color', 'red'))
      .setCellStyleName(0, 0, 's0')
      .setCellValue(0, 0, 'text');
    const operationExecutor: OperationExecutor = createOperationExecutor()
      .setTable(table);
    const contextMenu: Window = createContextMenu({
      operationExecutor,
      getSelectedCells: (): CellRange[] => [
        createCellRange(createCellCoord(0, 0)),
      ],
    });
    const controlId: FitContextMenuControlId = 'clear';
    contextMenu.getControl(controlId).run();

    expect(table.getCellValue(0, 0)).toBeUndefined();
    expect(table.getCellStyleName(0, 0) === 's0').toBeTruthy();
    expect(table.getStyle('s0')).toBeDefined();
  });

  it('remove cells', (): void => {
    const table: FitTable = createTable<FitTable>()
      .setStyle('s0', createStyle<FitStyle>().set('color', 'red'))
      .setCellStyleName(0, 0, 's0')
      .setCellValue(0, 0, 'text');
    const operationExecutor: OperationExecutor = createOperationExecutor()
      .setTable(table);
    const contextMenu: Window = createContextMenu({
      operationExecutor,
      getSelectedCells: (): CellRange[] => [
        createCellRange(createCellCoord(0, 0)),
      ],
    });
    const controlId: FitContextMenuControlId = 'remove';
    contextMenu.getControl(controlId).run();

    expect(table.hasCell(0, 0)).toBeFalse();
    expect(table.getStyle('s0')).toBeUndefined();
  });

  it('merge cells', (): void => {
    const table: FitTable = createTable<FitTable>();
    const operationExecutor: OperationExecutor = createOperationExecutor()
      .setTable(table);
    const contextMenu: Window = createContextMenu({
      operationExecutor,
      getSelectedCells: (): CellRange[] => [
        createCellRange(createCellCoord(0, 0), createCellCoord(1, 2)),
      ],
    });
    const controlId: FitContextMenuControlId = 'merge';
    contextMenu.getControl(controlId).run();

    expect(table.getRowSpan(0, 0) === 2).toBeTruthy();
    expect(table.getColSpan(0, 0) === 3).toBeTruthy();
  });

  it('unmerge cells', (): void => {
    const table: FitTable = createTable<FitTable>()
      .setRowSpan(0, 0, 2)
      .setColSpan(0, 0, 3);
    const operationExecutor: OperationExecutor = createOperationExecutor()
      .setTable(table);
    const contextMenu: Window = createContextMenu({
      operationExecutor,
      getSelectedCells: (): CellRange[] => [
        createCellRange(createCellCoord(0, 0), createCellCoord(1, 2)),
      ],
    });
    const controlId: FitContextMenuControlId = 'unmerge';
    contextMenu.getControl(controlId).run();
    expect(table.getRowSpan(0, 0)).toBeUndefined();
    expect(table.getColSpan(0, 0)).toBeUndefined();
  });
});

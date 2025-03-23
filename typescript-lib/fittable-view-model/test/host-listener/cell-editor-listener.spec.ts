import { } from 'jasmine';
import { Subscription } from 'rxjs';

import {
  CellRange,
  createCellCoord,
  createCellRange,
  createTable,
  registerModelConfig,
  Table,
  unregisterModelConfig,
} from 'fittable-core/model';
import {
  createOperationExecutor,
  OperationExecutor,
  registerOperationConfig,
  unregisterOperationConfig,
} from 'fittable-core/operations';
import {
  CellEditor,
  CellEditorListener,
  createCellEditor,
  createCellEditorListener,
  createTableViewer,
  registerViewModelConfig,
  TableViewer,
  unregisterViewModelConfig,
} from 'fittable-core/view-model';
import { FIT_MODEL_CONFIG } from 'fittable-model';
import { FIT_OPERATION_CONFIG } from 'fittable-model-operations';

import { FIT_VIEW_MODEL_CONFIG } from '../../dist/index.js';

import {
  TstHtmlElement,
  TstHtmlInputElement,
  TstKeyboardEvent,
  TstMouseEvent,
} from './tst-html-mockups.js';

describe('fit-cell-editor-listener.ts', (): void => {
  const subscriptions: Set<Subscription> = new Set();

  beforeAll((): void => {
    registerModelConfig(FIT_MODEL_CONFIG);
    registerOperationConfig(FIT_OPERATION_CONFIG);
    registerViewModelConfig(FIT_VIEW_MODEL_CONFIG);
  });
  afterAll(() => {
    unregisterModelConfig();
    unregisterOperationConfig();
    unregisterViewModelConfig();
    subscriptions.forEach((s: Subscription): void => s.unsubscribe());
  });

  it('show cell editor', (): void => {
    const table: Table = createTable()
      .setCellValue(1, 1, 1000);
    const operationExecutor: OperationExecutor = createOperationExecutor()
      .setTable(table);
    const tableViewer: TableViewer = createTableViewer(table);
    const cellEditor: CellEditor =
      createCellEditor(operationExecutor, tableViewer);
    const cellEditorListener: CellEditorListener = createCellEditorListener(
      cellEditor,
      (): CellRange[] => [createCellRange(createCellCoord(1, 1))]
    );
    const mouseEvent: TstMouseEvent = new TstMouseEvent();
    mouseEvent.target = new TstHtmlElement()
      .setAttribute('rowId', '1')
      .setAttribute('colId', '1');
    cellEditorListener.onShow(mouseEvent);

    expect(cellEditor.isVisible()).toBeTrue();
    expect(cellEditor.getCell().equals(createCellCoord(1, 1))).toBeTrue();
    expect(cellEditor.getCellControl().getValue()).toBe(1000);
    setTimeout((): void => {
      expect(cellEditor.getCellControl().hasFocus()).toBeTrue();
    });
  });

  it('define cell value', (): void => {
    const table: Table = createTable()
      .setCellValue(1, 1, 1000);
    const operationExecutor: OperationExecutor = createOperationExecutor()
      .setTable(table);
    const tableViewer: TableViewer = createTableViewer(table);
    const cellEditor: CellEditor =
      createCellEditor(operationExecutor, tableViewer);
    const cellEditorListener: CellEditorListener = createCellEditorListener(
      cellEditor,
      (): CellRange[] => [createCellRange(createCellCoord(1, 1))]
    );
    const mouseEvent: TstMouseEvent = new TstMouseEvent();
    mouseEvent.target = new TstHtmlElement()
      .setAttribute('rowId', '1')
      .setAttribute('colId', '1');
    cellEditorListener.onShow(mouseEvent);
    const keyEvent: TstKeyboardEvent = new TstKeyboardEvent();
    keyEvent.key = 'x';
    cellEditorListener.onKeyDown(keyEvent);
    const inputEvent: TstKeyboardEvent = new TstKeyboardEvent();
    const input: TstHtmlInputElement = new TstHtmlInputElement();
    input.value = 'x';
    inputEvent.target = input;
    cellEditorListener.onInput(inputEvent);
    const keyEnterEvent: TstKeyboardEvent = new TstKeyboardEvent();
    keyEnterEvent.key = 'Enter';
    cellEditorListener.onKeyDown(keyEnterEvent);

    expect(table.getCellValue(1, 1) === 'x').toBeTruthy();
  });

  it('revert cell value', (): void => {
    const table: Table = createTable()
      .setCellValue(1, 1, 1000);
    const operationExecutor: OperationExecutor = createOperationExecutor()
      .setTable(table);
    const tableViewer: TableViewer = createTableViewer(table);
    const cellEditor: CellEditor =
      createCellEditor(operationExecutor, tableViewer);
    const cellEditorListener: CellEditorListener = createCellEditorListener(
      cellEditor,
      (): CellRange[] => [createCellRange(createCellCoord(1, 1))]
    );
    const mouseEvent: TstMouseEvent = new TstMouseEvent();
    mouseEvent.target = new TstHtmlElement()
      .setAttribute('rowId', '1')
      .setAttribute('colId', '1');
    cellEditorListener.onShow(mouseEvent);
    const keyEvent: TstKeyboardEvent = new TstKeyboardEvent();
    keyEvent.key = 'x';
    cellEditorListener.onKeyDown(keyEvent);
    const inputEvent: TstKeyboardEvent = new TstKeyboardEvent();
    const input: TstHtmlInputElement = new TstHtmlInputElement();
    input.value = 'x';
    inputEvent.target = input;
    cellEditorListener.onInput(inputEvent);
    const keyEnterEvent: TstKeyboardEvent = new TstKeyboardEvent();
    keyEnterEvent.key = 'Escape';
    cellEditorListener.onKeyDown(keyEnterEvent);

    expect(table.getCellValue(1, 1) === 1000).toBeTruthy();
  });

  it('key navigation', (): void => {
    const table: Table = createTable()
      .setCellValue(1, 1, 1000);
    const operationExecutor: OperationExecutor = createOperationExecutor()
      .setTable(table);
    const tableViewer: TableViewer = createTableViewer(table);
    const cellEditor: CellEditor =
      createCellEditor(operationExecutor, tableViewer);
    const cellEditorListener: CellEditorListener = createCellEditorListener(
      cellEditor,
      (): CellRange[] => [createCellRange(createCellCoord(1, 1))]
    );
    const mouseEvent: TstMouseEvent = new TstMouseEvent();
    mouseEvent.target = new TstHtmlElement()
      .setAttribute('rowId', '1')
      .setAttribute('colId', '1');
    cellEditorListener.onShow(mouseEvent);
    const keyEvent: TstKeyboardEvent = new TstKeyboardEvent();
    keyEvent.key = 'ArrowLeft';
    cellEditorListener.onKeyDown(keyEvent);
    keyEvent.key = 'ArrowUp';
    cellEditorListener.onKeyDown(keyEvent);
    keyEvent.key = 'ArrowRight';
    cellEditorListener.onKeyDown(keyEvent);
    keyEvent.key = 'ArrowDown';
    cellEditorListener.onKeyDown(keyEvent);
    keyEvent.key = 'Enter';
    cellEditorListener.onKeyDown(keyEvent);

    expect(cellEditor.getCell().equals(createCellCoord(2, 1)));
  });

  it('focus cell editor', (): void => {
    const table: Table = createTable()
      .setCellValue(1, 1, 1000);
    const operationExecutor: OperationExecutor = createOperationExecutor()
      .setTable(table);
    const tableViewer: TableViewer = createTableViewer(table);
    const cellEditor: CellEditor =
      createCellEditor(operationExecutor, tableViewer);
    const cellEditorListener: CellEditorListener = createCellEditorListener(
      cellEditor,
      (): CellRange[] => [createCellRange(createCellCoord(1, 1))]
    );
    const mouseEvent: TstMouseEvent = new TstMouseEvent();
    mouseEvent.target = new TstHtmlElement()
      .setAttribute('rowId', '1')
      .setAttribute('colId', '1');
    mouseEvent.button = 0;
    cellEditorListener.onShow(mouseEvent);
    cellEditorListener.onMouseDown(mouseEvent);
    cellEditorListener.onGlobalMouseDown();
    cellEditorListener.onGlobalMouseUp();

    expect(cellEditor.hasFocus()).toBeTrue();
  });

  it('context menu', (): void => {
    const table: Table = createTable()
      .setCellValue(1, 1, 1000);
    const operationExecutor: OperationExecutor = createOperationExecutor()
      .setTable(table);
    const tableViewer: TableViewer = createTableViewer(table);
    const cellEditor: CellEditor =
      createCellEditor(operationExecutor, tableViewer);
    const cellEditorListener: CellEditorListener = createCellEditorListener(
      cellEditor,
      (): CellRange[] => [createCellRange(createCellCoord(1, 1))]
    );
    cellEditorListener.onGlobalMouseDown();
    cellEditorListener.onGlobalMouseUp();
    const mouseEvent: TstMouseEvent = new TstMouseEvent();
    mouseEvent.button = 3;
    mouseEvent.target = new TstHtmlElement()
      .setAttribute('rowId', '1')
      .setAttribute('colId', '1');
    cellEditorListener.onShow(mouseEvent);
    let triggerContextMenu = false;
    subscriptions.add(
      cellEditorListener.onContextMenu$().subscribe((): void => {
        triggerContextMenu = true;
      })
    );
    cellEditorListener.onContextMenu();

    expect(triggerContextMenu).toBeTrue();
    expect(cellEditor.getCellControl().hasFocus()).toBeFalse();
  });
});

import {} from 'jasmine';
import { Subscription } from 'rxjs';

import {
  CellRange,
  createCellCoord,
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
  CellSelection,
  CellSelectionListener,
  createCellSelection,
  createCellSelectionListener,
  createTableViewer,
  registerViewModelConfig,
  TableViewer,
  unregisterViewModelConfig,
} from 'fittable-core/view-model/index.js';

import { FIT_MODEL_CONFIG } from '../../../fittable-model/dist/index.js';
import { FIT_OPERATION_CONFIG } from '../../../fittable-model-operations/dist/index.js';
import { FIT_VIEW_MODEL_CONFIG } from '../../dist/index.js';

import {
  TstHtmlElement,
  TstKeyboardEvent,
  TstMouseEvent,
} from './tst-html-mockups.js';

describe('fit-cell-selection-listener.ts', (): void => {
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

  it('mouse cell selection', (): void => {
    const table: Table = createTable();
    const tableViewer: TableViewer = createTableViewer(table);
    const cellSelection: CellSelection = createCellSelection(tableViewer);
    const cellSelectionListener: CellSelectionListener =
      createCellSelectionListener(cellSelection);
    let onEnd = 0;
    subscriptions.add(
      cellSelection.body.onEnd$().subscribe((): void => {
        onEnd++;
      })
    );
    cellSelectionListener.onMouseEnter();
    const mouseDownEvent: TstMouseEvent = new TstMouseEvent();
    mouseDownEvent.button = 0;
    mouseDownEvent.target = new TstHtmlElement()
      .setAttribute('rowId', '1')
      .setAttribute('colId', '1');
    cellSelectionListener.onMouseDown(mouseDownEvent);
    cellSelectionListener.onGlobalMouseDown();
    const mouseMoveEvent: TstMouseEvent = new TstMouseEvent();
    mouseMoveEvent.button = 0;
    mouseMoveEvent.target = new TstHtmlElement()
      .setAttribute('rowId', '1')
      .setAttribute('colId', '2');
    cellSelectionListener.onMouseMove(mouseMoveEvent);
    cellSelectionListener.onGlobalMouseUp();

    expect(cellSelection.body.hasFocus()).toBeTruthy();
    const cellRanges: CellRange[] = cellSelection.body.getRanges();
    expect(cellRanges.length === 1).toBeTruthy();
    expect(cellRanges[0].getFrom().equals(createCellCoord(1, 1))).toBeTruthy();
    expect(cellRanges[0].getTo().equals(createCellCoord(1, 2))).toBeTruthy();
    expect(onEnd === 1).toBeTruthy();
  });

  it('key navigation', (): void => {
    const table: Table = createTable();
    const tableViewer: TableViewer = createTableViewer(table);
    const cellSelection: CellSelection = createCellSelection(tableViewer);
    cellSelection.body.setFocus(true);
    cellSelection.body.createRange().addCell(createCellCoord(1, 1)).end();
    const cellSelectionListener: CellSelectionListener =
      createCellSelectionListener(cellSelection);
    const keyDownEvent: TstKeyboardEvent = new TstKeyboardEvent();
    keyDownEvent.key = 'ArrowLeft';
    cellSelectionListener.onGlobalKeyDown(keyDownEvent);
    keyDownEvent.key = 'ArrowUp';
    cellSelectionListener.onGlobalKeyDown(keyDownEvent);
    keyDownEvent.key = 'ArrowRight';
    cellSelectionListener.onGlobalKeyDown(keyDownEvent);
    keyDownEvent.key = 'ArrowDown';
    cellSelectionListener.onGlobalKeyDown(keyDownEvent);
    keyDownEvent.key = 'Enter';
    cellSelectionListener.onGlobalKeyDown(keyDownEvent);

    const cellRanges: CellRange[] = cellSelection.body.getRanges();
    expect(cellRanges.length === 1).toBeTruthy();
    expect(cellRanges[0].getFrom().equals(createCellCoord(2, 1))).toBeTruthy();
  });
});

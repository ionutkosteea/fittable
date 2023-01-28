import {} from 'jasmine';

import { Subject, Subscription } from 'rxjs';

import { Table } from 'fit-core/model/index.js';
import { Operation } from 'fit-core/operations/index.js';

import { TableOperationExecutor } from './model/table-operation-executor.js';

describe('Test Operation', () => {
  it('execute -> undo -> redo -> undo > redo : test operation steps', () => {
    const executor: TableOperationExecutor = new TableOperationExecutor() //
      .createTable(1, 1);

    const table: Table = executor.getTable().setCellValue(0, 0, 'text');

    expect(executor.canUndo()).toBeFalsy();
    expect(executor.canRedo()).toBeFalsy();

    executor.runCellValue(0, 0, 1000);
    expect(table.getCellValue(0, 0) === 1000).toBeTruthy();
    expect(executor.canUndo()).toBeTruthy();
    expect(executor.canRedo()).toBeFalsy();

    executor.runUndo();
    expect(table.getCellValue(0, 0) === 'text').toBeTruthy();
    expect(executor.canUndo()).toBeFalsy();
    expect(executor.canRedo()).toBeTruthy();

    executor.runRedo();
    expect(table.getCellValue(0, 0) === 1000).toBeTruthy();
    expect(executor.canUndo()).toBeTruthy();
    expect(executor.canRedo()).toBeFalsy();

    executor.runUndo();
    expect(table.getCellValue(0, 0) === 'text').toBeTruthy();
    expect(executor.canUndo()).toBeFalsy();
    expect(executor.canRedo()).toBeTruthy();

    executor.runCellValue(0, 0, 1000);
    expect(table.getCellValue(0, 0) === 1000).toBeTruthy();
    expect(executor.canUndo()).toBeTruthy();
    expect(executor.canRedo()).toBeFalsy();
  });

  it('operation listeners', () => {
    const executor: TableOperationExecutor = new TableOperationExecutor() //
      .createTable(1, 1);

    let isAfterRun = false;
    let isAfterUndo = false;
    let isAfterRedo = false;
    const afterRun$: Subject<Operation> = new Subject();
    const afterUndo$: Subject<Operation> = new Subject();
    const afterRedo$: Subject<Operation> = new Subject();
    const subscriptions: Subscription[] = [];
    subscriptions.push(afterRun$.subscribe(() => (isAfterRun = true)));
    subscriptions.push(afterUndo$.subscribe(() => (isAfterUndo = true)));
    subscriptions.push(afterRedo$.subscribe(() => (isAfterRedo = true)));

    executor.addOperationListener({
      onAfterRun$: () => afterRun$,
      onAfterUndo$: () => afterUndo$,
      onAfterRedo$: () => afterRedo$,
    });
    executor.runCellValue(0, 0, 1000);
    expect(isAfterRun).toBeTrue();
    executor.runUndo();
    expect(isAfterUndo).toBeTrue();
    executor.runRedo();
    expect(isAfterRedo).toBeTrue();

    isAfterRun = false;
    executor.clearOperationListeners();
    executor.runCellValue(0, 0, 2000);
    expect(isAfterRun).toBeFalse();

    subscriptions.forEach((s: Subscription) => s.unsubscribe());
  });
});

import {} from 'jasmine';

import { Subscription } from 'rxjs';

import { Table } from 'fit-core/model/index.js';

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

    const subscriptions: Subscription[] = [];
    subscriptions.push(
      executor.onAfterRun$().subscribe((): void => {
        isAfterRun = true;
      })
    );
    subscriptions.push(
      executor.onAfterUndo$().subscribe((): void => {
        isAfterUndo = true;
      })
    );
    subscriptions.push(
      executor.onAfterRedo$().subscribe((): void => {
        isAfterRedo = true;
      })
    );

    executor.runCellValue(0, 0, 1000);
    expect(isAfterRun).toBeTrue();
    executor.runUndo();
    expect(isAfterUndo).toBeTrue();
    executor.runRedo();
    expect(isAfterRedo).toBeTrue();

    subscriptions.forEach((s: Subscription) => s.unsubscribe());
  });
});

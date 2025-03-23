import { Observable } from 'rxjs';

import { Table } from '../model/table/table.js';
import { getOperationConfig } from './operation-config.js';

/**
 * Key components for managing table operations:
 * Operation Executor: The operation executor manages the execution, undoing, and redoing of operations.
 * Operation: Each operation is responsible for executing or undoing specific table changes.
 * Table Changes: Operations modify the table's state through changes, each identified by a unique ID.
 * Table Change Writer: Table changes are associated with specific writers by their IDs.
 */
export interface OperationExecutor {
  bindTableChangesFactory(operationId: string, clazz: TableChangesFactoryClass): this;
  unbindTableChangesFactory(operationId: string): this;
  bindTableChangeWritterFactory(changeId: string, clazz: TableChangeWritterFactoryClass): this;
  unbindTableChangeWritterFactory(changeId: string): this;
  unbindFactories(): this;
  setTable(table: Table): this;
  getTable(): Table | undefined;
  calculateTableChanges(args: Args<string>): TableChanges | Promise<TableChanges>;
  writeTableChanges(changes: TableChanges | Promise<TableChanges>): this;
  run(args: Args<string>): this;
  onBeforeRun$(): Observable<TableChanges>;
  onAfterRun$(): Observable<TableChanges>;
  canUndo(): boolean;
  undo(): this;
  onBeforeUndo$(): Observable<TableChanges>;
  onAfterUndo$(): Observable<TableChanges>;
  canRedo(): boolean;
  redo(): this;
  onBeforeRedo$(): Observable<TableChanges>;
  onAfterRedo$(): Observable<TableChanges>;
  clearOperations(): this;
}

export type Args<Id extends string> = { id: Id };

export type BaseTableChanges = {
  changes: Args<string>[];
  undoChanges?: BaseTableChanges;
};

export type TableChanges = Args<string> &
  BaseTableChanges & { properties?: { [id: string]: unknown } };

export interface TableChangesFactory {
  createTableChanges(
    table: Table,
    args: Args<string>
  ): TableChanges | Promise<TableChanges>;
}

export type TableChangesFactoryClass = { new(): TableChangesFactory };

export interface TableChangeWritter {
  run(): void;
}

export interface TableChangeWritterFactory {
  createTableChangeWritter(
    table: Table,
    change: Args<string>
  ): TableChangeWritter;
}

export type TableChangeWritterFactoryClass = {
  new(): TableChangeWritterFactory;
};

export interface Operation {
  run(): void;
  canUndo(): boolean;
  undo(): void;
}

export interface OperationFactory {
  createOperation(changes: TableChanges): Operation;
}

export interface OperationExecutorFactory {
  createOperationExecutor(): OperationExecutor;
}

export function createOperationExecutor(): OperationExecutor {
  return getOperationConfig().operationExecutorFactory.createOperationExecutor();
}

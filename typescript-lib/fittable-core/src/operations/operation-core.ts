import { Observable } from 'rxjs';

import { Table } from '../model/table/table.js';
import { getOperationConfig } from './operation-config.js';

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

export type TableChangesFactoryClass = { new (): TableChangesFactory };

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
  new (): TableChangeWritterFactory;
};

export interface Operation {
  run(): void;
  canUndo(): boolean;
  undo(): void;
}

export interface OperationFactory {
  createOperation(changes: TableChanges): Operation;
}

export interface OperationExecutor {
  bindTableChangesFactory(
    operationId: string,
    clazz: TableChangesFactoryClass
  ): this;
  unbindTableChangesFactory(operationId: string): this;
  bindTableChangeWritterFactory(
    changeId: string,
    clazz: TableChangeWritterFactoryClass
  ): this;
  unbindTableChangeWritterFactory(changeId: string): this;
  unbindFactories(): this;
  setTable(table: Table): this;
  getTable(): Table | undefined;
  calculateTableChanges(
    args: Args<string>
  ): TableChanges | Promise<TableChanges>;
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

export interface OperationExecutorFactory {
  createOperationExecutor(): OperationExecutor;
}

export function createOperationExecutor(): OperationExecutor {
  return getOperationConfig().operationExecutorFactory.createOperationExecutor();
}

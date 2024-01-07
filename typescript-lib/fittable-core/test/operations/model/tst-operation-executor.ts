import { Observable } from 'rxjs';

import { Table } from '../../../dist/model/index.js';
import {
  Args,
  OperationExecutor,
  TableChangeWritterFactoryClass,
  TableChanges,
  TableChangesFactoryClass,
} from '../../../dist/operations/index.js';

export class TstOperationExecutor implements OperationExecutor {
  bindTableChangesFactory(
    operationId: string,
    clazz: TableChangesFactoryClass
  ): this {
    throw new Error('Method not implemented.');
  }
  unbindTableChangesFactory(operationId: string): this {
    throw new Error('Method not implemented.');
  }
  bindTableChangeWritterFactory(
    changeId: string,
    clazz: TableChangeWritterFactoryClass
  ): this {
    throw new Error('Method not implemented.');
  }
  unbindTableChangeWritterFactory(changeId: string): this {
    throw new Error('Method not implemented.');
  }
  unbindFactories(): this {
    throw new Error('Method not implemented.');
  }
  setTable(table: Table): this {
    throw new Error('Method not implemented.');
  }
  getTable(): Table | undefined {
    throw new Error('Method not implemented.');
  }
  calculateTableChanges(
    args: Args<string>
  ): TableChanges | Promise<TableChanges> {
    throw new Error('Method not implemented.');
  }
  writeTableChanges(changes: TableChanges | Promise<TableChanges>): this {
    throw new Error('Method not implemented.');
  }
  run(args: Args<string>): this {
    throw new Error('Method not implemented.');
  }
  onBeforeRun$(): Observable<TableChanges> {
    throw new Error('Method not implemented.');
  }
  onAfterRun$(): Observable<TableChanges> {
    throw new Error('Method not implemented.');
  }
  canUndo(): boolean {
    throw new Error('Method not implemented.');
  }
  undo(): this {
    throw new Error('Method not implemented.');
  }
  onBeforeUndo$(): Observable<TableChanges> {
    throw new Error('Method not implemented.');
  }
  onAfterUndo$(): Observable<TableChanges> {
    throw new Error('Method not implemented.');
  }
  canRedo(): boolean {
    throw new Error('Method not implemented.');
  }
  redo(): this {
    throw new Error('Method not implemented.');
  }
  onBeforeRedo$(): Observable<TableChanges> {
    throw new Error('Method not implemented.');
  }
  onAfterRedo$(): Observable<TableChanges> {
    throw new Error('Method not implemented.');
  }
  clearOperations(): this {
    throw new Error('Method not implemented.');
  }
}

import { Observable } from 'rxjs';

import { Table } from 'fittable-core/model';
import {
  OperationExecutor,
  TableChangesFactoryClass,
  TableChangeWritterFactoryClass,
  TableChanges,
  TableChangeWritter,
  Args,
} from 'fittable-core/operations';

import { OperationStackExecutor } from './operation-stack-executor.js';
import {
  FitOperationId,
  FitTableChangeId,
  FitOperationArgs,
} from './fit-operation-executor-args.js';

export class FitOperationExecutor implements OperationExecutor {
  private readonly executor: OperationStackExecutor;
  private tableChangesFactories: {
    [operationId in FitOperationId]?: TableChangesFactoryClass;
  } = {};
  private tableChangeWritterFactories: {
    [changeId in FitTableChangeId]?: TableChangeWritterFactoryClass;
  } = {};
  private table?: Table;

  constructor() {
    this.executor = new OperationStackExecutor(this.createChangeWritter);
  }

  private readonly createChangeWritter = (
    change: Args<string>
  ): TableChangeWritter => {
    const Factory: TableChangeWritterFactoryClass | undefined =
      this.tableChangeWritterFactories[change.id as FitTableChangeId];
    if (Factory) {
      if (!this.table) throw new Error('Table property hast to be set!');
      return new Factory().createTableChangeWritter(this.table, change);
    } else {
      throw new Error(`Invalid table change id: ${change}`);
    }
  };

  public bindTableChangesFactory(
    operationId: FitOperationId,
    clazz: TableChangesFactoryClass
  ): this {
    this.tableChangesFactories[operationId] = clazz;
    return this;
  }

  public unbindTableChangesFactory(operationId: FitOperationId): this {
    Reflect.getOwnPropertyDescriptor(this.tableChangesFactories, operationId);
    return this;
  }

  public bindTableChangeWritterFactory(
    changeId: FitTableChangeId,
    clazz: TableChangeWritterFactoryClass
  ): this {
    this.tableChangeWritterFactories[changeId] = clazz;
    return this;
  }

  public unbindTableChangeWritterFactory(changeId: FitTableChangeId): this {
    Reflect.getOwnPropertyDescriptor(
      this.tableChangeWritterFactories,
      changeId
    );
    return this;
  }

  public unbindFactories(): this {
    this.tableChangesFactories = {};
    this.tableChangeWritterFactories = {};
    return this;
  }

  public setTable(table: Table): this {
    this.table = table;
    return this;
  }

  public getTable(): Table | undefined {
    return this.table;
  }

  public run(args: FitOperationArgs): this {
    const changes: TableChanges | Promise<TableChanges> =
      this.calculateTableChanges(args);
    this.writeTableChanges(changes);
    return this;
  }

  public calculateTableChanges(
    args: FitOperationArgs
  ): TableChanges | Promise<TableChanges> {
    const Factory: TableChangesFactoryClass | undefined =
      this.tableChangesFactories[args.id as FitOperationId];
    if (Factory) {
      if (!this.table) throw new Error('Table property hast to be set!');
      return new Factory().createTableChanges(this.table, args);
    } else {
      throw new Error(`Invalid operation id: ${args.id}`);
    }
  }

  public writeTableChanges(
    changes: TableChanges | Promise<TableChanges>
  ): this {
    if (changes instanceof Promise) {
      changes
        .then((c: TableChanges): void => {
          this.executor.run(c);
        })
        .catch((error: Error): void => console.error(error.message));
    } else {
      this.executor.run(changes);
    }
    return this;
  }

  public onBeforeRun$(): Observable<TableChanges> {
    return this.executor.beforeRun$.asObservable();
  }

  public onAfterRun$(): Observable<TableChanges> {
    return this.executor.afterRun$.asObservable();
  }

  public canUndo(): boolean {
    return this.executor.canUndo();
  }

  public undo(): this {
    this.executor.undo();
    return this;
  }

  public onBeforeUndo$(): Observable<TableChanges> {
    return this.executor.beforeUndo$.asObservable();
  }

  public onAfterUndo$(): Observable<TableChanges> {
    return this.executor.afterUndo$.asObservable();
  }

  public canRedo(): boolean {
    return this.executor.canRedo();
  }

  public redo(): this {
    this.executor.redo();
    return this;
  }

  public onBeforeRedo$(): Observable<TableChanges> {
    return this.executor.beforeRedo$.asObservable();
  }

  public onAfterRedo$(): Observable<TableChanges> {
    return this.executor.afterRedo$.asObservable();
  }

  public clearOperations(): this {
    this.executor.clearOperations();
    return this;
  }
}

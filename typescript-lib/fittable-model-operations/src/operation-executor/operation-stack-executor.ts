import { Subject } from 'rxjs';

import {
  TableChanges,
  Args,
  TableChangeWritter,
} from 'fittable-core/operations';

import { FitOperation, FitOperationFactory } from './fit-operation.js';

export class OperationStackExecutor {
  public readonly beforeRun$: Subject<TableChanges> = new Subject();
  public readonly afterRun$: Subject<TableChanges> = new Subject();
  public readonly beforeUndo$: Subject<TableChanges> = new Subject();
  public readonly afterUndo$: Subject<TableChanges> = new Subject();
  public readonly beforeRedo$: Subject<TableChanges> = new Subject();
  public readonly afterRedo$: Subject<TableChanges> = new Subject();

  private readonly operationStack: TableChanges[] = [];
  private activeOperationIndex = -1;

  constructor(
    private readonly createchangeWritter: (
      change: Args<string>
    ) => TableChangeWritter
  ) {}

  public run(changes: TableChanges): this {
    this.beforeRun$.next(changes);
    this.createOperation(changes).run();
    this.afterRun$.next(changes);
    if (changes.undoChanges) {
      if (this.activeOperationIndex === this.operationStack.length - 1) {
        this.operationStack.push(changes);
      } else {
        this.operationStack.splice(
          this.activeOperationIndex + 1,
          this.operationStack.length - this.activeOperationIndex,
          changes
        );
      }
      this.activeOperationIndex++;
    }
    return this;
  }

  public canUndo(): boolean {
    return this.activeOperationIndex > -1;
  }

  public undo(): this {
    if (this.canUndo()) {
      const changes: TableChanges = this.getActiveTableChanges();
      this.beforeUndo$.next(changes);
      this.createOperation(changes).undo();
      this.afterUndo$.next(changes);
      this.activeOperationIndex--;
    }
    return this;
  }

  public canRedo(): boolean {
    return this.activeOperationIndex < this.operationStack.length - 1;
  }

  public redo(): this {
    if (this.canRedo()) {
      this.activeOperationIndex++;
      const changes: TableChanges = this.getActiveTableChanges();
      this.beforeRedo$.next(changes);
      this.createOperation(changes).run();
      this.afterRedo$.next(changes);
    }
    return this;
  }

  private createOperation(changes: TableChanges): FitOperation {
    const factory: FitOperationFactory = //
      new FitOperationFactory(this.createchangeWritter);
    return factory.createOperation(changes);
  }

  private getActiveTableChanges(): TableChanges {
    const changes: TableChanges | undefined =
      this.operationStack[this.activeOperationIndex];
    if (changes) return changes;
    else throw new Error('No active operation is defined!');
  }

  public clearOperations(): this {
    while (this.operationStack.length > 0) this.operationStack.pop();
    this.activeOperationIndex = -1;
    return this;
  }
}

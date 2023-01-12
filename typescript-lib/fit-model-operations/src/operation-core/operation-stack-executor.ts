import { OperationExecutorListener } from 'fit-core/operations/index.js';

import { FitOperation } from './fit-operation.js';

export class OperationStackExecutor {
  private readonly operationStack: FitOperation[] = [];
  private activeOperationIndex = -1;
  private listeners: OperationExecutorListener[] = [];

  public addListener(listener: OperationExecutorListener): this {
    this.listeners.push(listener);
    return this;
  }

  public clearListeners(): this {
    this.listeners = [];
    return this;
  }

  public run(operation: FitOperation): this {
    for (const listener of this.listeners) {
      listener.onBeforeRun$ && listener.onBeforeRun$().next(operation);
    }
    operation.run();
    for (const listener of this.listeners) {
      listener.onAfterRun$ && listener.onAfterRun$().next(operation);
    }
    if (operation.canUndo()) {
      if (this.activeOperationIndex === this.operationStack.length - 1) {
        this.operationStack.push(operation);
      } else {
        this.operationStack.splice(
          this.activeOperationIndex + 1,
          this.operationStack.length - this.activeOperationIndex,
          operation
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
      const operation: FitOperation = this.getActiveOperation();
      for (const listener of this.listeners) {
        listener?.onBeforeUndo$ && listener.onBeforeUndo$().next(operation);
      }
      operation.undo();
      for (const listener of this.listeners) {
        listener?.onAfterUndo$ && listener.onAfterUndo$().next(operation);
      }
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
      const operation: FitOperation = this.getActiveOperation();
      for (const listener of this.listeners) {
        listener?.onBeforeRedo$ && listener.onBeforeRedo$().next(operation);
      }
      operation.run();
      for (const listener of this.listeners) {
        listener?.onAfterRedo$ && listener.onAfterRedo$().next(operation);
      }
    }
    return this;
  }

  private getActiveOperation(): FitOperation {
    const operation: FitOperation | undefined =
      this.operationStack[this.activeOperationIndex];
    if (operation) return operation;
    else throw new Error('No active operation is defined!');
  }

  public reset(): this {
    while (this.operationStack.length > 0) this.operationStack.pop();
    this.activeOperationIndex = -1;
    return this;
  }
}

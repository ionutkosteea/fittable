import { Subject } from 'rxjs';

import { Table } from '../model/table.js';
import { getOperationConfig } from './operation-config.js';

export type Id<T extends string> = { id: T };

export type BaseOperationDto = {
  steps: Id<string>[];
  undoOperation?: BaseOperationDto;
};

export type OperationDto = Id<string> & BaseOperationDto;

export interface OperationDtoFactory {
  createOperationDto(
    table: Table,
    args: Id<string>
  ): OperationDto | Promise<OperationDto>;
}

export type OperationDtoFactoryClass = { new (): OperationDtoFactory };

export interface OperationStep {
  run(): void;
}

export interface OperationStepFactory {
  createStep(table: Table, stepDto: Id<string>): OperationStep;
}

export type OperationStepFactoryClass = { new (): OperationStepFactory };

export interface Operation {
  id: string;
  properties: { [id in string]?: unknown };
  run(): void;
  canUndo(): boolean;
  undo(): void;
}

export interface OperationFactory {
  createOperation(operationDto: OperationDto): Operation;
}

export interface OperationExecutorListener {
  onBeforeRun$?(): Subject<Operation>;
  onAfterRun$?(): Subject<Operation>;
  onBeforeUndo$?(): Subject<Operation>;
  onAfterUndo$?(): Subject<Operation>;
  onBeforeRedo$?(): Subject<Operation>;
  onAfterRedo$?(): Subject<Operation>;
}

export interface OperationExecutor {
  bindOperationDtoFactory(
    operationId: string,
    clazz: OperationDtoFactoryClass
  ): this;
  unbindOperationDtoFactory(operationId: string): this;
  bindOperationStepFactory(
    stepId: string,
    clazz: OperationStepFactoryClass
  ): this;
  unbindOperationStepFactory(stepId: string): this;
  unbindFactories(): this;
  addListener(listener: OperationExecutorListener): this;
  clearListeners(): this;
  setTable(table: Table): this;
  getTable(): Table | undefined;
  createOperationDto(args: Id<string>): OperationDto | Promise<OperationDto>;
  runOperationDto(operationDto: OperationDto | Promise<OperationDto>): this;
  createOperation(operationDto: OperationDto): Operation;
  runOperation(operation: Operation): this;
  run(args: Id<string>): this;
  canUndo(): boolean;
  undo(): this;
  canRedo(): boolean;
  redo(): this;
  reset(): this;
}

export interface OperationExecutorFactory {
  createOperationExecutor(): OperationExecutor;
}

export function createOperationExecutor(): OperationExecutor {
  const factory: OperationExecutorFactory | undefined =
    getOperationConfig().operationExecutorFactory;
  if (factory) return factory.createOperationExecutor();
  else throw new Error('OperationExecutorFactory is not defined!');
}

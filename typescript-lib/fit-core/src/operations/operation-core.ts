import { Observable } from 'rxjs';

import { MissingFactoryError } from '../common/factory-error.js';
import { Table } from '../model/table.js';
import { getOperationConfig } from './operation-config.js';

export type OperationId<T extends string> = { id: T };

export type BaseOperationDto = {
  steps: OperationId<string>[];
  undoOperation?: BaseOperationDto;
  preventFocus?: boolean;
};

export type OperationDto = OperationId<string> &
  BaseOperationDto & { properties?: { [id: string]: unknown } };

export interface OperationDtoFactory {
  createOperationDto(
    table: Table,
    args: OperationId<string>
  ): OperationDto | Promise<OperationDto>;
}

export type OperationDtoFactoryClass = { new (): OperationDtoFactory };

export interface OperationStep {
  run(): void;
}

export interface OperationStepFactory {
  createStep(table: Table, stepDto: OperationId<string>): OperationStep;
}

export type OperationStepFactoryClass = { new (): OperationStepFactory };

export interface Operation {
  run(): void;
  canUndo(): boolean;
  undo(): void;
}

export interface OperationFactory {
  createOperation(operationDto: OperationDto): Operation;
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
  setTable(table: Table): this;
  getTable(): Table | undefined;
  createOperationDto(
    args: OperationId<string>
  ): OperationDto | Promise<OperationDto>;
  runOperationDto(operationDto: OperationDto | Promise<OperationDto>): this;
  run(args: OperationId<string>): this;
  onBeforeRun$(): Observable<OperationDto>;
  onAfterRun$(): Observable<OperationDto>;
  canUndo(): boolean;
  undo(): this;
  onBeforeUndo$(): Observable<OperationDto>;
  onAfterUndo$(): Observable<OperationDto>;
  canRedo(): boolean;
  redo(): this;
  onBeforeRedo$(): Observable<OperationDto>;
  onAfterRedo$(): Observable<OperationDto>;
  clearOperations(): this;
}

export interface OperationExecutorFactory {
  createOperationExecutor(): OperationExecutor;
}

export function createOperationExecutor(): OperationExecutor {
  const factory: OperationExecutorFactory | undefined =
    getOperationConfig().operationExecutorFactory;
  if (factory) return factory.createOperationExecutor();
  else throw new MissingFactoryError();
}

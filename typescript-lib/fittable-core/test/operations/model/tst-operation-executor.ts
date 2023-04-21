import { Observable } from 'rxjs';

import { Table } from '../../../dist/model/table.js';
import {
  OperationDto,
  OperationDtoFactoryClass,
  OperationExecutor,
  OperationId,
  OperationStepFactoryClass,
} from '../../../dist/operations/index.js';

export class TstOperationExecutor implements OperationExecutor {
  bindOperationDtoFactory(
    operationId: string,
    clazz: OperationDtoFactoryClass
  ): this {
    throw new Error('Method not implemented.');
  }
  unbindOperationDtoFactory(operationId: string): this {
    throw new Error('Method not implemented.');
  }
  bindOperationStepFactory(
    stepId: string,
    clazz: OperationStepFactoryClass
  ): this {
    throw new Error('Method not implemented.');
  }
  unbindOperationStepFactory(stepId: string): this {
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
  createOperationDto(
    args: OperationId<string>
  ): OperationDto | Promise<OperationDto> {
    throw new Error('Method not implemented.');
  }
  runOperationDto(operationDto: OperationDto | Promise<OperationDto>): this {
    throw new Error('Method not implemented.');
  }
  run(args: OperationId<string>): this {
    throw new Error('Method not implemented.');
  }
  onBeforeRun$(): Observable<OperationDto> {
    throw new Error('Method not implemented.');
  }
  onAfterRun$(): Observable<OperationDto> {
    throw new Error('Method not implemented.');
  }
  canUndo(): boolean {
    throw new Error('Method not implemented.');
  }
  undo(): this {
    throw new Error('Method not implemented.');
  }
  onBeforeUndo$(): Observable<OperationDto> {
    throw new Error('Method not implemented.');
  }
  onAfterUndo$(): Observable<OperationDto> {
    throw new Error('Method not implemented.');
  }
  canRedo(): boolean {
    throw new Error('Method not implemented.');
  }
  redo(): this {
    throw new Error('Method not implemented.');
  }
  onBeforeRedo$(): Observable<OperationDto> {
    throw new Error('Method not implemented.');
  }
  onAfterRedo$(): Observable<OperationDto> {
    throw new Error('Method not implemented.');
  }
  clearOperations(): this {
    throw new Error('Method not implemented.');
  }
}

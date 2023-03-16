import { Observable } from 'rxjs';

import { Table } from 'fit-core/model/index.js';
import {
  OperationExecutor,
  OperationDtoFactoryClass,
  OperationStepFactoryClass,
  OperationDto,
  OperationStep,
  OperationId,
} from 'fit-core/operations/index.js';

import { OperationStackExecutor } from './operation-stack-executor.js';
import {
  FitOperationDtoId,
  FitOperationStepId,
  FitOperationDtoArgs,
} from './fit-operation-executor-args.js';

export class FitOperationExecutor implements OperationExecutor {
  private readonly executor: OperationStackExecutor;
  private operationDtoFactories: {
    [operationId in FitOperationDtoId]?: OperationDtoFactoryClass;
  } = {};
  private operationStepFactories: {
    [stepId in FitOperationStepId]?: OperationStepFactoryClass;
  } = {};
  private table?: Table;

  constructor() {
    this.executor = new OperationStackExecutor(this.createOperationStepFn);
  }

  private readonly createOperationStepFn = (
    stepDto: OperationId<string>
  ): OperationStep => {
    const Factory: OperationStepFactoryClass | undefined =
      this.operationStepFactories[stepDto.id as FitOperationStepId];
    if (Factory) {
      if (!this.table) throw new Error('Table property hast to be set!');
      return new Factory().createStep(this.table, stepDto);
    } else {
      throw new Error('Invalid operation step id: ' + stepDto);
    }
  };

  public bindOperationDtoFactory(
    operationId: FitOperationDtoId,
    clazz: OperationDtoFactoryClass
  ): this {
    this.operationDtoFactories[operationId] = clazz;
    return this;
  }

  public unbindOperationDtoFactory(operationId: FitOperationDtoId): this {
    Reflect.getOwnPropertyDescriptor(this.operationDtoFactories, operationId);
    return this;
  }

  public bindOperationStepFactory(
    stepId: FitOperationStepId,
    clazz: OperationStepFactoryClass
  ): this {
    this.operationStepFactories[stepId] = clazz;
    return this;
  }

  public unbindOperationStepFactory(stepId: FitOperationStepId): this {
    Reflect.getOwnPropertyDescriptor(this.operationStepFactories, stepId);
    return this;
  }

  public unbindFactories(): this {
    this.operationDtoFactories = {};
    this.operationStepFactories = {};
    return this;
  }

  public setTable(table: Table): this {
    this.table = table;
    return this;
  }

  public getTable(): Table | undefined {
    return this.table;
  }

  public run(args: FitOperationDtoArgs): this {
    const operationDto: OperationDto | Promise<OperationDto> =
      this.createOperationDto(args);
    this.runOperationDto(operationDto);
    return this;
  }

  public createOperationDto(
    args: FitOperationDtoArgs
  ): OperationDto | Promise<OperationDto> {
    const Factory: OperationDtoFactoryClass | undefined =
      this.operationDtoFactories[args.id as FitOperationDtoId];
    if (Factory) {
      if (!this.table) throw new Error('Table property hast to be set!');
      return new Factory().createOperationDto(this.table, args);
    } else {
      throw new Error('Invalid operation id: ' + args.id);
    }
  }

  public runOperationDto(
    operationDto: OperationDto | Promise<OperationDto>
  ): this {
    if (operationDto instanceof Promise) {
      operationDto
        .then((dto: OperationDto): void => {
          this.executor.run(dto);
        })
        .catch((error: Error): void => console.error(error.message));
    } else {
      this.executor.run(operationDto);
    }
    return this;
  }

  public onBeforeRun$(): Observable<OperationDto> {
    return this.executor.beforeRun$.asObservable();
  }

  public onAfterRun$(): Observable<OperationDto> {
    return this.executor.afterRun$.asObservable();
  }

  public canUndo(): boolean {
    return this.executor.canUndo();
  }

  public undo(): this {
    this.executor.undo();
    return this;
  }

  public onBeforeUndo$(): Observable<OperationDto> {
    return this.executor.beforeUndo$.asObservable();
  }

  public onAfterUndo$(): Observable<OperationDto> {
    return this.executor.afterUndo$.asObservable();
  }

  public canRedo(): boolean {
    return this.executor.canRedo();
  }

  public redo(): this {
    this.executor.redo();
    return this;
  }

  public onBeforeRedo$(): Observable<OperationDto> {
    return this.executor.beforeRedo$.asObservable();
  }

  public onAfterRedo$(): Observable<OperationDto> {
    return this.executor.afterRedo$.asObservable();
  }

  public clearOperations(): this {
    this.executor.clearOperations();
    return this;
  }
}

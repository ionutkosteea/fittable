import { Table } from 'fit-core/model/index.js';
import {
  OperationExecutor,
  OperationDtoFactoryClass,
  OperationStepFactoryClass,
  OperationDto,
  OperationStep,
  Id,
  OperationExecutorListener,
} from 'fit-core/operations/index.js';

import { OperationStackExecutor } from './operation-stack-executor.js';
import { FitOperationFactory, FitOperation } from './fit-operation.js';

export class FitOperationExecutor<
  Args extends Id<string>,
  StepId extends string
> implements OperationExecutor<Args, StepId>
{
  private readonly executor: OperationStackExecutor =
    new OperationStackExecutor();
  private operationDtoFactories: {
    [operationId in Args['id']]?: OperationDtoFactoryClass;
  } = {};
  private operationStepFactories: {
    [stepId in StepId]?: OperationStepFactoryClass;
  } = {};
  private table?: Table;

  public bindOperationDtoFactory(
    operationId: Args['id'],
    clazz: OperationDtoFactoryClass
  ): this {
    this.operationDtoFactories[operationId] = clazz;
    return this;
  }

  public unbindOperationDtoFactory(operationId: Args['id']): this {
    Reflect.getOwnPropertyDescriptor(this.operationDtoFactories, operationId);
    return this;
  }

  public bindOperationStepFactory(
    stepId: StepId,
    clazz: OperationStepFactoryClass
  ): this {
    this.operationStepFactories[stepId] = clazz;
    return this;
  }

  public unbindOperationStepFactory(stepId: StepId): this {
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

  public addListener(listener: OperationExecutorListener): this {
    this.executor.addListener(listener);
    return this;
  }

  public clearListeners(): this {
    this.executor.clearListeners();
    return this;
  }

  public createOperationDto(args: Args): OperationDto | Promise<OperationDto> {
    const Factory: OperationDtoFactoryClass | undefined =
      this.operationDtoFactories[args.id as Args['id']];
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
        .then((dto: OperationDto): void => this.runDto(dto))
        .catch((error: Error): void => console.error(error.message));
    } else {
      this.runDto(operationDto);
    }
    return this;
  }

  private readonly runDto = (operationDto: OperationDto): void => {
    const operation: FitOperation = this.createOperation(operationDto);
    this.runOperation(operation);
  };

  public createOperation(operationDto: OperationDto): FitOperation {
    const factory: FitOperationFactory = new FitOperationFactory(
      this.createOperationStep
    );
    return factory.createOperation(operationDto);
  }

  public runOperation(operation: FitOperation): this {
    this.executor.run(operation);
    return this;
  }

  public run(args: Args): this {
    const operationDto: OperationDto | Promise<OperationDto> =
      this.createOperationDto(args);
    this.runOperationDto(operationDto);
    return this;
  }

  private readonly createOperationStep = (
    stepDto: Id<string>
  ): OperationStep => {
    const Factory: OperationStepFactoryClass | undefined =
      this.operationStepFactories[stepDto.id as StepId];
    if (Factory) {
      if (!this.table) throw new Error('Table property hast to be set!');
      return new Factory().createStep(this.table, stepDto);
    } else {
      throw new Error('Invalid operation step id: ' + stepDto);
    }
  };

  public canUndo(): boolean {
    return this.executor.canUndo();
  }

  public undo(): this {
    this.executor.undo();
    return this;
  }

  public canRedo(): boolean {
    return this.executor.canRedo();
  }

  public redo(): this {
    this.executor.redo();
    return this;
  }
}

import {
  Operation,
  OperationStep,
  OperationFactory,
  OperationDto,
  OperationId,
  BaseOperationDto,
} from 'fittable-core/operations/index.js';

export class FitOperation implements Operation {
  public readonly properties: { [id in string]?: unknown } = {};

  constructor(
    public readonly id: string,
    private readonly steps: OperationStep[],
    private readonly undoOperation?: FitOperation
  ) {}

  public run(): this {
    this.steps.forEach((step: OperationStep): void => step.run());
    return this;
  }

  public canUndo(): boolean {
    return this.undoOperation !== undefined;
  }

  public undo(): this {
    this.undoOperation?.steps //
      .forEach((step: OperationStep): void => step.run());
    return this;
  }
}

export class FitOperationFactory implements OperationFactory {
  constructor(
    public readonly createOperationStep: (
      stepDto: OperationId<string>
    ) => OperationStep
  ) {}

  public createOperation(operationDto: OperationDto): FitOperation {
    const steps: OperationStep[] = this.createOperationSteps(operationDto);
    if (operationDto.undoOperation) {
      const undoSteps: OperationStep[] = //
        this.createOperationSteps(operationDto.undoOperation);
      return new FitOperation(
        operationDto.id,
        steps,
        new FitOperation(operationDto.id, undoSteps)
      );
    } else {
      return new FitOperation(operationDto.id, steps);
    }
  }

  private createOperationSteps(
    operationDto: BaseOperationDto
  ): OperationStep[] {
    const steps: OperationStep[] = [];
    for (const stepDto of operationDto.steps) {
      const step: OperationStep = this.createOperationStep(stepDto);
      steps.push(step);
    }
    if (steps.length > 0) {
      return steps;
    } else {
      throw Error('Missing operation steps for operation DTO: ' + operationDto);
    }
  }
}

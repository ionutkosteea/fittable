import { Table } from 'fit-core/model/index.js';
import {
  OperationDto,
  OperationDtoFactory,
  OperationExecutor,
  OperationId,
  OperationStep,
  OperationStepFactory,
} from 'fit-core/operations/index.js';
import { ValueCondition } from 'fit-core/view-model/index.js';

export type ColFilterOperationStepDto = OperationId<'column-filter'> & {
  colId: number;
  valueCondition?: ValueCondition;
};

class ColFilterOperationStep implements OperationStep {
  public run(): void {
    // The operation is used just for handling filters through the operation execution stack. The actual filtering is done via specific listeners.
  }
}

class ColFilterOperationStepFactory implements OperationStepFactory {
  public createStep(): OperationStep {
    return new ColFilterOperationStep();
  }
}

export type ColFilterOperationArgs = OperationId<'column-filter'> & {
  stepDto: ColFilterOperationStepDto;
  undoStepDto: ColFilterOperationStepDto;
};

class ColFilterOperationDtoFactory implements OperationDtoFactory {
  public createOperationDto(
    table: Table,
    args: ColFilterOperationArgs
  ): OperationDto {
    return {
      id: args.id,
      steps: [args.stepDto],
      undoOperation: {
        steps: [args.undoStepDto],
      },
    };
  }
}

export function bindColFilterOperationFactories(
  operationExecutor: OperationExecutor
): void {
  const stepId: ColFilterOperationStepDto['id'] = 'column-filter';
  const operationId: ColFilterOperationArgs['id'] = 'column-filter';
  operationExecutor
    .bindOperationStepFactory(stepId, ColFilterOperationStepFactory)
    .bindOperationDtoFactory(operationId, ColFilterOperationDtoFactory);
}
import { Table, CellRange } from 'fittable-core/model/index.js';
import {
  OperationDto,
  OperationDtoFactory,
  OperationId,
} from 'fittable-core/operations/index.js';

import { CellCopyOperationStepDto } from '../../operation-steps/cell/cell-copy-operation-step.js';

export type CellCopyOperationDtoArgs = OperationId<'cell-copy'> & {
  selectedCells: CellRange[];
};

export class CellCopyOperationDtoFactory implements OperationDtoFactory {
  public createOperationDto(
    table: Table,
    args: CellCopyOperationDtoArgs
  ): OperationDto {
    return { id: args.id, steps: [this.createStepDto(args)] };
  }

  private createStepDto(
    args: CellCopyOperationDtoArgs
  ): CellCopyOperationStepDto {
    return {
      id: 'cell-copy',
      cellRange: args.selectedCells[0].getDto(),
    };
  }
}

import { Table, CellRange } from 'fit-core/model/index.js';
import {
  OperationId,
  OperationDto,
  OperationDtoFactory,
} from 'fit-core/operations/index.js';

import { CellRemoveOperationDtoFactory } from './cell-remove-operation-dto.js';
import { CellCopyOperationDtoFactory } from './cell-copy-operation-dto.js';

export type CellCutOperationDtoArgs = OperationId<'cell-cut'> & {
  selectedCells: CellRange[];
};

export class CellCutOperationDtoFactory implements OperationDtoFactory {
  public createOperationDto(
    table: Table,
    args: CellCutOperationDtoArgs
  ): OperationDto {
    const cellCopyOperationDto: OperationDto =
      new CellCopyOperationDtoFactory().createOperationDto(table, {
        id: 'cell-copy',
        selectedCells: args.selectedCells,
      });
    const cellRemoveOperationDto: OperationDto =
      new CellRemoveOperationDtoFactory().createOperationDto(table, {
        id: 'cell-remove',
        selectedCells: args.selectedCells,
      });
    return this.createCellCutOperationDto(
      'cell-cut',
      cellCopyOperationDto,
      cellRemoveOperationDto
    );
  }

  private createCellCutOperationDto(
    id: CellCutOperationDtoArgs['id'],
    cellCopyOperationDto: OperationDto,
    cellRemoveOperationDto: OperationDto
  ): OperationDto {
    const cellCutOperationDto: OperationDto = {
      id,
      steps: [],
      undoOperation: { steps: [] },
    };
    cellCopyOperationDto.steps.forEach((step: OperationId<string>): void => {
      cellCutOperationDto.steps.push(step);
    });
    cellRemoveOperationDto.steps.forEach((step: OperationId<string>): void => {
      cellCutOperationDto.steps.push(step);
    });
    cellRemoveOperationDto.undoOperation?.steps.forEach(
      (step: OperationId<string>): void => {
        cellCutOperationDto.undoOperation?.steps.push(step);
      }
    );
    return cellCutOperationDto;
  }
}

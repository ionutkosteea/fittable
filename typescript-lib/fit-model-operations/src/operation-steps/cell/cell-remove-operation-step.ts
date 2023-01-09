import { Table, createCellRange4Dto } from 'fit-core/model/index.js';
import {
  OperationStep,
  OperationStepFactory,
  Id,
} from 'fit-core/operations/index.js';

export type CellRemoveOperationStepDto = Id<'cell-remove'> & {
  removableCellRanges: unknown[];
};

export class CellRemoveOperationStep implements OperationStep {
  constructor(
    private readonly table: Table,
    private readonly stepDto: CellRemoveOperationStepDto
  ) {}

  public run(): void {
    this.removeCells();
  }

  private removeCells(): void {
    for (const cellRangeDto of this.stepDto.removableCellRanges) {
      createCellRange4Dto(cellRangeDto).forEachCell(
        (rowId: number, colId: number) => {
          this.table.removeCell(rowId, colId);
        }
      );
    }
  }
}

export class CellRemoveOperationStepFactory implements OperationStepFactory {
  public createStep(
    table: Table,
    stepDto: CellRemoveOperationStepDto
  ): OperationStep {
    return new CellRemoveOperationStep(table, stepDto);
  }
}

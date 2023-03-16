import { Table, createCellRange4Dto, CellRange } from 'fit-core/model/index.js';
import {
  OperationStep,
  OperationStepFactory,
  OperationId,
} from 'fit-core/operations/index.js';

export type CellRemoveOperationStepDto = OperationId<'cell-remove'> & {
  cellRanges: unknown[];
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
    for (const cellRangeDto of this.stepDto.cellRanges) {
      const cellRange: CellRange = createCellRange4Dto(cellRangeDto);
      const fromRowId: number = cellRange.getFrom().getRowId();
      const toRowId: number = cellRange.getTo().getRowId();
      const fromColId: number = cellRange.getFrom().getColId();
      const toColId: number = cellRange.getTo().getColId();
      for (let rowId: number = fromRowId; rowId <= toRowId; rowId++) {
        for (let colId: number = fromColId; colId <= toColId; colId++) {
          this.table.removeCell(rowId, colId);
        }
        this.removeRowIfEmpty(rowId);
      }
    }
  }

  private removeRowIfEmpty(rowId: number): void {
    let isEmptyRow = true;
    for (let colId = 0; colId < this.table.getNumberOfCols(); colId++) {
      if (this.table.hasCell(rowId, colId)) {
        isEmptyRow = false;
        break;
      }
    }
    if (isEmptyRow) this.table.removeRowCells(rowId);
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

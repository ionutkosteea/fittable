import {
  Table,
  Value,
  CellRange,
  createCellRange4Dto,
} from 'fit-core/model/index.js';
import {
  OperationStep,
  OperationStepFactory,
  OperationId,
} from 'fit-core/operations/index.js';

export type CellValueDto = {
  cellRanges: unknown[];
  value?: Value;
};

export type CellValueOperationStepDto = OperationId<'cell-value'> & {
  values: CellValueDto[];
};

export class CellValueOperationStep implements OperationStep {
  constructor(
    private readonly table: Table,
    private readonly stepDto: CellValueOperationStepDto
  ) {}

  public run(): void {
    return this.updateCells();
  }

  private updateCells(): void {
    for (const cellValueDto of this.stepDto.values) {
      for (const cellRangeDto of cellValueDto.cellRanges) {
        const cellRange: CellRange = createCellRange4Dto(cellRangeDto);
        const fromRowId: number = cellRange.getFrom().getRowId();
        const toRowId: number = cellRange.getTo().getRowId();
        const fromColId: number = cellRange.getFrom().getColId();
        const toColId: number = cellRange.getTo().getColId();
        for (let rowId: number = fromRowId; rowId <= toRowId; rowId++) {
          for (let colId: number = fromColId; colId <= toColId; colId++) {
            this.table.setCellValue(rowId, colId, cellValueDto.value);
          }
          this.removeRowIfEmpty(rowId);
        }
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

export class CellValueOperationStepFactory implements OperationStepFactory {
  public createStep(
    table: Table,
    stepDto: CellValueOperationStepDto
  ): OperationStep {
    return new CellValueOperationStep(table, stepDto);
  }
}

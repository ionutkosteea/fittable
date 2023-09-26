import {
  Table,
  CellRange,
  createCellRange4Dto,
  DataType,
  TableCellDataType,
} from 'fittable-core/model';
import {
  OperationStep,
  OperationStepFactory,
  OperationId,
} from 'fittable-core/operations';

export type CellDataTypeDto = {
  cellRanges: unknown[];
  dataType?: DataType;
};

export type CellDataTypeOperationStepDto = OperationId<'cell-data-type'> & {
  dataTypes: CellDataTypeDto[];
};

export class CellDataTypeOperationStep implements OperationStep {
  constructor(
    private readonly table: Table & TableCellDataType,
    private readonly stepDto: CellDataTypeOperationStepDto
  ) {}

  public run(): void {
    this.updateCells();
  }

  private updateCells(): void {
    for (const cellDataTypesDto of this.stepDto.dataTypes) {
      for (const cellRangeDto of cellDataTypesDto.cellRanges) {
        const cellRange: CellRange = createCellRange4Dto(cellRangeDto);
        const fromRowId: number = cellRange.getFrom().getRowId();
        const toRowId: number = cellRange.getTo().getRowId();
        const fromColId: number = cellRange.getFrom().getColId();
        const toColId: number = cellRange.getTo().getColId();
        for (let rowId: number = fromRowId; rowId <= toRowId; rowId++) {
          for (let colId: number = fromColId; colId <= toColId; colId++) {
            this.table.setCellDataType(rowId, colId, cellDataTypesDto.dataType);
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

export class CellDataTypeOperationStepFactory implements OperationStepFactory {
  public createStep(
    table: Table & TableCellDataType,
    stepDto: CellDataTypeOperationStepDto
  ): OperationStep {
    return new CellDataTypeOperationStep(table, stepDto);
  }
}

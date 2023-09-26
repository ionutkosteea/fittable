import {
  Table,
  Value,
  CellRange,
  createCellRange4Dto,
  DataType,
  TableCellDataType,
  asTableCellDataType,
} from 'fittable-core/model';
import {
  OperationStep,
  OperationStepFactory,
  OperationId,
} from 'fittable-core/operations';

export type CellValueDto = {
  cellRanges: unknown[];
  value?: Value;
  dataType?: DataType;
};
export type CellValueOperationStepDto = OperationId<'cell-value'> & {
  values: CellValueDto[];
};

export class CellValueOperationStep implements OperationStep {
  private dataTypeTable?: TableCellDataType;

  constructor(
    private readonly table: Table,
    private readonly stepDto: CellValueOperationStepDto
  ) {
    this.dataTypeTable = asTableCellDataType(table);
  }

  public run(): void {
    this.updateCellValues();
    this.updateCellDataTypes();
  }

  private updateCellValues(): void {
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

  private updateCellDataTypes(): void {
    if (!this.dataTypeTable) return;
    for (const cellValueDto of this.stepDto.values) {
      for (const cellRangeDto of cellValueDto.cellRanges) {
        const cellRange: CellRange = createCellRange4Dto(cellRangeDto);
        const fromRowId: number = cellRange.getFrom().getRowId();
        const toRowId: number = cellRange.getTo().getRowId();
        const fromColId: number = cellRange.getFrom().getColId();
        const toColId: number = cellRange.getTo().getColId();
        for (let rowId: number = fromRowId; rowId <= toRowId; rowId++) {
          for (let colId: number = fromColId; colId <= toColId; colId++) {
            this.dataTypeTable //
              .setCellDataType(rowId, colId, cellValueDto.dataType);
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

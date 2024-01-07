import {
  Table,
  CellRange,
  createCellRange4Dto,
  DataType,
  TableCellDataType,
} from 'fittable-core/model';
import {
  TableChangeWritter,
  TableChangeWritterFactory,
  Args,
} from 'fittable-core/operations';

export type DataTypeDto = {
  cellRanges: unknown[];
  dataType?: DataType;
};

export type DataTypeChange = Args<'cell-data-type'> & {
  dataTypes: DataTypeDto[];
};

export class CellDataTypeChangeWritter implements TableChangeWritter {
  constructor(
    private readonly table: Table & TableCellDataType,
    private readonly change: DataTypeChange
  ) {}

  public run(): void {
    this.updateCells();
  }

  private updateCells(): void {
    for (const dataTypeDto of this.change.dataTypes) {
      for (const cellRangeDto of dataTypeDto.cellRanges) {
        const cellRange: CellRange = createCellRange4Dto(cellRangeDto);
        const fromRowId: number = cellRange.getFrom().getRowId();
        const toRowId: number = cellRange.getTo().getRowId();
        const fromColId: number = cellRange.getFrom().getColId();
        const toColId: number = cellRange.getTo().getColId();
        for (let rowId: number = fromRowId; rowId <= toRowId; rowId++) {
          for (let colId: number = fromColId; colId <= toColId; colId++) {
            this.table.setCellDataType(rowId, colId, dataTypeDto.dataType);
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

export class CellDataTypeChangeWritterFactory
  implements TableChangeWritterFactory
{
  public createTableChangeWritter(
    table: Table & TableCellDataType,
    change: DataTypeChange
  ): TableChangeWritter {
    return new CellDataTypeChangeWritter(table, change);
  }
}

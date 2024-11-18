import {
  Table,
  CellRange,
  createCellRange4Dto,
  DataType,
  TableDataTypes,
  createDataType4Dto,
} from 'fittable-core/model';
import {
  TableChangeWritter,
  TableChangeWritterFactory,
  Args,
} from 'fittable-core/operations';

export type DataTypeItem = {
  cellRanges: unknown[];
  dataType?: unknown;
};

export type DataTypeChange = Args<'cell-data-type'> & {
  items: DataTypeItem[];
};

export class CellDataTypeChangeWritter implements TableChangeWritter {
  constructor(
    private readonly table: Table & TableDataTypes,
    private readonly change: DataTypeChange
  ) { }

  public run(): void {
    this.updateCells();
  }

  private updateCells(): void {
    for (const item of this.change.items) {
      for (const cellRangeDto of item.cellRanges) {
        const cellRange: CellRange = createCellRange4Dto(cellRangeDto);
        const fromRowId: number = cellRange.getFrom().getRowId();
        const toRowId: number = cellRange.getTo().getRowId();
        const fromColId: number = cellRange.getFrom().getColId();
        const toColId: number = cellRange.getTo().getColId();
        for (let rowId: number = fromRowId; rowId <= toRowId; rowId++) {
          for (let colId: number = fromColId; colId <= toColId; colId++) {
            let dataType: DataType | undefined;
            if (item.dataType) dataType = createDataType4Dto(item.dataType);
            this.table.setCellDataType(rowId, colId, dataType);
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
  implements TableChangeWritterFactory {
  public createTableChangeWritter(
    table: Table & TableDataTypes,
    change: DataTypeChange
  ): TableChangeWritter {
    return new CellDataTypeChangeWritter(table, change);
  }
}

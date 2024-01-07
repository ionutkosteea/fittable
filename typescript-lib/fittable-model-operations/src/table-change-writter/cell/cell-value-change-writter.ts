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
  TableChangeWritter,
  TableChangeWritterFactory,
  Args,
} from 'fittable-core/operations';

export type CellValueDto = {
  cellRanges: unknown[];
  value?: Value;
  dataType?: DataType;
};
export type CellValueChange = Args<'cell-value'> & { values: CellValueDto[] };

export class CellValueChangeWritter implements TableChangeWritter {
  private dataTypeTable?: TableCellDataType;

  constructor(
    private readonly table: Table,
    private readonly change: CellValueChange
  ) {
    this.dataTypeTable = asTableCellDataType(table);
  }

  public run(): void {
    this.updateCellValues();
    this.updateCellDataTypes();
  }

  private updateCellValues(): void {
    for (const cellValueDto of this.change.values) {
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
    for (const cellValueDto of this.change.values) {
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

export class CellValueChangeWritterFactory
  implements TableChangeWritterFactory
{
  public createTableChangeWritter(
    table: Table,
    change: CellValueChange
  ): TableChangeWritter {
    return new CellValueChangeWritter(table, change);
  }
}

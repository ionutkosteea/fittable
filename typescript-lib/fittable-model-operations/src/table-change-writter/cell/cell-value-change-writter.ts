import {
  Table,
  Value,
  CellRange,
  createCellRange4Dto,
} from 'fittable-core/model';
import {
  TableChangeWritter,
  TableChangeWritterFactory,
  Args,
} from 'fittable-core/operations';

export type CellValueItem = {
  cellRanges: unknown[];
  value?: Value;
};
export type CellValueChange = Args<'cell-value'> & { items: CellValueItem[] };

export class CellValueChangeWritter implements TableChangeWritter {

  constructor(private readonly table: Table, private readonly change: CellValueChange) { }

  public run(): void {
    this.updateCellValues();
  }

  private updateCellValues(): void {
    for (const item of this.change.items) {
      for (const cellRangeDto of item.cellRanges) {
        const cellRange: CellRange = createCellRange4Dto(cellRangeDto);
        const fromRowId: number = cellRange.getFrom().getRowId();
        const toRowId: number = cellRange.getTo().getRowId();
        const fromColId: number = cellRange.getFrom().getColId();
        const toColId: number = cellRange.getTo().getColId();
        for (let rowId: number = fromRowId; rowId <= toRowId; rowId++) {
          for (let colId: number = fromColId; colId <= toColId; colId++) {
            this.table.setCellValue(rowId, colId, item.value);
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
  implements TableChangeWritterFactory {
  public createTableChangeWritter(
    table: Table,
    change: CellValueChange
  ): TableChangeWritter {
    return new CellValueChangeWritter(table, change);
  }
}

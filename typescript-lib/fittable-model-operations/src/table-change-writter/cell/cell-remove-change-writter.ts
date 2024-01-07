import { Table, createCellRange4Dto, CellRange } from 'fittable-core/model';
import {
  TableChangeWritter,
  TableChangeWritterFactory,
  Args,
} from 'fittable-core/operations';

export type CellRemoveChange = Args<'cell-remove'> & {
  cellRanges: unknown[];
};

export class CellRemoveChangeWritter implements TableChangeWritter {
  constructor(
    private readonly table: Table,
    private readonly change: CellRemoveChange
  ) {}

  public run(): void {
    this.removeCells();
  }

  private removeCells(): void {
    for (const cellRangeDto of this.change.cellRanges) {
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

export class CellRemoveChangeWritterFactory
  implements TableChangeWritterFactory
{
  public createTableChangeWritter(
    table: Table,
    change: CellRemoveChange
  ): TableChangeWritter {
    return new CellRemoveChangeWritter(table, change);
  }
}

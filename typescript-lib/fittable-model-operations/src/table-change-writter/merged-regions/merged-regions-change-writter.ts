import { Table, TableMergedRegions } from 'fittable-core/model';
import {
  Args,
  TableChangeWritter,
  TableChangeWritterFactory,
} from 'fittable-core/operations';

export type RemoveRegionDto = { rowId: number; colId: number };
export type CreateRegionDto = RemoveRegionDto & {
  rowSpan?: number;
  colSpan?: number;
};
export type MoveRegionDto = RemoveRegionDto & {
  moveRow: number;
  moveCol: number;
};
export type IncreaseRegionDto = RemoveRegionDto & {
  increaseRow: number;
  increaseCol: number;
};

export type MergedRegionsChange = Args<'merged-regions'> & {
  createRegions?: CreateRegionDto[];
  removeRegions?: RemoveRegionDto[];
  moveRegions?: MoveRegionDto[];
  increaseRegions?: IncreaseRegionDto[];
};

export class MergedRegionsChangeWritter implements TableChangeWritter {
  private removedRegionRowIds: Set<number> = new Set();

  constructor(
    private readonly table: Table & TableMergedRegions,
    private readonly change: MergedRegionsChange
  ) {}

  public run(): void {
    this.removeRegions();
    this.createRegions();
    this.increaseRegions();
    this.moveRegions();
    this.removeEmptyRowRegions();
  }

  private createRegions(): void {
    for (const r of this.change?.createRegions ?? []) {
      this.table
        .setRowSpan(r.rowId, r.colId, r.rowSpan)
        .setColSpan(r.rowId, r.colId, r.colSpan);
    }
  }

  private removeRegions(): void {
    for (const r of this.change?.removeRegions ?? []) {
      this.table.setRowSpan(r.rowId, r.colId).setColSpan(r.rowId, r.colId);
      this.removedRegionRowIds.add(r.rowId);
    }
  }

  private moveRegions(): void {
    for (const r of this.change?.moveRegions ?? []) {
      this.table.moveRegion(r.rowId, r.colId, r.moveRow, r.moveCol);
      this.removedRegionRowIds.add(r.rowId);
    }
  }

  private increaseRegions(): void {
    for (const r of this.change?.increaseRegions ?? []) {
      this.table.increaseRegion(r.rowId, r.colId, r.increaseRow, r.increaseCol);
    }
  }

  private removeEmptyRowRegions(): void {
    for (const rowId of this.removedRegionRowIds) {
      let isRowWithoutRegions = true;
      for (let colId = 0; colId < this.table.getNumberOfCols(); colId++) {
        const rowSpan: number | undefined = this.table.getRowSpan(rowId, colId);
        const colSpan: number | undefined = this.table.getColSpan(rowId, colId);
        if (rowSpan || colSpan) {
          isRowWithoutRegions = false;
          break;
        }
      }
      isRowWithoutRegions && this.table.removeRowRegions(rowId);
    }
  }
}

export class MergedRegionsChangeWritterFactory
  implements TableChangeWritterFactory
{
  public createTableChangeWritter(
    table: Table & TableMergedRegions,
    change: MergedRegionsChange
  ): MergedRegionsChangeWritter {
    return new MergedRegionsChangeWritter(table, change);
  }
}

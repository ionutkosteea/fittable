import {
  CellRange,
  TableBasics,
  TableMergedRegions,
} from 'fittable-core/model';
import {
  Args,
  TableChanges,
  TableChangesFactory,
} from 'fittable-core/operations';

import { MergedRegionsChange } from '../../table-change-writter/merged-regions/merged-regions-change-writter.js';

export type CellMergeArgs = Args<'cell-merge'> & {
  selectedCells: CellRange[];
};

export class CellMergeChangesBuilder {
  private readonly mergedRegionsChange: MergedRegionsChange = {
    id: 'merged-regions',
    createRegions: [],
    removeRegions: [],
  };
  private readonly mergedRegionsUndoChange: MergedRegionsChange = {
    id: 'merged-regions',
    createRegions: [],
    removeRegions: [],
  };

  constructor(
    private readonly table: TableBasics & TableMergedRegions,
    private readonly args: CellMergeArgs
  ) {}

  public build(): TableChanges {
    this.removeExistingRegions();
    this.createRegions();
    return {
      id: this.args.id,
      changes: [this.mergedRegionsChange],
      undoChanges: { changes: [this.mergedRegionsUndoChange] },
    };
  }

  private removeExistingRegions(): void {
    for (const cellRange of this.args.selectedCells) {
      this.table.forEachMergedCell((rowId: number, colId: number): void => {
        if (!cellRange.hasCell(rowId, colId)) return;
        this.mergedRegionsChange.removeRegions?.push({ rowId, colId });
        this.mergedRegionsUndoChange.createRegions?.push({
          rowId,
          colId,
          rowSpan: this.table.getRowSpan(rowId, colId),
          colSpan: this.table.getColSpan(rowId, colId),
        });
      });
    }
  }

  private createRegions(): void {
    for (const cellRange of this.args.selectedCells) {
      const rowId: number = cellRange.getFrom().getRowId();
      const colId: number = cellRange.getFrom().getColId();
      let rowSpan: number | undefined = cellRange.getTo().getRowId() - rowId;
      rowSpan = rowSpan === 0 ? undefined : rowSpan + 1;
      let colSpan: number | undefined = cellRange.getTo().getColId() - colId;
      colSpan = colSpan === 0 ? undefined : colSpan + 1;
      this.mergedRegionsChange.createRegions?.push({
        rowId,
        colId,
        rowSpan,
        colSpan,
      });
      this.mergedRegionsUndoChange.removeRegions?.push({ rowId, colId });
    }
  }
}

export class CellMergeChangesFactory implements TableChangesFactory {
  public createTableChanges(
    table: TableBasics & TableMergedRegions,
    args: CellMergeArgs
  ): TableChanges | Promise<TableChanges> {
    return new CellMergeChangesBuilder(table, args).build();
  }
}

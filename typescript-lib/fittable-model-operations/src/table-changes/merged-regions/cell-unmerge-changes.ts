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

export type CellUnmergeArgs = Args<'cell-unmerge'> & {
  selectedCells: CellRange[];
};

export class CellUnmergeChangesBuilder {
  private readonly mergedRegionsChange: MergedRegionsChange = {
    id: 'merged-regions',
    removeRegions: [],
  };
  private readonly mergedRegionsUndoChange: MergedRegionsChange = {
    id: 'merged-regions',
    createRegions: [],
  };

  constructor(
    private readonly table: TableBasics & TableMergedRegions,
    private readonly args: CellUnmergeArgs
  ) {}

  public build(): TableChanges {
    this.removeExistingRegions();
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
}

export class CellUnmergeChangesFactory implements TableChangesFactory {
  public createTableChanges(
    table: TableBasics & TableMergedRegions,
    args: CellUnmergeArgs
  ): TableChanges | Promise<TableChanges> {
    return new CellUnmergeChangesBuilder(table, args).build();
  }
}

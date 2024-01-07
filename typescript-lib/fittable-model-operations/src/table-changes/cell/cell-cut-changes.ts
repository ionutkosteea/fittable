import { Table, CellRange } from 'fittable-core/model';
import {
  Args,
  TableChanges,
  TableChangesFactory,
} from 'fittable-core/operations';

import { CellRemoveChangesFactory } from './cell-remove-changes.js';
import { CellCopyChangesFactory } from './cell-copy-changes.js';

export type CellCutArgs = Args<'cell-cut'> & {
  selectedCells: CellRange[];
};

export class CellCutChangesFactory implements TableChangesFactory {
  public createTableChanges(table: Table, args: CellCutArgs): TableChanges {
    const cellCopyChanges: TableChanges =
      new CellCopyChangesFactory().createTableChanges(table, {
        id: 'cell-copy',
        selectedCells: args.selectedCells,
      });
    const cellRemoveChanges: TableChanges =
      new CellRemoveChangesFactory().createTableChanges(table, {
        id: 'cell-remove',
        selectedCells: args.selectedCells,
      });
    return this.createCellCutTableChanges(
      'cell-cut',
      cellCopyChanges,
      cellRemoveChanges
    );
  }

  private createCellCutTableChanges(
    id: CellCutArgs['id'],
    cellCopyChanges: TableChanges,
    cellRemoveChanges: TableChanges
  ): TableChanges {
    const cellCutChanges: TableChanges = {
      id,
      changes: [],
      undoChanges: { changes: [] },
    };
    cellCopyChanges.changes.forEach((change: Args<string>): void => {
      cellCutChanges.changes.push(change);
    });
    cellRemoveChanges.changes.forEach((change: Args<string>): void => {
      cellCutChanges.changes.push(change);
    });
    cellRemoveChanges.undoChanges?.changes.forEach(
      (change: Args<string>): void => {
        cellCutChanges.undoChanges?.changes.push(change);
      }
    );
    return cellCutChanges;
  }
}

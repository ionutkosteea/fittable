import { Table, CellRange } from 'fittable-core/model';
import {
  TableChanges,
  TableChangesFactory,
  Args,
} from 'fittable-core/operations';

import { CellCopyChange } from '../../table-change-writter/cell/cell-copy-change-writter.js';

export type CellCopyArgs = Args<'cell-copy'> & {
  selectedCells: CellRange[];
};

export class CellCopyChangesFactory implements TableChangesFactory {
  public createTableChanges(table: Table, args: CellCopyArgs): TableChanges {
    return { id: args.id, changes: [this.createCellCopyChange(args)] };
  }

  private createCellCopyChange(args: CellCopyArgs): CellCopyChange {
    return {
      id: 'cell-copy',
      cellRange: args.selectedCells[0].getDto(),
    };
  }
}

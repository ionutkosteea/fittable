import {
  Table,
  CellRange,
  Style,
  TableStyles,
  createDto4CellRangeList,
} from 'fittable-core/model';
import {
  TableChanges,
  TableChangesFactory,
  Args,
} from 'fittable-core/operations';

import { CellRangeAddressObjects } from '../../utils/cell/cell-range-address-objects.js';
import {
  countAllCellStyleNames,
  countSelectedCellStyleNames,
} from '../../utils/style/style-functions.js';
import { StyleChange } from '../../table-change-writter/style/style-change-writter.js';

export type StyleRemoveArgs = Args<'style-remove'> & {
  selectedCells: CellRange[];
};

export class StyleRemoveChangesBuilder {
  public readonly styleChange: StyleChange = {
    id: 'style-update',
    createStyles: [],
    updateStyles: [],
    removeStyles: [],
    cellStyleNames: [],
  };
  public readonly styleUndoChange: StyleChange = {
    id: 'style-update',
    createStyles: [],
    updateStyles: [],
    removeStyles: [],
    cellStyleNames: [],
  };
  private readonly changes: TableChanges;

  constructor(
    private readonly table: Table & TableStyles,
    private readonly args: StyleRemoveArgs
  ) {
    this.changes = {
      id: args.id,
      changes: [this.styleChange],
      undoChanges: { changes: [this.styleUndoChange] },
    };
  }

  public build(): TableChanges {
    const removableStyles: CellRangeAddressObjects<string> =
      this.getRemovableStyles();
    this.removeStyles(removableStyles);
    this.undoRemovedStyles(removableStyles);
    return this.changes;
  }

  private getRemovableStyles(): CellRangeAddressObjects<string> {
    const removableStyles: CellRangeAddressObjects<string> =
      new CellRangeAddressObjects();
    for (const cellRange of this.args.selectedCells) {
      cellRange.forEachCell((rowId: number, colId: number): void => {
        const styleName: string | undefined = //
          this.table.getCellStyleName(rowId, colId);
        styleName && removableStyles.set(styleName, rowId, colId);
      });
    }
    return removableStyles;
  }

  private removeStyles(styleNameMap: CellRangeAddressObjects<string>): void {
    const allCellsCnt: Map<string, number> = countAllCellStyleNames(this.table);
    const selectedCellsCnt: Map<string, number> = countSelectedCellStyleNames(
      this.table,
      this.args.selectedCells
    );
    styleNameMap.forEach((styleName: string, address: CellRange[]): void => {
      const cellRanges: unknown[] = createDto4CellRangeList(address);
      this.styleChange.cellStyleNames.push({ cellRanges });
      const numOfAllCells: number = allCellsCnt.get(styleName) ?? 0;
      const numOfSelectedCells: number = selectedCellsCnt.get(styleName) ?? 0;
      if (numOfAllCells === numOfSelectedCells) {
        this.styleChange.removeStyles.push(styleName);
      }
    });
  }

  private undoRemovedStyles(
    styleNameMap: CellRangeAddressObjects<string>
  ): void {
    styleNameMap.forEach((styleName: string, address: CellRange[]): void => {
      this.styleUndoChange.cellStyleNames.push({
        cellRanges: createDto4CellRangeList(address),
        styleName,
      });
    });
    this.styleChange.removeStyles.forEach((styleName: string): void => {
      const style: Style | undefined = this.table.getStyle(styleName);
      style &&
        this.styleUndoChange.createStyles.push({
          styleName,
          style: style.getDto(),
        });
    });
  }
}

export class StyleRemoveChangesFactory implements TableChangesFactory {
  public createTableChanges(
    table: Table & TableStyles,
    args: StyleRemoveArgs
  ): TableChanges | Promise<TableChanges> {
    return new StyleRemoveChangesBuilder(table, args).build();
  }
}

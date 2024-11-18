import {
  Table,
  CellRange,
  TableStyles,
  Style,
  createDto4CellRangeList,
  TableDataTypes,
  asTableDataTypes,
  asTableStyles,
  DataType,
} from 'fittable-core/model';
import {
  TableChanges,
  TableChangesFactory,
  Args,
} from 'fittable-core/operations';

import { CellRangeAddressObjects } from '../../utils/cell/cell-range-address-objects.js';
import { countAllCellStyleNames } from '../../utils/style/style-functions.js';
import { StyleChange } from '../../table-change-writter/style/style-change-writter.js';
import { DataTypeChange } from '../../table-change-writter/cell/cell-data-type-change-writter.js';
import {
  CellDataTypeArgs,
  CellDataTypeChangesBuilder,
} from '../cell/cell-data-type-changes.js';

export type PaintFormatArgs = Args<'paint-format'> & {
  selectedCells: CellRange[];
  styleName?: string;
  dataType?: DataType;
};

export class PaintFormatChangesBuilder {
  public readonly styleChange: StyleChange = {
    id: 'style-update',
    createStyles: [],
    updateStyles: [],
    removeStyles: [],
    cellStyleNames: [],
  };
  public readonly dataTypeChange: DataTypeChange = {
    id: 'cell-data-type',
    items: [],
  };
  public readonly styleUndoChange: StyleChange = {
    id: 'style-update',
    createStyles: [],
    updateStyles: [],
    removeStyles: [],
    cellStyleNames: [],
  };
  public readonly dataTypeUndoChange: DataTypeChange = {
    id: 'cell-data-type',
    items: [],
  };
  private readonly changes: TableChanges;
  private tableStyles?: Table & TableStyles;
  private tableDataTypes?: Table & TableDataTypes;
  private oldStyleNames: CellRangeAddressObjects<string | undefined>;

  constructor(
    private readonly table: Table,
    private readonly args: PaintFormatArgs
  ) {
    this.tableStyles = asTableStyles(this.table);
    this.tableDataTypes = asTableDataTypes(this.table);
    this.changes = {
      id: this.args.id,
      changes: [this.styleChange, this.dataTypeChange],
      undoChanges: {
        changes: [this.styleUndoChange, this.dataTypeUndoChange],
      },
    };
    this.oldStyleNames = new CellRangeAddressObjects();
  }

  public build(): TableChanges {
    this.updateStyles();
    this.updateDataTypes();
    return this.changes;
  }

  private updateStyles(): void {
    if (!this.tableStyles) return;
    this.markOldStyleNames();
    this.updateCellStyleNames();
    this.removeStyles();
  }

  private markOldStyleNames(): void {
    for (const cellRange of this.args.selectedCells) {
      cellRange.forEachCell((rowId: number, colId: number): void => {
        const oldStyleName: string | undefined = //
          this.tableStyles?.getCellStyleName(rowId, colId);
        oldStyleName !== this.args.styleName &&
          this.oldStyleNames.set(oldStyleName, rowId, colId);
      });
    }
  }

  private updateCellStyleNames(): void {
    const cellRanges: CellRange[] = this.oldStyleNames.getAllAddresses();
    this.styleChange.cellStyleNames.push({
      cellRanges: createDto4CellRangeList(cellRanges),
      styleName: this.args.styleName,
    });
    this.oldStyleNames.forEach(
      (styleName: string | undefined, address: CellRange[]) => {
        this.styleUndoChange.cellStyleNames.push({
          cellRanges: createDto4CellRangeList(address),
          styleName,
        });
      }
    );
  }

  private removeStyles(): void {
    if (!this.tableStyles) return;
    const allCellsCnt: Map<string, number> = //
      countAllCellStyleNames(this.tableStyles);
    for (const styleName of this.oldStyleNames.getAllObjects()) {
      if (!styleName) continue;
      const updatableCells: CellRange[] =
        this.oldStyleNames.getAddress(styleName) ?? [];
      const numOfUndoCells: number =
        this.calculateNumberOfCells(updatableCells);
      const numOfAllCells: number | undefined = allCellsCnt.get(styleName);
      if (numOfUndoCells < (numOfAllCells ?? 0)) return;
      this.styleChange.removeStyles.push(styleName);
      const style: Style | undefined = this.tableStyles.getStyle(styleName);
      if (!style) return;
      this.styleUndoChange.createStyles //
        .push({ styleName, style: style.getDto() });
    }
  }

  private calculateNumberOfCells(cellRanges: CellRange[]): number {
    let numberOfCells = 0;
    cellRanges.forEach((cellRange: CellRange) => {
      numberOfCells += this.calculateNumberOfExistingCells(cellRange);
    });
    return numberOfCells;
  }

  private calculateNumberOfExistingCells(cellRange: CellRange): number {
    let numberOfCells = 0;
    cellRange.forEachCell((rowId: number, colId: number): void => {
      this.table.hasCell(rowId, colId) && numberOfCells++;
    });
    return numberOfCells;
  }

  private updateDataTypes(): void {
    if (!this.tableDataTypes) return;
    const args: CellDataTypeArgs = {
      id: 'cell-data-type',
      selectedCells: this.args.selectedCells,
      dataType: this.args.dataType,
    };
    const builder: CellDataTypeChangesBuilder = new CellDataTypeChangesBuilder(this.tableDataTypes, args);
    builder.build();
    this.dataTypeChange.items = builder.dataTypeChange.items;
    this.dataTypeUndoChange.items = builder.dataTypeUndoChange.items;
  }
}

export class PaintFormatChangesFactory implements TableChangesFactory {
  public createTableChanges(
    table: Table & TableStyles,
    args: PaintFormatArgs
  ): TableChanges | Promise<TableChanges> {
    return new PaintFormatChangesBuilder(table, args).build();
  }
}

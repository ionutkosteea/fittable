import {
  Table,
  CellRange,
  TableStyles,
  Style,
  createDto4CellRangeList,
  TableCellDataType,
  asTableCellDataType,
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
} from '../cell/cell-data-type-change.js';

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
    dataTypes: [],
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
    dataTypes: [],
  };
  private readonly changes: TableChanges;
  private styledTable?: Table & TableStyles;
  private dataTypeTable?: Table & TableCellDataType;
  private oldStyleNames: CellRangeAddressObjects<string | undefined>;

  constructor(
    private readonly table: Table,
    private readonly args: PaintFormatArgs
  ) {
    this.styledTable = asTableStyles(this.table);
    this.dataTypeTable = asTableCellDataType(this.table);
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
    if (!this.styledTable) return;
    this.markOldStyleNames();
    this.updateCellStyleNames();
    this.removeStyles();
  }

  private markOldStyleNames(): void {
    for (const cellRange of this.args.selectedCells) {
      cellRange.forEachCell((rowId: number, colId: number): void => {
        const oldStyleName: string | undefined = //
          this.styledTable?.getCellStyleName(rowId, colId);
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
    if (!this.styledTable) return;
    const allCellsCnt: Map<string, number> = //
      countAllCellStyleNames(this.styledTable);
    for (const styleName of this.oldStyleNames.getAllObjects()) {
      if (!styleName) continue;
      const updatableCells: CellRange[] =
        this.oldStyleNames.getAddress(styleName) ?? [];
      const numOfUndoCells: number =
        this.calculateNumberOfCells(updatableCells);
      const numOfAllCells: number | undefined = allCellsCnt.get(styleName);
      if (numOfUndoCells < (numOfAllCells ?? 0)) return;
      this.styleChange.removeStyles.push(styleName);
      const style: Style | undefined = this.styledTable.getStyle(styleName);
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
    if (!this.dataTypeTable) return;
    const args: CellDataTypeArgs = {
      id: 'cell-data-type',
      selectedCells: this.args.selectedCells,
      dataType: this.args.dataType,
    };
    const builder: CellDataTypeChangesBuilder = //
      new CellDataTypeChangesBuilder(this.dataTypeTable, args);
    builder.build();
    this.dataTypeChange.dataTypes = builder.dataTypeChange.dataTypes;
    this.dataTypeUndoChange.dataTypes = builder.dataTypeUndoChange.dataTypes;
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

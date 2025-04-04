import {
  Table,
  CellRange,
  Style,
  TableStyles,
  Value,
  createCellRange4Dto,
  createDto4CellRangeList,
  createCellRangeList4Dto,
  CellRangeList,
  asTableStyles,
  DataType,
  TableDataTypes,
  asTableDataTypes,
  TableData,
  asTableData,
} from 'fittable-core/model';
import {
  TableChanges,
  TableChangesFactory,
  Args,
} from 'fittable-core/operations';

import {
  countAllCellStyleNames,
  countSelectedCellStyleNames,
} from '../../utils/style/style-functions.js';
import { CellRangeAddressObjects } from '../../utils/cell/cell-range-address-objects.js';
import { CellValueChange } from '../../table-change-writter/cell/cell-value-change-writter.js';
import { StyleChange } from '../../table-change-writter/style/style-change-writter.js';
import { CellRemoveChange } from '../../table-change-writter/cell/cell-remove-change-writter.js';
import { DataTypeChange } from '../../table-change-writter/cell/cell-data-type-change-writter.js';
import { CellDataRefChange } from '../../table-change-writter/cell/cell-data-ref-change-writter.js';

export type CellRemoveArgs = Args<'cell-remove'> & {
  selectedCells: CellRange[];
};

export class CellRemoveChangesBuilder {
  public readonly cellRemoveChange: CellRemoveChange = {
    id: 'cell-remove',
    cellRanges: [],
  };
  public readonly styleChange: StyleChange = {
    id: 'style-update',
    createStyles: [],
    updateStyles: [],
    removeStyles: [],
    cellStyleNames: [],
  };
  public readonly cellValueUndoChange: CellValueChange = {
    id: 'cell-value',
    items: [],
  };
  public readonly cellDataTypesUndoChange: DataTypeChange = {
    id: 'cell-data-type',
    items: [],
  };
  public readonly cellDataRefsUndoChange: CellDataRefChange = {
    id: 'cell-data-ref',
    items: [],
  };
  public readonly styleUndoChange: StyleChange = {
    id: 'style-update',
    createStyles: [],
    updateStyles: [],
    removeStyles: [],
    cellStyleNames: [],
  };
  private readonly changes: TableChanges;
  private readonly tableStyles?: Table & TableStyles;

  constructor(
    private readonly table: Table,
    private readonly args: CellRemoveArgs
  ) {
    this.tableStyles = asTableStyles(table);
    this.changes = {
      id: args.id,
      changes: [this.cellRemoveChange, this.styleChange],
      undoChanges: {
        changes: [
          this.cellValueUndoChange,
          this.cellDataTypesUndoChange,
          this.cellDataRefsUndoChange,
          this.styleUndoChange,
        ],
      },
    };
  }

  public build(): TableChanges {
    this.removeCells();
    this.undoCellValues();
    this.undoCellDataTypes();
    this.undoCellDataRefs();
    if (this.tableStyles) {
      this.undoStyleNames();
      this.removeStyles();
      this.undoRemoveStyles();
    }
    return this.changes;
  }

  private removeCells(): void {
    const removableCells: CellRangeList = new CellRangeList();
    for (const cellRange of this.args.selectedCells) {
      cellRange.forEachCell((rowId: number, colId: number): void => {
        this.table.hasCell(rowId, colId) &&
          removableCells.addCell(rowId, colId);
      });
    }
    removableCells.getRanges().forEach((cellRange: CellRange) => {
      this.cellRemoveChange.cellRanges.push(cellRange.getDto());
    });
  }

  private undoCellValues(): void {
    const oldValues: CellRangeAddressObjects<Value | undefined> =
      new CellRangeAddressObjects();
    for (const cellRangeDto of this.cellRemoveChange.cellRanges) {
      createCellRange4Dto(cellRangeDto).forEachCell(
        (rowId: number, colId: number): void => {
          const value: Value | undefined = //
            this.table.getCellValue(rowId, colId);
          value !== undefined && oldValues.set(value, rowId, colId);
        }
      );
    }
    oldValues.forEach(
      (value: Value | undefined, address: CellRange[]): void => {
        this.cellValueUndoChange.items.push({
          value,
          cellRanges: createDto4CellRangeList(address),
        });
      }
    );
  }

  private undoCellDataTypes(): void {
    const tableDataTypes: TableDataTypes | undefined = asTableDataTypes(this.table);
    if (!tableDataTypes) return;
    const oldDataTypes: CellRangeAddressObjects<DataType | undefined> =
      new CellRangeAddressObjects();
    for (const cellRangeDto of this.cellRemoveChange.cellRanges) {
      createCellRange4Dto(cellRangeDto).forEachCell(
        (rowId: number, colId: number): void => {
          const dataType: DataType | undefined = //
            tableDataTypes.getCellDataType(rowId, colId);
          dataType && oldDataTypes.set(dataType, rowId, colId);
        }
      );
    }
    oldDataTypes.forEach(
      (dataType: DataType | undefined, address: CellRange[]): void => {
        this.cellDataTypesUndoChange.items.push({
          dataType: dataType?.getDto(),
          cellRanges: createDto4CellRangeList(address),
        });
      }
    );
  }

  private undoCellDataRefs(): void {
    const tableData: TableData | undefined = asTableData(this.table);
    if (!tableData) return;
    const oldCellDataRefs: CellRangeAddressObjects<string | undefined> = new CellRangeAddressObjects();
    for (const cellRangeDto of this.cellRemoveChange.cellRanges) {
      createCellRange4Dto(cellRangeDto).forEachCell(
        (rowId: number, colId: number): void => {
          const dataRef: string | undefined = tableData.getCellDataRef(rowId, colId);
          dataRef && oldCellDataRefs.set(dataRef, rowId, colId);
        }
      );
    }
    oldCellDataRefs.forEach(
      (dataRef: string | undefined, address: CellRange[]): void => {
        this.cellDataRefsUndoChange.items.push({
          cellRanges: createDto4CellRangeList(address),
          dataRef,
        });
      }
    );
  }

  private undoStyleNames(): void {
    const oldStyleNames: CellRangeAddressObjects<string | undefined> =
      new CellRangeAddressObjects();
    for (const cellRangeDto of this.cellRemoveChange.cellRanges) {
      createCellRange4Dto(cellRangeDto).forEachCell(
        (rowId: number, colId: number) => {
          const styleName: string | undefined = //
            this.tableStyles?.getCellStyleName(rowId, colId);
          if (styleName) {
            oldStyleNames.set(styleName, rowId, colId);
          }
        }
      );
    }
    oldStyleNames.forEach(
      (styleName: string | undefined, address: CellRange[]) => {
        const cellRanges: unknown[] = createDto4CellRangeList(address);
        this.styleUndoChange.cellStyleNames.push({ cellRanges, styleName });
      }
    );
  }

  private removeStyles(): void {
    const styleTable = this.tableStyles as Table & TableStyles;
    const allCellsCnt: Map<string, number> = countAllCellStyleNames(styleTable);
    const selectedCellsCnt: Map<string, number> = countSelectedCellStyleNames(
      styleTable,
      createCellRangeList4Dto(this.cellRemoveChange.cellRanges)
    );
    selectedCellsCnt.forEach(
      (numOfSelectedCells: number, styleName?: string) => {
        if (styleName) {
          const numOfAllCells: number | undefined = allCellsCnt.get(styleName);
          if (numOfSelectedCells >= (numOfAllCells ?? 0)) {
            this.styleChange.removeStyles.push(styleName);
          }
        }
      }
    );
  }

  private undoRemoveStyles(): void {
    this.styleChange.removeStyles.forEach((styleName: string) => {
      const styleTable = this.tableStyles as Table & TableStyles;
      const style: Style | undefined = styleTable.getStyle(styleName);
      style &&
        this.styleUndoChange.createStyles.push({
          styleName,
          style: style.getDto(),
        });
    });
  }
}

export class CellRemoveChangesFactory implements TableChangesFactory {
  public createTableChanges(table: Table, args: CellRemoveArgs): TableChanges {
    return new CellRemoveChangesBuilder(table, args).build();
  }
}

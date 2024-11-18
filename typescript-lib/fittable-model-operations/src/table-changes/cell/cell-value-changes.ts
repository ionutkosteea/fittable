import {
  Table,
  CellRange,
  Value,
  createCellRange4Dto,
  createDto4CellRangeList,
  CellRangeList,
  DataType,
  TableDataTypes,
  asTableDataTypes,
} from 'fittable-core/model';
import {
  TableChanges,
  TableChangesFactory,
  Args,
} from 'fittable-core/operations';

import { CellRangeAddressObjects } from '../../utils/cell/cell-range-address-objects.js';
import { CellValueChange } from '../../table-change-writter/cell/cell-value-change-writter.js';
import { CellDataTypeChangesBuilder } from './cell-data-type-changes.js';

export type CellValueArgs = Args<'cell-value'> & {
  selectedCells: CellRange[];
  value?: Value;
  dataType?: DataType
};

export class CellValueChangesBuilder {
  public readonly cellValueChange: CellValueChange = {
    id: 'cell-value',
    items: [],
  };
  public readonly cellValueUndoChange: CellValueChange = {
    id: 'cell-value',
    items: [],
  };
  private readonly changes: TableChanges;
  private readonly updatableCells: CellRangeList = new CellRangeList();
  private readonly dataTypeChangesBuilder?: CellDataTypeChangesBuilder;

  constructor(
    private readonly table: Table,
    private readonly args: CellValueArgs
  ) {
    this.dataTypeChangesBuilder = this.createCellDataTypeChangesBuilder();
    this.changes = this.createChanges();
  }

  public build(): TableChanges {
    this.prepareUpdatableCells();
    this.updateCellValues();
    this.undoCellValues();
    this.dataTypeChangesBuilder?.build();
    return this.changes;
  }

  private createCellDataTypeChangesBuilder(): CellDataTypeChangesBuilder | undefined {
    const tableDataTypes: Table & TableDataTypes | undefined = asTableDataTypes(this.table);
    if (tableDataTypes) {
      return new CellDataTypeChangesBuilder(
        tableDataTypes,
        {
          id: 'cell-data-type',
          selectedCells: this.args.selectedCells,
          dataType: this.args.dataType

        });
    }
    return undefined;
  }

  private createChanges(): TableChanges {
    const tableChanges: TableChanges = {
      id: this.args.id,
      changes: [this.cellValueChange],
      undoChanges: {
        changes: [this.cellValueUndoChange],
      },
    };
    if (this.dataTypeChangesBuilder) {
      tableChanges.changes.push(this.dataTypeChangesBuilder.dataTypeChange);
      tableChanges.undoChanges?.changes.push(this.dataTypeChangesBuilder.dataTypeUndoChange);
    }
    return tableChanges;
  }

  private prepareUpdatableCells(): void {
    for (const cellRange of this.args.selectedCells) {
      cellRange.forEachCell((rowId: number, colId: number): void => {
        const oldValue: Value | undefined = this.table.getCellValue(rowId, colId);
        if (oldValue !== this.args.value) this.updatableCells.addCell(rowId, colId);
      });
    }
  }

  private updateCellValues(): void {
    this.cellValueChange.items.push({
      cellRanges: createDto4CellRangeList(this.updatableCells.getRanges()),
      value: this.args.value,
    });
  }

  private undoCellValues(): void {
    const undoValues: CellRangeAddressObjects<Value | undefined> =
      new CellRangeAddressObjects();
    for (const item of this.cellValueChange.items) {
      for (const cellRangeDto of item.cellRanges) {
        createCellRange4Dto(cellRangeDto).forEachCell(
          (rowId: number, colId: number): void => {
            const value: Value | undefined = this.table.getCellValue(rowId, colId);
            undoValues.set(value, rowId, colId);
          }
        );
      }
    }
    undoValues.forEach(
      (value: Value | undefined, address: CellRange[]): void => {
        this.cellValueUndoChange.items.push({
          cellRanges: createDto4CellRangeList(address),
          value
        });
      }
    );
  }
}

export class CellValueChangesFactory implements TableChangesFactory {
  public createTableChanges(
    table: Table,
    args: CellValueArgs
  ): TableChanges | Promise<TableChanges> {
    return new CellValueChangesBuilder(table, args).build();
  }
}

import {
  Table,
  CellRange,
  Value,
  createCellRange4Dto,
  createDto4CellRangeList,
  CellRangeList,
} from 'fittable-core/model';
import {
  TableChanges,
  TableChangesFactory,
  Args,
} from 'fittable-core/operations';

import { CellRangeAddressObjects } from '../../utils/cell/cell-range-address-objects.js';
import { CellValueChange } from '../../table-change-writter/cell/cell-value-change-writter.js';

export type CellValueArgs = Args<'cell-value'> & {
  selectedCells: CellRange[];
  value?: Value;
};

export class CellValueChangesBuilder {
  public readonly cellValueChange: CellValueChange = {
    id: 'cell-value',
    values: [],
  };
  public readonly cellValueUndoChange: CellValueChange = {
    id: 'cell-value',
    values: [],
  };
  private readonly changes: TableChanges;
  private readonly updatableCells: CellRangeList = new CellRangeList();

  constructor(
    private readonly table: Table,
    private readonly args: CellValueArgs
  ) {
    this.changes = {
      id: args.id,
      changes: [this.cellValueChange],
      undoChanges: {
        changes: [this.cellValueUndoChange],
      },
    };
  }

  public build(): TableChanges {
    this.prepareUpdatableCells();
    this.updateCellValues();
    this.undoCellValues();
    return this.changes;
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
    this.cellValueChange.values.push({
      cellRanges: createDto4CellRangeList(this.updatableCells.getRanges()),
      value: this.args.value,
    });
  }

  private undoCellValues(): void {
    const undoValues: CellRangeAddressObjects<Value | undefined> =
      new CellRangeAddressObjects();
    for (const values of this.cellValueChange.values) {
      for (const cellRangeDto of values.cellRanges) {
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
        this.cellValueUndoChange.values.push({
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

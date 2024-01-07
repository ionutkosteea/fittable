import { Table, CellRange, Value } from 'fittable-core/model';

import { CellValueChange } from '../../table-change-writter/cell/cell-value-change-writter.js';
import {
  CellValueChangesBuilder,
  CellValueArgs,
} from '../../table-changes/cell/cell-value-changes.js';

import { CellRangeAddressObjects } from './cell-range-address-objects.js';

export class CellValueChangesVisitor {
  public static of(
    table: Table,
    newValues: CellRangeAddressObjects<Value | undefined>
  ): CellValueChangesVisitor {
    return new CellValueChangesVisitor(table, newValues);
  }

  private constructor(
    private readonly table: Table,
    private readonly newValues: CellRangeAddressObjects<Value | undefined>
  ) {}

  public visit(
    callbackFn: (
      valueChange: CellValueChange,
      valueUndoChange: CellValueChange
    ) => void
  ): void {
    for (const value of this.newValues.getAllObjects()) {
      const builder: CellValueChangesBuilder =
        this.buildCellValueTableChangesBuilder(value);
      callbackFn(builder.cellValueChange, builder.cellValueUndoChange);
    }
  }

  private buildCellValueTableChangesBuilder(
    value?: Value
  ): CellValueChangesBuilder {
    const address: CellRange[] = this.newValues.getAddress(value) ?? [];
    const args: CellValueArgs = {
      id: 'cell-value',
      selectedCells: address,
      value,
    };
    const builder: CellValueChangesBuilder = new CellValueChangesBuilder(
      this.table,
      args
    );
    builder.build();
    return builder;
  }
}

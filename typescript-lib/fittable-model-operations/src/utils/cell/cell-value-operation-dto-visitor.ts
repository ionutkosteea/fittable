import { Table, CellRange, Value } from 'fittable-core/model';

import { CellValueOperationStepDto } from '../../operation-steps/cell/cell-value-operation-step.js';
import {
  CellValueOperationDtoBuilder,
  CellValueOperationDtoArgs,
} from '../../operation-dtos/cell/cell-value-operation-dto.js';

import { CellRangeAddressObjects } from './cell-range-address-objects.js';

export class CellValueOperationDtoVisitor {
  public static of(
    table: Table,
    newValues: CellRangeAddressObjects<Value | undefined>
  ): CellValueOperationDtoVisitor {
    return new CellValueOperationDtoVisitor(table, newValues);
  }

  private constructor(
    private readonly table: Table,
    private readonly newValues: CellRangeAddressObjects<Value | undefined>
  ) {}

  public visit(
    callbackFn: (
      valueStepDto: CellValueOperationStepDto,
      undoValueStepDto: CellValueOperationStepDto
    ) => void
  ): void {
    for (const value of this.newValues.getAllObjects()) {
      const builder: CellValueOperationDtoBuilder =
        this.buildCellValueOperationDtoBuilder(value);
      callbackFn(builder.cellValueStepDto, builder.undoCellValueStepDto);
    }
  }

  private buildCellValueOperationDtoBuilder(
    value?: Value
  ): CellValueOperationDtoBuilder {
    const address: CellRange[] = this.newValues.getAddress(value) ?? [];
    const args: CellValueOperationDtoArgs = {
      id: 'cell-value',
      selectedCells: address,
      value,
    };
    const builder: CellValueOperationDtoBuilder =
      new CellValueOperationDtoBuilder(this.table, args);
    builder.build();
    return builder;
  }
}

import {
  Table,
  CellRange,
  Value,
  createCellRange4Dto,
  createDto4CellRangeList,
  CellRangeList,
} from 'fittable-core/model/index.js';
import {
  OperationDto,
  OperationDtoFactory,
  OperationId,
} from 'fittable-core/operations/index.js';

import { CellRangeAddressObjects } from '../../utils/cell/cell-range-address-objects.js';
import { CellValueOperationStepDto } from '../../operation-steps/cell/cell-value-operation-step.js';

export type CellValueOperationDtoArgs = OperationId<'cell-value'> & {
  selectedCells: CellRange[];
  value?: Value;
};

export class CellValueOperationDtoBuilder {
  public readonly cellValueStepDto: CellValueOperationStepDto = {
    id: 'cell-value',
    values: [],
  };
  public readonly undoCellValueStepDto: CellValueOperationStepDto = {
    id: 'cell-value',
    values: [],
  };
  private readonly operationDto: OperationDto;

  constructor(
    private readonly table: Table,
    private readonly args: CellValueOperationDtoArgs
  ) {
    this.operationDto = {
      id: args.id,
      steps: [this.cellValueStepDto],
      undoOperation: {
        steps: [this.undoCellValueStepDto],
      },
    };
  }

  public build(): OperationDto {
    this.updateCellValues();
    this.undoCellValues();
    return this.operationDto;
  }

  private updateCellValues(): void {
    const updatableCells: CellRangeList = new CellRangeList();
    for (const cellRange of this.args.selectedCells) {
      cellRange.forEachCell((rowId: number, colId: number): void => {
        const oldValue: Value | undefined = //
          this.table.getCellValue(rowId, colId);
        if (oldValue !== this.args.value) updatableCells.addCell(rowId, colId);
      });
    }
    this.cellValueStepDto.values.push({
      cellRanges: createDto4CellRangeList(updatableCells.getRanges()),
      value: this.args.value,
    });
  }

  private undoCellValues(): void {
    const undoValues: CellRangeAddressObjects<Value | undefined> =
      new CellRangeAddressObjects();
    for (const values of this.cellValueStepDto.values) {
      for (const cellRangeDto of values.cellRanges)
        createCellRange4Dto(cellRangeDto).forEachCell(
          (rowId: number, colId: number): void => {
            undoValues.set(this.table.getCellValue(rowId, colId), rowId, colId);
          }
        );
    }
    undoValues.forEach(
      (value: Value | undefined, address: CellRange[]): void => {
        this.undoCellValueStepDto.values.push({
          cellRanges: createDto4CellRangeList(address),
          value,
        });
      }
    );
  }
}

export class CellValueOperationDtoFactory implements OperationDtoFactory {
  public createOperationDto(
    table: Table,
    args: CellValueOperationDtoArgs
  ): OperationDto | Promise<OperationDto> {
    return new CellValueOperationDtoBuilder(table, args).build();
  }
}

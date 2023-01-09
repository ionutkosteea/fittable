import {
  Table,
  CellRange,
  Value,
  Cell,
  createCellRange4Dto,
  createDto4CellRangeList,
  CellRangeList,
} from 'fit-core/model/index.js';
import {
  OperationDto,
  OperationDtoFactory,
  Id,
} from 'fit-core/operations/index.js';

import { CellRangeAddressObjects } from '../../utils/cell/cell-range-address-objects.js';
import { CellValueOperationStepDto } from '../../operation-steps/cell/cell-value-operation-step.js';

export type CellValueOperationDtoArgs = Id<'cell-value'> & {
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
      cellRange.forEachCell((rowId: number, colId: number) => {
        const cell: Cell | undefined = this.table.getCell(rowId, colId);
        const oldValue: Value | undefined = cell?.getValue();
        if (oldValue !== this.args.value) updatableCells.addCell(rowId, colId);
      });
    }
    this.cellValueStepDto.values.push({
      updatableCellRanges: createDto4CellRangeList(updatableCells.getRanges()),
      value: this.args.value,
    });
  }

  private undoCellValues(): void {
    const undoValues: CellRangeAddressObjects<Value | undefined> =
      new CellRangeAddressObjects();
    for (const values of this.cellValueStepDto.values) {
      for (const cellRangeDto of values.updatableCellRanges)
        createCellRange4Dto(cellRangeDto).forEachCell(
          (rowId: number, colId: number) => {
            const cell: Cell | undefined = this.table.getCell(rowId, colId);
            undoValues.set(cell?.getValue(), rowId, colId);
          }
        );
    }
    undoValues.forEach((value: Value | undefined, address: CellRange[]) => {
      this.undoCellValueStepDto.values.push({
        updatableCellRanges: createDto4CellRangeList(address),
        value,
      });
    });
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

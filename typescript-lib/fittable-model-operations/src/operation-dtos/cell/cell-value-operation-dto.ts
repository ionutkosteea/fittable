import {
  Table,
  CellRange,
  Value,
  createCellRange4Dto,
  createDto4CellRangeList,
  CellRangeList,
  DataType,
  asTableCellDataType,
  TableCellDataType,
} from 'fittable-core/model';
import {
  OperationDto,
  OperationDtoFactory,
  OperationId,
} from 'fittable-core/operations';

import { CellRangeAddressObjects } from '../../utils/cell/cell-range-address-objects.js';
import { CellValueOperationStepDto } from '../../operation-steps/cell/cell-value-operation-step.js';

export type CellValueOperationDtoArgs = OperationId<'cell-value'> & {
  selectedCells: CellRange[];
  value?: Value;
  dataType?: DataType;
};
type ValueAndDataType = {
  value?: Value;
  dataType?: DataType;
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
  private readonly dataTypeTable?: Table & TableCellDataType;
  private readonly updatableCells: CellRangeList = new CellRangeList();

  constructor(
    private readonly table: Table,
    private readonly args: CellValueOperationDtoArgs
  ) {
    this.dataTypeTable = asTableCellDataType(table);
    this.operationDto = {
      id: args.id,
      steps: [this.cellValueStepDto],
      undoOperation: {
        steps: [this.undoCellValueStepDto],
      },
    };
  }

  public build(): OperationDto {
    this.prepareUpdatableCells();
    this.updateCellValues();
    this.undoCellValues();
    return this.operationDto;
  }

  private prepareUpdatableCells(): void {
    for (const cellRange of this.args.selectedCells) {
      cellRange.forEachCell((rowId: number, colId: number): void => {
        const oldValue: Value | undefined = //
          this.table.getCellValue(rowId, colId);
        if (oldValue !== this.args.value) {
          this.updatableCells.addCell(rowId, colId);
        }
      });
    }
  }

  private updateCellValues(): void {
    this.cellValueStepDto.values.push({
      cellRanges: createDto4CellRangeList(this.updatableCells.getRanges()),
      value: this.args.value,
      dataType: this.args.dataType,
    });
  }

  private undoCellValues(): void {
    const undoValues: CellRangeAddressObjects<ValueAndDataType | undefined> =
      new CellRangeAddressObjects();
    for (const values of this.cellValueStepDto.values) {
      for (const cellRangeDto of values.cellRanges)
        createCellRange4Dto(cellRangeDto).forEachCell(
          (rowId: number, colId: number): void => {
            const value: Value | undefined = //
              this.table.getCellValue(rowId, colId);
            const dataType: DataType | undefined = //
              this.dataTypeTable?.getCellDataType(rowId, colId);
            undoValues.set({ value, dataType }, rowId, colId);
          }
        );
    }
    undoValues.forEach(
      (vdt: ValueAndDataType | undefined, address: CellRange[]): void => {
        this.undoCellValueStepDto.values.push({
          cellRanges: createDto4CellRangeList(address),
          value: vdt?.value,
          dataType: vdt?.dataType,
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

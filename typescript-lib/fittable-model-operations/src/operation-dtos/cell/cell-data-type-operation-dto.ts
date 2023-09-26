import {
  Table,
  CellRange,
  DataType,
  createCellRange4Dto,
  createDto4CellRangeList,
  CellRangeList,
  TableCellDataType,
} from 'fittable-core/model';
import {
  OperationDto,
  OperationDtoFactory,
  OperationId,
} from 'fittable-core/operations';

import { CellRangeAddressObjects } from '../../utils/cell/cell-range-address-objects.js';
import { CellDataTypeOperationStepDto } from '../../operation-steps/cell/cell-data-type-operation-step.js';

export type CellDataTypeOperationDtoArgs = OperationId<'cell-data-type'> & {
  selectedCells: CellRange[];
  dataType?: DataType;
};

export class CellDataTypeOperationDtoBuilder {
  public readonly dataTypeStepDto: CellDataTypeOperationStepDto = {
    id: 'cell-data-type',
    dataTypes: [],
  };
  public readonly undoDataTypeStepDto: CellDataTypeOperationStepDto = {
    id: 'cell-data-type',
    dataTypes: [],
  };
  private readonly operationDto: OperationDto;
  private readonly updatableCells: CellRangeList = new CellRangeList();

  constructor(
    private readonly table: Table & TableCellDataType,
    private readonly args: CellDataTypeOperationDtoArgs
  ) {
    this.operationDto = {
      id: args.id,
      steps: [this.dataTypeStepDto],
      undoOperation: {
        steps: [this.undoDataTypeStepDto],
      },
    };
  }

  public build(): OperationDto {
    this.prepareUpdatableCells();
    this.updateCellDataTypes();
    this.undoCellDataTypes();
    return this.operationDto;
  }

  private prepareUpdatableCells(): void {
    for (const cellRange of this.args.selectedCells) {
      cellRange.forEachCell((rowId: number, colId: number): void => {
        const oldDataType: DataType | undefined = //
          this.table.getCellDataType(rowId, colId);
        const equalDataTypes: boolean =
          JSON.stringify(oldDataType) === JSON.stringify(this.args.dataType);
        !equalDataTypes && this.updatableCells.addCell(rowId, colId);
      });
    }
  }

  private updateCellDataTypes(): void {
    this.dataTypeStepDto.dataTypes.push({
      cellRanges: createDto4CellRangeList(this.updatableCells.getRanges()),
      dataType: this.args.dataType,
    });
  }

  private undoCellDataTypes(): void {
    const undoDataTypes: CellRangeAddressObjects<DataType | undefined> =
      new CellRangeAddressObjects();
    for (const dataTypes of this.dataTypeStepDto.dataTypes) {
      for (const cellRangeDto of dataTypes.cellRanges)
        createCellRange4Dto(cellRangeDto).forEachCell(
          (rowId: number, colId: number): void => {
            undoDataTypes.set(
              this.table.getCellDataType(rowId, colId),
              rowId,
              colId
            );
          }
        );
    }
    undoDataTypes.forEach(
      (dataType: DataType | undefined, address: CellRange[]): void => {
        this.undoDataTypeStepDto.dataTypes.push({
          cellRanges: createDto4CellRangeList(address),
          dataType,
        });
      }
    );
  }
}

export class CellDataTypeOperationDtoFactory implements OperationDtoFactory {
  public createOperationDto(
    table: Table & TableCellDataType,
    args: CellDataTypeOperationDtoArgs
  ): OperationDto | Promise<OperationDto> {
    return new CellDataTypeOperationDtoBuilder(table, args).build();
  }
}

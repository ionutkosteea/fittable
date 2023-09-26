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
  TableCellDataType,
  asTableCellDataType,
} from 'fittable-core/model';
import {
  OperationDto,
  OperationDtoFactory,
  OperationId,
} from 'fittable-core/operations';

import {
  countAllCellStyleNames,
  countSelectedCellStyleNames,
} from '../../utils/style/style-functions.js';
import { CellRangeAddressObjects } from '../../utils/cell/cell-range-address-objects.js';
import { CellValueOperationStepDto } from '../../operation-steps/cell/cell-value-operation-step.js';
import { StyleOperationStepDto } from '../../operation-steps/style/style-operation-step.js';
import { CellRemoveOperationStepDto } from '../../operation-steps/cell/cell-remove-operation-step.js';
import { CellDataTypeOperationStepDto } from '../../operation-steps/cell/cell-data-type-operation-step.js';

export type CellRemoveOperationDtoArgs = OperationId<'cell-remove'> & {
  selectedCells: CellRange[];
};

export class CellRemoveOperationDtoBuilder {
  private readonly styledTable?: Table & TableStyles;

  public readonly cellRemoveStepDto: CellRemoveOperationStepDto = {
    id: 'cell-remove',
    cellRanges: [],
  };
  public readonly styleStepDto: StyleOperationStepDto = {
    id: 'style-changes',
    createStyles: [],
    updateStyles: [],
    removeStyles: [],
    cellStyleNames: [],
  };
  public readonly undoCellValueStepDto: CellValueOperationStepDto = {
    id: 'cell-value',
    values: [],
  };
  public readonly undoCellDataTypesStepDto: CellDataTypeOperationStepDto = {
    id: 'cell-data-type',
    dataTypes: [],
  };
  public readonly undoStyleStepDto: StyleOperationStepDto = {
    id: 'style-changes',
    createStyles: [],
    updateStyles: [],
    removeStyles: [],
    cellStyleNames: [],
  };
  private readonly operationDto: OperationDto;

  constructor(
    private readonly table: Table,
    private readonly args: CellRemoveOperationDtoArgs
  ) {
    this.styledTable = asTableStyles(table);
    this.operationDto = {
      id: args.id,
      steps: [this.cellRemoveStepDto, this.styleStepDto],
      undoOperation: {
        steps: [
          this.undoCellValueStepDto,
          this.undoCellDataTypesStepDto,
          this.undoStyleStepDto,
        ],
      },
    };
  }

  public build(): OperationDto {
    this.removeCells();
    this.undoCellValues();
    this.undoCellDataTypes();
    if (this.styledTable) {
      this.undoStyleNames();
      this.removeStyles();
      this.undoRemoveStyles();
    }
    return this.operationDto;
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
      this.cellRemoveStepDto.cellRanges.push(cellRange.getDto());
    });
  }

  private undoCellValues(): void {
    const oldValues: CellRangeAddressObjects<Value | undefined> =
      new CellRangeAddressObjects();
    for (const cellRangeDto of this.cellRemoveStepDto.cellRanges) {
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
        this.undoCellValueStepDto.values.push({
          value,
          cellRanges: createDto4CellRangeList(address),
        });
      }
    );
  }

  private undoCellDataTypes(): void {
    const dataTypeTable: TableCellDataType | undefined = //
      asTableCellDataType(this.table);
    if (!dataTypeTable) return;
    const oldDataTypes: CellRangeAddressObjects<DataType | undefined> =
      new CellRangeAddressObjects();
    for (const cellRangeDto of this.cellRemoveStepDto.cellRanges) {
      createCellRange4Dto(cellRangeDto).forEachCell(
        (rowId: number, colId: number): void => {
          const dataType: DataType | undefined = //
            dataTypeTable.getCellDataType(rowId, colId);
          dataType && oldDataTypes.set(dataType, rowId, colId);
        }
      );
    }
    oldDataTypes.forEach(
      (dataType: DataType | undefined, address: CellRange[]): void => {
        this.undoCellDataTypesStepDto.dataTypes.push({
          dataType,
          cellRanges: createDto4CellRangeList(address),
        });
      }
    );
  }

  private undoStyleNames(): void {
    const oldStyleNames: CellRangeAddressObjects<string | undefined> =
      new CellRangeAddressObjects();
    for (const cellRangeDto of this.cellRemoveStepDto.cellRanges) {
      createCellRange4Dto(cellRangeDto).forEachCell(
        (rowId: number, colId: number) => {
          const styleName: string | undefined = //
            this.styledTable?.getCellStyleName(rowId, colId);
          if (styleName) {
            oldStyleNames.set(styleName, rowId, colId);
          }
        }
      );
    }
    oldStyleNames.forEach(
      (styleName: string | undefined, address: CellRange[]) => {
        const cellRanges: unknown[] = createDto4CellRangeList(address);
        this.undoStyleStepDto.cellStyleNames.push({ cellRanges, styleName });
      }
    );
  }

  private removeStyles(): void {
    const styleTable: Table & TableStyles = this.getStyledTable();
    const allCellsCnt: Map<string, number> = countAllCellStyleNames(styleTable);
    const selectedCellsCnt: Map<string, number> = countSelectedCellStyleNames(
      styleTable,
      createCellRangeList4Dto(this.cellRemoveStepDto.cellRanges)
    );
    selectedCellsCnt.forEach(
      (numOfSelectedCells: number, styleName?: string) => {
        if (styleName) {
          const numOfAllCells: number | undefined = allCellsCnt.get(styleName);
          if (numOfSelectedCells >= (numOfAllCells ?? 0)) {
            this.styleStepDto.removeStyles.push(styleName);
          }
        }
      }
    );
  }

  private getStyledTable(): Table & TableStyles {
    return this.table as Table & TableStyles;
  }

  private undoRemoveStyles(): void {
    this.styleStepDto.removeStyles.forEach((styleName: string) => {
      const styleTable: Table & TableStyles = this.getStyledTable();
      const style: Style | undefined = styleTable.getStyle(styleName);
      style &&
        this.undoStyleStepDto.createStyles.push({
          styleName,
          style: style.getDto(),
        });
    });
  }
}

export class CellRemoveOperationDtoFactory implements OperationDtoFactory {
  public createOperationDto(
    table: Table,
    args: CellRemoveOperationDtoArgs
  ): OperationDto {
    return new CellRemoveOperationDtoBuilder(table, args).build();
  }
}

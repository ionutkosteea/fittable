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
} from 'fit-core/model/index.js';
import {
  OperationDto,
  OperationDtoFactory,
  OperationId,
} from 'fit-core/operations/index.js';

import {
  countAllCellStyleNames,
  countSelectedCellStyleNames,
} from '../../utils/style/style-functions.js';
import { CellRangeAddressObjects } from '../../utils/cell/cell-range-address-objects.js';
import { CellValueOperationStepDto } from '../../operation-steps/cell/cell-value-operation-step.js';
import { StyleOperationStepDto } from '../../operation-steps/style/style-operation-step.js';
import { CellRemoveOperationStepDto } from '../../operation-steps/cell/cell-remove-operation-step.js';

export type CellRemoveOperationDtoArgs = OperationId<'cell-remove'> & {
  selectedCells: CellRange[];
};

export class CellRemoveOperationDtoBuilder {
  private readonly styledTable?: Table & TableStyles;

  public readonly cellRemoveStepDto: CellRemoveOperationStepDto = {
    id: 'cell-remove',
    removableCellRanges: [],
  };
  public readonly styleStepDto: StyleOperationStepDto = {
    id: 'style',
    createStyles: [],
    updateStyles: [],
    removeStyles: [],
    cellStyleNames: [],
  };
  public readonly undoCellValueStepDto: CellValueOperationStepDto = {
    id: 'cell-value',
    values: [],
  };
  public readonly undoStyleStepDto: StyleOperationStepDto = {
    id: 'style',
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
        steps: [this.undoCellValueStepDto, this.undoStyleStepDto],
      },
    };
  }

  public build(): OperationDto {
    this.removeCells();
    this.undoCellValues();
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
      this.cellRemoveStepDto.removableCellRanges.push(cellRange.getDto());
    });
  }

  private undoCellValues(): void {
    const oldValues: CellRangeAddressObjects<Value | undefined> =
      new CellRangeAddressObjects();
    for (const cellRangeDto of this.cellRemoveStepDto.removableCellRanges) {
      createCellRange4Dto(cellRangeDto).forEachCell(
        (rowId: number, colId: number): void => {
          const value: Value | undefined = //
            this.table.getCellValue(rowId, colId);
          value && oldValues.set(value, rowId, colId);
        }
      );
    }
    oldValues.forEach((value: Value | undefined, address: CellRange[]) => {
      this.undoCellValueStepDto.values.push({
        value,
        updatableCellRanges: createDto4CellRangeList(address),
      });
    });
  }

  private undoStyleNames(): void {
    const oldStyleNames: CellRangeAddressObjects<string | undefined> =
      new CellRangeAddressObjects();
    for (const cellRangeDto of this.cellRemoveStepDto.removableCellRanges) {
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
        const updatableCellRanges: unknown[] = createDto4CellRangeList(address);
        this.undoStyleStepDto.cellStyleNames.push({
          updatableCellRanges,
          styleName,
        });
      }
    );
  }

  private removeStyles(): void {
    const styleTable: Table & TableStyles = this.getStyledTable();
    const allCellsCnt: Map<string, number> = countAllCellStyleNames(styleTable);
    const selectedCellsCnt: Map<string, number> = countSelectedCellStyleNames(
      styleTable,
      createCellRangeList4Dto(this.cellRemoveStepDto.removableCellRanges)
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

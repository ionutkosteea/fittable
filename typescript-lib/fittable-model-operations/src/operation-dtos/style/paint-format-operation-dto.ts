import {
  Table,
  CellRange,
  TableStyles,
  Style,
  createDto4CellRangeList,
  TableCellDataType,
  asTableCellDataType,
  asTableStyles,
  DataType,
} from 'fittable-core/model';
import {
  OperationDto,
  OperationDtoFactory,
  OperationId,
} from 'fittable-core/operations';

import { CellRangeAddressObjects } from '../../utils/cell/cell-range-address-objects.js';
import { countAllCellStyleNames } from '../../utils/style/style-functions.js';
import { StyleOperationStepDto } from '../../operation-steps/style/style-operation-step.js';
import { CellDataTypeOperationStepDto } from '../../operation-steps/cell/cell-data-type-operation-step.js';
import {
  CellDataTypeOperationDtoArgs,
  CellDataTypeOperationDtoBuilder,
} from '../cell/cell-data-type-operation-dto.js';

export type PaintFormatOperationDtoArgs = OperationId<'paint-format'> & {
  selectedCells: CellRange[];
  styleName?: string;
  dataType?: DataType;
};

export class PaintFormatOperationDtoBuilder {
  public readonly styleStepDto: StyleOperationStepDto = {
    id: 'style-changes',
    createStyles: [],
    updateStyles: [],
    removeStyles: [],
    cellStyleNames: [],
  };
  public readonly dataTypeStepDto: CellDataTypeOperationStepDto = {
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
  public readonly undoDataTypeStepDto: CellDataTypeOperationStepDto = {
    id: 'cell-data-type',
    dataTypes: [],
  };
  private readonly operationDto: OperationDto;
  private styledTable?: Table & TableStyles;
  private dataTypeTable?: Table & TableCellDataType;
  private oldStyleNames: CellRangeAddressObjects<string | undefined>;

  constructor(
    private readonly table: Table,
    private readonly args: PaintFormatOperationDtoArgs
  ) {
    this.styledTable = asTableStyles(this.table);
    this.dataTypeTable = asTableCellDataType(this.table);
    this.operationDto = {
      id: this.args.id,
      steps: [this.styleStepDto, this.dataTypeStepDto],
      undoOperation: {
        steps: [this.undoStyleStepDto, this.undoDataTypeStepDto],
      },
    };
    this.oldStyleNames = new CellRangeAddressObjects();
  }

  public build(): OperationDto {
    this.updateStyles();
    this.updateDataTypes();
    return this.operationDto;
  }

  private updateStyles(): void {
    if (!this.styledTable) return;
    this.markOldStyleNames();
    this.updateCellStyleNames();
    this.removeStyles();
  }

  private markOldStyleNames(): void {
    for (const cellRange of this.args.selectedCells) {
      cellRange.forEachCell((rowId: number, colId: number): void => {
        const oldStyleName: string | undefined = //
          this.styledTable?.getCellStyleName(rowId, colId);
        oldStyleName !== this.args.styleName &&
          this.oldStyleNames.set(oldStyleName, rowId, colId);
      });
    }
  }

  private updateCellStyleNames(): void {
    const cellRanges: CellRange[] = this.oldStyleNames.getAllAddresses();
    this.styleStepDto.cellStyleNames.push({
      cellRanges: createDto4CellRangeList(cellRanges),
      styleName: this.args.styleName,
    });
    this.oldStyleNames.forEach(
      (styleName: string | undefined, address: CellRange[]) => {
        this.undoStyleStepDto.cellStyleNames.push({
          cellRanges: createDto4CellRangeList(address),
          styleName,
        });
      }
    );
  }

  private removeStyles(): void {
    if (!this.styledTable) return;
    const allCellsCnt: Map<string, number> = //
      countAllCellStyleNames(this.styledTable);
    for (const styleName of this.oldStyleNames.getAllObjects()) {
      if (!styleName) continue;
      const updatableCells: CellRange[] =
        this.oldStyleNames.getAddress(styleName) ?? [];
      const numOfUndoCells: number =
        this.calculateNumberOfCells(updatableCells);
      const numOfAllCells: number | undefined = allCellsCnt.get(styleName);
      if (numOfUndoCells < (numOfAllCells ?? 0)) return;
      this.styleStepDto.removeStyles.push(styleName);
      const style: Style | undefined = this.styledTable.getStyle(styleName);
      if (!style) return;
      this.undoStyleStepDto.createStyles //
        .push({ styleName, style: style.getDto() });
    }
  }

  private calculateNumberOfCells(cellRanges: CellRange[]): number {
    let numberOfCells = 0;
    cellRanges.forEach((cellRange: CellRange) => {
      numberOfCells += this.calculateNumberOfExistingCells(cellRange);
    });
    return numberOfCells;
  }

  private calculateNumberOfExistingCells(cellRange: CellRange): number {
    let numberOfCells = 0;
    cellRange.forEachCell((rowId: number, colId: number): void => {
      this.table.hasCell(rowId, colId) && numberOfCells++;
    });
    return numberOfCells;
  }

  private updateDataTypes(): void {
    if (!this.dataTypeTable) return;
    const args: CellDataTypeOperationDtoArgs = {
      id: 'cell-data-type',
      selectedCells: this.args.selectedCells,
      dataType: this.args.dataType,
    };
    const builder: CellDataTypeOperationDtoBuilder = //
      new CellDataTypeOperationDtoBuilder(this.dataTypeTable, args);
    builder.build();
    this.dataTypeStepDto.dataTypes = builder.dataTypeStepDto.dataTypes;
    this.undoDataTypeStepDto.dataTypes = builder.undoDataTypeStepDto.dataTypes;
  }
}

export class PaintFormatOperationDtoFactory implements OperationDtoFactory {
  public createOperationDto(
    table: Table & TableStyles,
    args: PaintFormatOperationDtoArgs
  ): OperationDto | Promise<OperationDto> {
    return new PaintFormatOperationDtoBuilder(table, args).build();
  }
}

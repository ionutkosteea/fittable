import {
  Table,
  TableRows,
  TableColumns,
  LineRange,
  createDto4LineRangeList,
  createLineRange,
  asColumnWidth,
  asRowHeight,
} from 'fit-core/model/index.js';
import {
  OperationDto,
  Id,
  OperationDtoFactory,
} from 'fit-core/operations/index.js';

import { LineRangeAddressObjects } from '../../utils/line/line-range-address-objects.js';
import {
  DimensionDto,
  RowHeightOperationStepDto,
  ColumnWidthOperationStepDto,
} from '../../operation-steps/line/line-dimension-operation-step.js';

export type LineDimensionOperationDtoArgs = {
  selectedLines: LineRange[];
  dimension?: number;
};

abstract class LineDimensionOperationDtoBuilder {
  protected readonly dimensionsDto: DimensionDto[] = [];
  protected readonly undoDimensionsDto: DimensionDto[] = [];

  private readonly oldLineDimensions: LineRangeAddressObjects<
    number | undefined
  >;
  private isUndoable = true;

  constructor(
    protected readonly table: Table,
    protected readonly args: LineDimensionOperationDtoArgs
  ) {
    this.oldLineDimensions = new LineRangeAddressObjects();
  }

  protected abstract getLineDimension(lineId: number): number | undefined;

  public setUndoable(isUndoable: boolean): this {
    this.isUndoable = isUndoable;
    return this;
  }

  public build(): void {
    if (this.args.dimension && this.args.dimension <= 0) {
      throw new Error('Size must be greater than 0!');
    }
    this.markOldLineDimensions();
    this.updateLineDimensions();
    this.isUndoable && this.undoLineDimensions();
  }

  private markOldLineDimensions(): void {
    for (const lineRange of this.args.selectedLines) {
      lineRange.forEachLine((lineId: number) => {
        const lineDimension: number | undefined = this.getLineDimension(lineId);
        if (lineDimension !== this.args.dimension) {
          this.oldLineDimensions.set(lineDimension, createLineRange(lineId));
        }
      });
    }
  }

  private updateLineDimensions(): void {
    const lineRanges: LineRange[] = this.oldLineDimensions.getAllAddresses();
    this.dimensionsDto.push({
      updatableLineRanges: createDto4LineRangeList(lineRanges),
      dimension: this.args.dimension,
    });
  }

  private undoLineDimensions(): void {
    this.oldLineDimensions.forEach(
      (dimension: number | undefined, lineRanges?: LineRange[]) => {
        lineRanges &&
          this.undoDimensionsDto.push({
            dimension,
            updatableLineRanges: createDto4LineRangeList(lineRanges),
          });
      }
    );
  }
}

export type RowHeightOperationDtoArgs = Id<'row-height'> &
  LineDimensionOperationDtoArgs;

export class RowHeightOperationDtoBuilder extends LineDimensionOperationDtoBuilder {
  public readonly rowHeightStepDto: RowHeightOperationStepDto = {
    id: 'row-height',
    dimensions: this.dimensionsDto,
  };
  public readonly undoRowHeightStepDto: RowHeightOperationStepDto = {
    id: 'row-height',
    dimensions: this.undoDimensionsDto,
  };

  constructor(
    protected readonly table: Table & TableRows,
    protected readonly args: RowHeightOperationDtoArgs
  ) {
    super(table, args);
  }

  protected getLineDimension(rowId: number): number | undefined {
    return asRowHeight(this.table.getRow(rowId))?.getHeight();
  }

  public build(): OperationDto {
    super.build();
    return {
      id: this.args.id,
      steps: [this.rowHeightStepDto],
      undoOperation: { steps: [this.undoRowHeightStepDto] },
    };
  }
}

export class RowHeightOperationDtoFactory implements OperationDtoFactory {
  public createOperationDto(
    table: Table & TableRows,
    args: RowHeightOperationDtoArgs
  ): OperationDto | Promise<OperationDto> {
    return new RowHeightOperationDtoBuilder(table, args).build();
  }
}

export type ColumnWidthOperationDtoArgs = Id<'column-width'> &
  LineDimensionOperationDtoArgs;

export class ColumnWidthOperationDtoBuilder extends LineDimensionOperationDtoBuilder {
  public readonly columnWidthStepDto: ColumnWidthOperationStepDto = {
    id: 'column-width',
    dimensions: this.dimensionsDto,
  };
  public readonly undoColumnWidthStepDto: ColumnWidthOperationStepDto = {
    id: 'column-width',
    dimensions: this.undoDimensionsDto,
  };

  constructor(
    protected table: Table & TableColumns,
    protected args: ColumnWidthOperationDtoArgs
  ) {
    super(table, args);
  }

  protected getLineDimension(colId: number): number | undefined {
    return asColumnWidth(this.table.getColumn(colId))?.getWidth();
  }

  public build(): OperationDto {
    super.build();
    return {
      id: this.args.id,
      steps: [this.columnWidthStepDto],
      undoOperation: { steps: [this.undoColumnWidthStepDto] },
    };
  }
}

export class ColumnWidthOperationDtoFactory implements OperationDtoFactory {
  public createOperationDto(
    table: Table & TableColumns,
    args: ColumnWidthOperationDtoArgs
  ): OperationDto | Promise<OperationDto> {
    return new ColumnWidthOperationDtoBuilder(table, args).build();
  }
}

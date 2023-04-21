import {
  Table,
  TableRows,
  LineRange,
  createDto4LineRangeList,
  createLineRange,
  TableCols,
} from 'fittable-core/model/index.js';
import {
  OperationDto,
  OperationId,
  OperationDtoFactory,
} from 'fittable-core/operations/index.js';

import { LineRangeAddressObjects } from '../../utils/line/line-range-address-objects.js';
import {
  DimensionDto,
  RowHeightOperationStepDto,
  ColWidthOperationStepDto,
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
      lineRanges: createDto4LineRangeList(lineRanges),
      dimension: this.args.dimension,
    });
  }

  private undoLineDimensions(): void {
    this.oldLineDimensions.forEach(
      (dimension: number | undefined, lineRanges?: LineRange[]) => {
        lineRanges &&
          this.undoDimensionsDto.push({
            dimension,
            lineRanges: createDto4LineRangeList(lineRanges),
          });
      }
    );
  }
}

export type RowHeightOperationDtoArgs = OperationId<'row-height'> &
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
    return this.table.getRowHeight(rowId);
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

export type ColWidthOperationDtoArgs = OperationId<'column-width'> &
  LineDimensionOperationDtoArgs;

export class ColWidthOperationDtoBuilder extends LineDimensionOperationDtoBuilder {
  public readonly colWidthStepDto: ColWidthOperationStepDto = {
    id: 'column-width',
    dimensions: this.dimensionsDto,
  };
  public readonly undoColWidthStepDto: ColWidthOperationStepDto = {
    id: 'column-width',
    dimensions: this.undoDimensionsDto,
  };

  constructor(
    protected table: Table & TableCols,
    protected args: ColWidthOperationDtoArgs
  ) {
    super(table, args);
  }

  protected getLineDimension(colId: number): number | undefined {
    return this.table.getColWidth(colId);
  }

  public build(): OperationDto {
    super.build();
    return {
      id: this.args.id,
      steps: [this.colWidthStepDto],
      undoOperation: { steps: [this.undoColWidthStepDto] },
    };
  }
}

export class ColWidthOperationDtoFactory implements OperationDtoFactory {
  public createOperationDto(
    table: Table & TableCols,
    args: ColWidthOperationDtoArgs
  ): OperationDto | Promise<OperationDto> {
    return new ColWidthOperationDtoBuilder(table, args).build();
  }
}

import {
  Table,
  TableRows,
  TableCols,
  createLineRange4Dto,
} from 'fittable-core/model/index.js';
import {
  OperationStep,
  OperationStepFactory,
  OperationId,
} from 'fittable-core/operations/index.js';

export type DimensionDto = {
  lineRanges: unknown[];
  dimension?: number;
};
export type LineDimensionOperationStepDto = { dimensions: DimensionDto[] };

abstract class LineDimensionOperationStep implements OperationStep {
  constructor(
    protected readonly table: Table,
    protected readonly stepDto: LineDimensionOperationStepDto
  ) {}

  protected abstract updateDimension(
    lineId: number,
    lineDimension?: number
  ): void;

  public run(): void {
    this.updateLines();
  }

  private updateLines(): void {
    for (const dimensionDto of this.stepDto.dimensions) {
      for (const lineRangeDto of dimensionDto.lineRanges) {
        createLineRange4Dto(lineRangeDto).forEachLine(
          (lineId: number): void => {
            this.updateDimension(lineId, dimensionDto.dimension);
          }
        );
      }
    }
  }
}

export type RowHeightOperationStepDto = OperationId<'row-height'> &
  LineDimensionOperationStepDto;

export class RowHeightOperationStep extends LineDimensionOperationStep {
  constructor(
    protected readonly table: Table & TableRows,
    protected readonly stepDto: RowHeightOperationStepDto
  ) {
    super(table, stepDto);
  }

  protected updateDimension(rowId: number, height?: number): void {
    this.table.setRowHeight(rowId, height);
  }
}

export class RowHeightOperationStepFactory implements OperationStepFactory {
  public createStep(
    table: Table & TableRows,
    stepDto: RowHeightOperationStepDto
  ): OperationStep {
    return new RowHeightOperationStep(table, stepDto);
  }
}

export type ColWidthOperationStepDto = OperationId<'column-width'> &
  LineDimensionOperationStepDto;

export class ColWidthOperationStep extends LineDimensionOperationStep {
  constructor(
    protected readonly table: Table & TableCols,
    protected readonly stepDto: ColWidthOperationStepDto
  ) {
    super(table, stepDto);
  }

  protected updateDimension(colId: number, width?: number): void {
    this.table.setColWidth(colId, width);
  }
}

export class ColWidthOperationStepFactory implements OperationStepFactory {
  public createStep(
    table: Table & TableCols,
    stepDto: ColWidthOperationStepDto
  ): OperationStep {
    return new ColWidthOperationStep(table, stepDto);
  }
}

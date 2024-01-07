import {
  Table,
  TableRows,
  TableCols,
  createLineRange4Dto,
} from 'fittable-core/model';
import {
  TableChangeWritter,
  TableChangeWritterFactory,
  Args,
} from 'fittable-core/operations';

export type DimensionDto = {
  lineRanges: unknown[];
  dimension?: number;
};
export type LineDimensionChange = { dimensions: DimensionDto[] };

abstract class LineDimensionChangeWritter implements TableChangeWritter {
  constructor(
    protected readonly table: Table,
    protected readonly change: LineDimensionChange
  ) {}

  protected abstract updateDimension(
    lineId: number,
    lineDimension?: number
  ): void;

  public run(): void {
    this.updateLines();
  }

  private updateLines(): void {
    for (const dimensionDto of this.change.dimensions) {
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

export type RowHeighChange = Args<'row-height'> & LineDimensionChange;

export class RowHeightChangeWritter extends LineDimensionChangeWritter {
  constructor(
    protected readonly table: Table & TableRows,
    protected readonly change: RowHeighChange
  ) {
    super(table, change);
  }

  protected updateDimension(rowId: number, height?: number): void {
    this.table.setRowHeight(rowId, height);
  }
}

export class RowHeightChangeWritterFactory
  implements TableChangeWritterFactory
{
  public createTableChangeWritter(
    table: Table & TableRows,
    change: RowHeighChange
  ): TableChangeWritter {
    return new RowHeightChangeWritter(table, change);
  }
}

export type ColWidthChange = Args<'column-width'> & LineDimensionChange;

export class ColWidthChangeWritter extends LineDimensionChangeWritter {
  constructor(
    protected readonly table: Table & TableCols,
    protected readonly change: ColWidthChange
  ) {
    super(table, change);
  }

  protected updateDimension(colId: number, width?: number): void {
    this.table.setColWidth(colId, width);
  }
}

export class ColWidthChangeWritterFactory implements TableChangeWritterFactory {
  public createTableChangeWritter(
    table: Table & TableCols,
    change: ColWidthChange
  ): TableChangeWritter {
    return new ColWidthChangeWritter(table, change);
  }
}

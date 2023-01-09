import {
  Table,
  Row,
  Column,
  TableRows,
  TableColumns,
  createRow,
  createColumn,
  asColumnWidth,
  ColumnWidth,
  asRowHeight,
  RowHeight,
  createLineRange4Dto,
} from 'fit-core/model/index.js';
import {
  OperationStep,
  OperationStepFactory,
  Id,
} from 'fit-core/operations/index.js';

export type DimensionDto = {
  updatableLineRanges: unknown[];
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

  protected abstract removeLineIfNoProperties(lineIndex: number): void;

  public run(): void {
    this.updateLines();
  }

  private updateLines(): void {
    for (const dimensionDto of this.stepDto.dimensions) {
      for (const lineRangeDto of dimensionDto.updatableLineRanges) {
        createLineRange4Dto(lineRangeDto).forEachLine((lineId: number) => {
          this.updateDimension(lineId, dimensionDto.dimension);
          this.removeLineIfNoProperties(lineId);
        });
      }
    }
  }
}

export type RowHeightOperationStepDto = Id<'row-height'> &
  LineDimensionOperationStepDto;

export class RowHeightOperationStep extends LineDimensionOperationStep {
  constructor(
    protected readonly table: Table & TableRows,
    protected readonly stepDto: RowHeightOperationStepDto
  ) {
    super(table, stepDto);
  }

  protected updateDimension(rowId: number, height: number): void {
    const row: Row | undefined = this.table.getRow(rowId);
    if (row) {
      asRowHeight(row)?.setHeight(height);
    } else {
      const newRow: Row = createRow();
      const newRowHeight: RowHeight | undefined = asRowHeight(newRow);
      if (newRowHeight) {
        newRowHeight.setHeight(height);
        this.table.addRow(rowId, newRow);
      }
    }
  }

  protected removeLineIfNoProperties(rowId: number): void {
    let row: Row | undefined = this.table.getRow(rowId);
    if (row?.hasProperties()) return;
    this.table.removeRow(rowId, true);
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

export type ColumnWidthOperationStepDto = Id<'column-width'> &
  LineDimensionOperationStepDto;

export class ColumnWidthOperationStep extends LineDimensionOperationStep {
  constructor(
    protected readonly table: Table & TableColumns,
    protected readonly stepDto: ColumnWidthOperationStepDto
  ) {
    super(table, stepDto);
  }

  protected updateDimension(colId: number, width: number): void {
    const col: Column | undefined = this.table.getColumn(colId);
    if (col) {
      asColumnWidth(col)?.setWidth(width);
    } else {
      const newCol: Column = createColumn();
      const newColWidth: ColumnWidth | undefined = asColumnWidth(newCol);
      if (newColWidth) {
        newColWidth.setWidth(width);
        this.table.addColumn(colId, newCol);
      }
    }
  }

  protected removeLineIfNoProperties(colId: number): void {
    let column: Column | undefined = this.table.getColumn(colId);
    if (column?.hasProperties()) return;
    this.table.removeColumn(colId, true);
  }
}

export class ColumnWidthOperationStepFactory implements OperationStepFactory {
  public createStep(
    table: Table & TableColumns,
    stepDto: ColumnWidthOperationStepDto
  ): OperationStep {
    return new ColumnWidthOperationStep(table, stepDto);
  }
}

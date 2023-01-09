import {
  Table,
  TableRows,
  TableColumns,
  createLineRange4Dto,
  LineRange,
} from 'fit-core/model/index.js';
import {
  OperationStep,
  OperationStepFactory,
  Id,
} from 'fit-core/operations/index.js';

export type MovableLinesDto = { updatableLineRange: unknown; move: number };

export type LineRemoveOperationStepDto = {
  removableLineRanges: unknown[];
  movableLineRanges: MovableLinesDto[];
};

abstract class LineRemoveOperationStep implements OperationStep {
  protected numberOfSelectedLines = 0;

  constructor(
    protected readonly table: Table,
    protected readonly stepDto: LineRemoveOperationStepDto
  ) {}

  protected abstract updateNumberOfLines(): void;
  protected abstract removeLine(lineIndex: number): void;
  protected abstract moveLine(lineIndex: number, move: number): void;

  public run(): void {
    this.countSelectedLines();
    this.updateNumberOfLines();
    this.removeLines();
    this.moveLines();
  }

  private countSelectedLines(): void {
    this.numberOfSelectedLines = 0;
    for (const lineRangeDto of this.stepDto.removableLineRanges) {
      createLineRange4Dto(lineRangeDto).forEachLine(
        () => this.numberOfSelectedLines++
      );
    }
  }

  private removeLines(): void {
    for (let i = this.stepDto.removableLineRanges.length - 1; i >= 0; i--) {
      const lineRangeDto: unknown = this.stepDto.removableLineRanges[i];
      const lineRange: LineRange = createLineRange4Dto(lineRangeDto);
      for (let j = lineRange.getTo(); j >= lineRange.getFrom(); j--) {
        this.removeLine(j);
      }
    }
  }

  private moveLines(): void {
    for (const movableLine of this.stepDto.movableLineRanges) {
      createLineRange4Dto(movableLine.updatableLineRange).forEachLine(
        (lineId) => {
          this.moveLine(lineId, -1 * movableLine.move);
        }
      );
    }
  }
}

export type RowRemoveOperationStepDto = Id<'row-remove'> &
  LineRemoveOperationStepDto;

export class RowRemoveOperationStep extends LineRemoveOperationStep {
  constructor(
    protected readonly table: Table & TableRows,
    protected readonly stepDto: RowRemoveOperationStepDto
  ) {
    super(table, stepDto);
  }

  protected updateNumberOfLines(): void {
    const numberOfRows: number =
      this.table.getNumberOfRows() - this.numberOfSelectedLines;
    this.table.setNumberOfRows(numberOfRows);
  }

  protected removeLine(rowId: number): void {
    this.table.removeRow(rowId);
  }

  protected moveLine(rowId: number, move: number): void {
    this.table.moveRow(rowId, move);
  }
}

export class RowRemoveOperationStepFactory implements OperationStepFactory {
  public createStep(
    table: Table & TableRows,
    stepDto: RowRemoveOperationStepDto
  ): OperationStep {
    return new RowRemoveOperationStep(table, stepDto);
  }
}

export type ColumnRemoveOperationStepDto = Id<'column-remove'> &
  LineRemoveOperationStepDto;

export class ColumnRemoveOperationStep extends LineRemoveOperationStep {
  constructor(
    protected readonly table: Table & TableColumns,
    protected readonly stepDto: ColumnRemoveOperationStepDto
  ) {
    super(table, stepDto);
  }

  protected updateNumberOfLines(): void {
    const numberOfColumns: number =
      this.table.getNumberOfColumns() - this.numberOfSelectedLines;
    this.table.setNumberOfColumns(numberOfColumns);
  }

  protected removeLine(colId: number): void {
    this.table.removeColumn(colId);
  }

  protected moveLine(colId: number, move: number): void {
    this.table.moveColumn(colId, move);
  }
}

export class ColumnRemoveOperationStepFactory implements OperationStepFactory {
  public createStep(
    table: Table & TableColumns,
    stepDto: ColumnRemoveOperationStepDto
  ): OperationStep {
    return new ColumnRemoveOperationStep(table, stepDto);
  }
}

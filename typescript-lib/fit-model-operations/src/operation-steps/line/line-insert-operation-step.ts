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

export type LineInsertOperationStepDto = {
  selectedLineRanges: unknown[];
  numberOfNewLines: number;
  movableLines: MovableLinesDto[];
};

abstract class LineInsertOperationStep implements OperationStep {
  protected numberOfSelectedLines = 0;

  constructor(
    protected readonly table: Table,
    protected readonly stepDto: LineInsertOperationStepDto
  ) {}

  protected abstract updateNumberOfLines(): void;
  protected abstract moveLine(lineIndex: number, move: number): void;

  public run(): void {
    this.countSelectedLines();
    this.updateNumberOfLines();
    this.moveLines();
  }

  private countSelectedLines(): void {
    this.numberOfSelectedLines = 0;
    for (const lineRangeDto of this.stepDto.selectedLineRanges) {
      createLineRange4Dto(lineRangeDto).forEachLine(
        () => this.numberOfSelectedLines++
      );
    }
    this.numberOfSelectedLines *= this.stepDto.numberOfNewLines;
  }

  private moveLines(): void {
    const mlDtos: MovableLinesDto[] = this.stepDto.movableLines;
    for (let i = mlDtos.length - 1; i >= 0; i--) {
      const mlDto: MovableLinesDto = mlDtos[i];
      const lineRange: LineRange = createLineRange4Dto(
        mlDto.updatableLineRange
      );
      for (let i = lineRange.getTo(); i >= lineRange.getFrom(); i--) {
        this.moveLine(i, mlDto.move);
      }
    }
  }
}

export type RowInsertOperationStepDto = Id<'row-insert'> &
  LineInsertOperationStepDto;

export class RowInsertOperationStep extends LineInsertOperationStep {
  constructor(
    protected readonly table: Table & TableRows,
    protected readonly stepDto: RowInsertOperationStepDto
  ) {
    super(table, stepDto);
  }

  protected updateNumberOfLines(): void {
    const numberOfRows: number =
      this.table.getNumberOfRows() + this.numberOfSelectedLines;
    this.table.setNumberOfRows(numberOfRows);
  }

  protected moveLine(row: number, move: number): void {
    this.table.moveRow(row, move);
  }
}

export class RowInsertOperationStepFactory implements OperationStepFactory {
  public createStep(
    table: Table & TableRows,
    stepDto: RowInsertOperationStepDto
  ): OperationStep {
    return new RowInsertOperationStep(table, stepDto);
  }
}

export type ColumnInsertOperationStepDto = Id<'column-insert'> &
  LineInsertOperationStepDto;

export class ColumnInsertOperationStep extends LineInsertOperationStep {
  constructor(
    protected readonly table: Table & TableColumns,
    protected readonly stepDto: ColumnInsertOperationStepDto
  ) {
    super(table, stepDto);
  }

  protected updateNumberOfLines(): void {
    const numberOfColumns: number =
      this.table.getNumberOfColumns() + this.numberOfSelectedLines;
    this.table.setNumberOfColumns(numberOfColumns);
  }

  protected moveLine(colulmnIndex: number, move: number): void {
    this.table.moveColumn(colulmnIndex, move);
  }
}

export class ColumnInsertOperationStepFactory implements OperationStepFactory {
  public createStep(
    table: Table & TableColumns,
    stepDto: ColumnInsertOperationStepDto
  ): OperationStep {
    return new ColumnInsertOperationStep(table, stepDto);
  }
}

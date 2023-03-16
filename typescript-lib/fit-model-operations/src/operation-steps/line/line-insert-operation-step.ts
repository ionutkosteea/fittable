import {
  Table,
  createLineRange4Dto,
  LineRange,
  asTableRows,
  asTableCols,
} from 'fit-core/model/index.js';
import {
  OperationStep,
  OperationStepFactory,
  OperationId,
} from 'fit-core/operations/index.js';

export type MoveLinesDto = { lineRange: unknown; move: number };

export type LineInsertOperationStepDto = {
  lineRanges: unknown[];
  numberOfNewLines: number;
  moveLines: MoveLinesDto[];
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
    for (const lineRangeDto of this.stepDto.lineRanges) {
      createLineRange4Dto(lineRangeDto).forEachLine((): void => {
        this.numberOfSelectedLines++;
      });
    }
    this.numberOfSelectedLines *= this.stepDto.numberOfNewLines;
  }

  private moveLines(): void {
    const mlDtos: MoveLinesDto[] = this.stepDto.moveLines;
    for (let i = mlDtos.length - 1; i >= 0; i--) {
      const mlDto: MoveLinesDto = mlDtos[i];
      const lineRange: LineRange = createLineRange4Dto(mlDto.lineRange);
      for (let i = lineRange.getTo(); i >= lineRange.getFrom(); i--) {
        this.moveLine(i, mlDto.move);
      }
    }
  }
}

export type RowInsertOperationStepDto = OperationId<'row-insert'> &
  LineInsertOperationStepDto;

export class RowInsertOperationStep extends LineInsertOperationStep {
  constructor(
    protected readonly table: Table,
    protected readonly stepDto: RowInsertOperationStepDto
  ) {
    super(table, stepDto);
  }

  protected updateNumberOfLines(): void {
    const numberOfRows: number =
      this.table.getNumberOfRows() + this.numberOfSelectedLines;
    this.table.setNumberOfRows(numberOfRows);
  }

  protected moveLine(rowId: number, move: number): void {
    this.table.moveRowCells(rowId, move);
    asTableRows(this.table)?.moveRow(rowId, move);
  }
}

export class RowInsertOperationStepFactory implements OperationStepFactory {
  public createStep(
    table: Table,
    stepDto: RowInsertOperationStepDto
  ): OperationStep {
    return new RowInsertOperationStep(table, stepDto);
  }
}

export type ColInsertOperationStepDto = OperationId<'column-insert'> &
  LineInsertOperationStepDto;

export class ColInsertOperationStep extends LineInsertOperationStep {
  constructor(
    protected readonly table: Table,
    protected readonly stepDto: ColInsertOperationStepDto
  ) {
    super(table, stepDto);
  }

  protected updateNumberOfLines(): void {
    const numberOfCols: number =
      this.table.getNumberOfCols() + this.numberOfSelectedLines;
    this.table.setNumberOfCols(numberOfCols);
  }

  protected moveLine(colId: number, move: number): void {
    this.table.moveColCells(colId, move);
    asTableCols(this.table)?.moveCol(colId, move);
  }
}

export class ColInsertOperationStepFactory implements OperationStepFactory {
  public createStep(
    table: Table,
    stepDto: ColInsertOperationStepDto
  ): OperationStep {
    return new ColInsertOperationStep(table, stepDto);
  }
}

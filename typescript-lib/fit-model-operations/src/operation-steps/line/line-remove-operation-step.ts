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

export type LineRemoveOperationStepDto = {
  lineRanges: unknown[];
  moveLines: MoveLinesDto[];
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
    this.removeLines();
    this.moveLines();
    this.updateNumberOfLines();
  }

  private countSelectedLines(): void {
    this.numberOfSelectedLines = 0;
    for (const lineRangeDto of this.stepDto.lineRanges) {
      createLineRange4Dto(lineRangeDto).forEachLine(
        () => this.numberOfSelectedLines++
      );
    }
  }

  private removeLines(): void {
    for (let i = this.stepDto.lineRanges.length - 1; i >= 0; i--) {
      const lineRangeDto: unknown = this.stepDto.lineRanges[i];
      const lineRange: LineRange = createLineRange4Dto(lineRangeDto);
      for (let j = lineRange.getTo(); j >= lineRange.getFrom(); j--) {
        this.removeLine(j);
      }
    }
  }

  private moveLines(): void {
    for (const movableLine of this.stepDto.moveLines) {
      createLineRange4Dto(movableLine.lineRange).forEachLine((lineId): void => {
        this.moveLine(lineId, -1 * movableLine.move);
      });
    }
  }
}

export type RowRemoveOperationStepDto = OperationId<'row-remove'> &
  LineRemoveOperationStepDto;

export class RowRemoveOperationStep extends LineRemoveOperationStep {
  constructor(
    protected readonly table: Table,
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
    this.table.removeRowCells(rowId);
    asTableRows(this.table)?.removeRow(rowId);
  }

  protected moveLine(rowId: number, move: number): void {
    this.table.moveRowCells(rowId, move);
    asTableRows(this.table)?.moveRow(rowId, move);
  }
}

export class RowRemoveOperationStepFactory implements OperationStepFactory {
  public createStep(
    table: Table,
    stepDto: RowRemoveOperationStepDto
  ): OperationStep {
    return new RowRemoveOperationStep(table, stepDto);
  }
}

export type ColRemoveOperationStepDto = OperationId<'column-remove'> &
  LineRemoveOperationStepDto;

export class ColRemoveOperationStep extends LineRemoveOperationStep {
  constructor(
    protected readonly table: Table,
    protected readonly stepDto: ColRemoveOperationStepDto
  ) {
    super(table, stepDto);
  }

  protected updateNumberOfLines(): void {
    const numberOfCols: number =
      this.table.getNumberOfCols() - this.numberOfSelectedLines;
    this.table.setNumberOfCols(numberOfCols);
  }

  protected removeLine(colId: number): void {
    this.table.removeColCells(colId);
    asTableCols(this.table)?.removeCol(colId);
  }

  protected moveLine(colId: number, move: number): void {
    this.table.moveColCells(colId, move);
    asTableCols(this.table)?.moveCol(colId, move);
  }
}

export class ColRemoveOperationStepFactory implements OperationStepFactory {
  public createStep(
    table: Table,
    stepDto: ColRemoveOperationStepDto
  ): OperationStep {
    return new ColRemoveOperationStep(table, stepDto);
  }
}

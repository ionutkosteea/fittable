import {
  Table,
  createLineRange4Dto,
  LineRange,
  asTableRows,
  asTableCols,
} from 'fittable-core/model';
import {
  TableChangeWritter,
  TableChangeWritterFactory,
  Args,
} from 'fittable-core/operations';

export type MoveLinesDto = { lineRange: unknown; move: number };

export type LineInsertChange = {
  lineRanges: unknown[];
  numberOfNewLines: number;
  moveLines: MoveLinesDto[];
};

abstract class LineInsertChangeWritter implements TableChangeWritter {
  protected numberOfSelectedLines = 0;

  constructor(
    protected readonly table: Table,
    protected readonly change: LineInsertChange
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
    for (const lineRangeDto of this.change.lineRanges) {
      createLineRange4Dto(lineRangeDto).forEachLine((): void => {
        this.numberOfSelectedLines++;
      });
    }
    this.numberOfSelectedLines *= this.change.numberOfNewLines;
  }

  private moveLines(): void {
    const mlDtos: MoveLinesDto[] = this.change.moveLines;
    for (let i = mlDtos.length - 1; i >= 0; i--) {
      const mlDto: MoveLinesDto = mlDtos[i];
      const lineRange: LineRange = createLineRange4Dto(mlDto.lineRange);
      for (let i = lineRange.getTo(); i >= lineRange.getFrom(); i--) {
        this.moveLine(i, mlDto.move);
      }
    }
  }
}

export type RowInsertChange = Args<'row-insert'> & LineInsertChange;

export class RowInsertChangeWritter extends LineInsertChangeWritter {
  constructor(
    protected readonly table: Table,
    protected readonly change: RowInsertChange
  ) {
    super(table, change);
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

export class RowInsertChangeWritterFactory
  implements TableChangeWritterFactory
{
  public createTableChangeWritter(
    table: Table,
    change: RowInsertChange
  ): TableChangeWritter {
    return new RowInsertChangeWritter(table, change);
  }
}

export type ColInsertChange = Args<'column-insert'> & LineInsertChange;

export class ColInsertChangeWritter extends LineInsertChangeWritter {
  constructor(
    protected readonly table: Table,
    protected readonly change: ColInsertChange
  ) {
    super(table, change);
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

export class ColInsertChangeWritterFactory
  implements TableChangeWritterFactory
{
  public createTableChangeWritter(
    table: Table,
    change: ColInsertChange
  ): TableChangeWritter {
    return new ColInsertChangeWritter(table, change);
  }
}

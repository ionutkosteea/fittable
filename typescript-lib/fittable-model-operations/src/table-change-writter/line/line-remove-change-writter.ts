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

export type LineRemoveChange = {
  lineRanges: unknown[];
  moveLines: MoveLinesDto[];
};

abstract class LineRemoveChangeWritter implements TableChangeWritter {
  protected numberOfSelectedLines = 0;

  constructor(
    protected readonly table: Table,
    protected readonly change: LineRemoveChange
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
    for (const lineRangeDto of this.change.lineRanges) {
      createLineRange4Dto(lineRangeDto).forEachLine(
        () => this.numberOfSelectedLines++
      );
    }
  }

  private removeLines(): void {
    for (let i = this.change.lineRanges.length - 1; i >= 0; i--) {
      const lineRangeDto: unknown = this.change.lineRanges[i];
      const lineRange: LineRange = createLineRange4Dto(lineRangeDto);
      for (let j = lineRange.getTo(); j >= lineRange.getFrom(); j--) {
        this.removeLine(j);
      }
    }
  }

  private moveLines(): void {
    for (const movableLine of this.change.moveLines) {
      createLineRange4Dto(movableLine.lineRange).forEachLine((lineId): void => {
        this.moveLine(lineId, movableLine.move);
      });
    }
  }
}

export type RowRemoveChange = Args<'row-remove'> & LineRemoveChange;

export class RowRemoveChangeWritter extends LineRemoveChangeWritter {
  constructor(
    protected readonly table: Table,
    protected readonly change: RowRemoveChange
  ) {
    super(table, change);
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

export class RowRemoveChangeWritterFactory
  implements TableChangeWritterFactory
{
  public createTableChangeWritter(
    table: Table,
    change: RowRemoveChange
  ): TableChangeWritter {
    return new RowRemoveChangeWritter(table, change);
  }
}

export type ColRemoveChange = Args<'column-remove'> & LineRemoveChange;

export class ColRemoveChangeWritter extends LineRemoveChangeWritter {
  constructor(
    protected readonly table: Table,
    protected readonly change: ColRemoveChange
  ) {
    super(table, change);
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

export class ColRemoveChangeWritterFactory
  implements TableChangeWritterFactory
{
  public createTableChangeWritter(
    table: Table,
    change: ColRemoveChange
  ): TableChangeWritter {
    return new ColRemoveChangeWritter(table, change);
  }
}

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

export type RowHeightItem = {
  lineRanges: unknown[];
  height?: number;
  isAuto?: boolean;
};
export type RowHeightChange = Args<'row-height'> & { items: RowHeightItem[] };
export class RowHeightChangeWritter implements TableChangeWritter {
  constructor(
    protected readonly table: Table & TableRows,
    protected readonly change: RowHeightChange
  ) { }

  public run(): void {
    this.updateLines();
  }

  private updateLines(): void {
    for (const item of this.change.items) {
      for (const lineRangeDto of item.lineRanges) {
        createLineRange4Dto(lineRangeDto).forEachLine(
          (lineId: number): void => {
            this.updateDimension(lineId, item.height, item.isAuto);
          }
        );
      }
    }
  }

  private updateDimension(rowId: number, height?: number, isAuto?: boolean): void {
    this.table.setRowHeight(rowId, height);
    this.table.setRowAutoHeight(rowId, isAuto);
  }
}

export class RowHeightChangeWritterFactory
  implements TableChangeWritterFactory {
  public createTableChangeWritter(
    table: Table & TableRows,
    change: RowHeightChange
  ): TableChangeWritter {
    return new RowHeightChangeWritter(table, change);
  }
}

export type ColWidthItem = {
  lineRanges: unknown[];
  width?: number;
};
export type ColWidthChange = Args<'column-width'> & { items: ColWidthItem[] };

export class ColWidthChangeWritter implements TableChangeWritter {
  constructor(
    protected readonly table: Table & TableCols,
    protected readonly change: ColWidthChange
  ) { }

  public run(): void {
    this.updateLines();
  }

  private updateLines(): void {
    for (const item of this.change.items) {
      for (const lineRangeDto of item.lineRanges) {
        createLineRange4Dto(lineRangeDto).forEachLine(
          (lineId: number): void => {
            this.updateDimension(lineId, item.width);
          }
        );
      }
    }
  }

  private updateDimension(rowId: number, height?: number): void {
    this.table.setColWidth(rowId, height);
  }
}

export class ColWidthChangeWritterFactory
  implements TableChangeWritterFactory {
  public createTableChangeWritter(
    table: Table & TableCols,
    change: ColWidthChange
  ): TableChangeWritter {
    return new ColWidthChangeWritter(table, change);
  }
}

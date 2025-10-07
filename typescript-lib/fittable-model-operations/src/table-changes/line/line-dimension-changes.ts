import {
  Table,
  TableRows,
  LineRange,
  createDto4LineRangeList,
  createLineRange,
  TableCols,
} from 'fittable-core/model';
import {
  TableChanges,
  Args,
  TableChangesFactory,
} from 'fittable-core/operations';

import { LineRangeAddressObjects } from '../../utils/line/line-range-address-objects.js';
import {
  RowHeightChange,
  ColWidthChange,
  RowHeightItem,
  ColWidthItem,
} from '../../table-change-writter/line/line-dimension-change-writter.js';

export type RowHeightArgs = Args<'row-height'> & {
  selectedLines: LineRange[];
  height?: number;
  isAuto?: boolean;
};

export class RowHeightTableChangesBuilder {
  private readonly rowHeightItems: RowHeightItem[] = [];
  public readonly rowHeightChange: RowHeightChange = {
    id: 'row-height', items: this.rowHeightItems
  };

  private readonly undoRowHeightItems: RowHeightItem[] = [];
  public readonly undoRowHeightChange: RowHeightChange = {
    id: 'row-height', items: this.undoRowHeightItems,
  };

  private readonly oldHeights: LineRangeAddressObjects<{ height?: number, isAuto?: boolean } | undefined>;

  constructor(
    protected readonly table: Table & TableRows,
    protected readonly args: RowHeightArgs
  ) {
    this.oldHeights = new LineRangeAddressObjects();
  }


  public build(): TableChanges {
    if (this.args.height && this.args.height <= 0) {
      throw new Error('Height must be greater than 0!');
    }
    this.markOldHeights();
    this.updateHeights();
    this.undoHeights();
    return {
      id: this.args.id,
      changes: [this.rowHeightChange],
      undoChanges: { changes: [this.undoRowHeightChange] },
    };
  }

  private markOldHeights(): void {
    for (const lineRange of this.args.selectedLines) {
      lineRange.forEachLine((rowId: number) => {
        const height: number | undefined = this.table.getRowHeight(rowId);
        const isAuto: boolean | undefined = this.table.isRowAutoHeight(rowId);
        if (height !== this.args.height || isAuto !== this.args.isAuto) {
          this.oldHeights.set({ height, isAuto }, createLineRange(rowId));
        }
      });
    }
  }

  private updateHeights(): void {
    const lineRanges: LineRange[] = this.oldHeights.getAllAddresses();
    this.rowHeightItems.push({
      lineRanges: createDto4LineRangeList(lineRanges),
      height: this.args.height,
      isAuto: this.args.isAuto,
    });
  }

  private undoHeights(): void {
    this.oldHeights.forEach(
      (row, lineRanges?: LineRange[]) => {
        lineRanges &&
          this.undoRowHeightItems.push({
            lineRanges: createDto4LineRangeList(lineRanges),
            height: row?.height,
            isAuto: row?.isAuto,
          });
      }
    );
  }
}

export class RowHeightChangesFactory implements TableChangesFactory {
  public createTableChanges(
    table: Table & TableRows,
    args: RowHeightArgs
  ): TableChanges | Promise<TableChanges> {
    return new RowHeightTableChangesBuilder(table, args).build();
  }
}

export type ColWidthArgs = Args<'column-width'> & {
  selectedLines: LineRange[];
  width?: number;
};

export class ColWidthTableChangesBuilder {
  private readonly colWidthItems: ColWidthItem[] = [];
  public readonly colWidthChange: ColWidthChange = {
    id: 'column-width', items: this.colWidthItems
  };

  private readonly undoColWidthItems: ColWidthItem[] = [];
  public readonly undoColWidthChange: ColWidthChange = {
    id: 'column-width', items: this.undoColWidthItems,
  };

  private readonly oldWidths: LineRangeAddressObjects<number | undefined>;

  constructor(
    protected readonly table: Table & TableCols,
    protected readonly args: ColWidthArgs
  ) {
    this.oldWidths = new LineRangeAddressObjects();
  }


  public build(): TableChanges {
    if (this.args.width && this.args.width <= 0) {
      throw new Error('Width must be greater than 0!');
    }
    this.markOldWidths();
    this.updateWidths();
    this.undoWidths();
    return {
      id: this.args.id,
      changes: [this.colWidthChange],
      undoChanges: { changes: [this.undoColWidthChange] },
    };
  }

  private markOldWidths(): void {
    for (const lineRange of this.args.selectedLines) {
      lineRange.forEachLine((colId: number) => {
        const height: number | undefined = this.table.getColWidth(colId);
        if (height !== this.args.width) {
          this.oldWidths.set(height, createLineRange(colId));
        }
      });
    }
  }

  private updateWidths(): void {
    const lineRanges: LineRange[] = this.oldWidths.getAllAddresses();
    this.colWidthItems.push({
      lineRanges: createDto4LineRangeList(lineRanges),
      width: this.args.width,
    });
  }

  private undoWidths(): void {
    this.oldWidths.forEach(
      (width, lineRanges?: LineRange[]) => {
        lineRanges &&
          this.undoColWidthItems.push({
            lineRanges: createDto4LineRangeList(lineRanges),
            width
          });
      }
    );
  }
}

export class ColWidthChangesFactory implements TableChangesFactory {
  public createTableChanges(
    table: Table & TableCols,
    args: ColWidthArgs
  ): TableChanges | Promise<TableChanges> {
    return new ColWidthTableChangesBuilder(table, args).build();
  }
}

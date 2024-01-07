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
  DimensionDto,
  RowHeighChange,
  ColWidthChange,
} from '../../table-change-writter/line/line-dimension-change-writter.js';

export type LineDimensionTableArgs = {
  selectedLines: LineRange[];
  dimension?: number;
};

abstract class LineDimensionChangesBuilder {
  protected readonly dimensionsDto: DimensionDto[] = [];
  protected readonly undoDimensionsDto: DimensionDto[] = [];

  private readonly oldLineDimensions: LineRangeAddressObjects<
    number | undefined
  >;
  private isUndoable = true;

  constructor(
    protected readonly table: Table,
    protected readonly args: LineDimensionTableArgs
  ) {
    this.oldLineDimensions = new LineRangeAddressObjects();
  }

  protected abstract getLineDimension(lineId: number): number | undefined;

  public setUndoable(isUndoable: boolean): this {
    this.isUndoable = isUndoable;
    return this;
  }

  public build(): void {
    if (this.args.dimension && this.args.dimension <= 0) {
      throw new Error('Size must be greater than 0!');
    }
    this.markOldLineDimensions();
    this.updateLineDimensions();
    this.isUndoable && this.undoLineDimensions();
  }

  private markOldLineDimensions(): void {
    for (const lineRange of this.args.selectedLines) {
      lineRange.forEachLine((lineId: number) => {
        const lineDimension: number | undefined = this.getLineDimension(lineId);
        if (lineDimension !== this.args.dimension) {
          this.oldLineDimensions.set(lineDimension, createLineRange(lineId));
        }
      });
    }
  }

  private updateLineDimensions(): void {
    const lineRanges: LineRange[] = this.oldLineDimensions.getAllAddresses();
    this.dimensionsDto.push({
      lineRanges: createDto4LineRangeList(lineRanges),
      dimension: this.args.dimension,
    });
  }

  private undoLineDimensions(): void {
    this.oldLineDimensions.forEach(
      (dimension: number | undefined, lineRanges?: LineRange[]) => {
        lineRanges &&
          this.undoDimensionsDto.push({
            dimension,
            lineRanges: createDto4LineRangeList(lineRanges),
          });
      }
    );
  }
}

export type RowHeightTableChangesArgs = Args<'row-height'> &
  LineDimensionTableArgs;

export class RowHeightTableChangesBuilder extends LineDimensionChangesBuilder {
  public readonly rowHeightChange: RowHeighChange = {
    id: 'row-height',
    dimensions: this.dimensionsDto,
  };
  public readonly rowHeightUndoChange: RowHeighChange = {
    id: 'row-height',
    dimensions: this.undoDimensionsDto,
  };

  constructor(
    protected readonly table: Table & TableRows,
    protected readonly args: RowHeightTableChangesArgs
  ) {
    super(table, args);
  }

  protected getLineDimension(rowId: number): number | undefined {
    return this.table.getRowHeight(rowId);
  }

  public build(): TableChanges {
    super.build();
    return {
      id: this.args.id,
      changes: [this.rowHeightChange],
      undoChanges: { changes: [this.rowHeightUndoChange] },
    };
  }
}

export class RowHeightChangesFactory implements TableChangesFactory {
  public createTableChanges(
    table: Table & TableRows,
    args: RowHeightTableChangesArgs
  ): TableChanges | Promise<TableChanges> {
    return new RowHeightTableChangesBuilder(table, args).build();
  }
}

export type ColWidthTableChangesArgs = Args<'column-width'> &
  LineDimensionTableArgs;

export class ColWidthTableChangesBuilder extends LineDimensionChangesBuilder {
  public readonly colWidthChange: ColWidthChange = {
    id: 'column-width',
    dimensions: this.dimensionsDto,
  };
  public readonly colWidthUndoChange: ColWidthChange = {
    id: 'column-width',
    dimensions: this.undoDimensionsDto,
  };

  constructor(
    protected table: Table & TableCols,
    protected args: ColWidthTableChangesArgs
  ) {
    super(table, args);
  }

  protected getLineDimension(colId: number): number | undefined {
    return this.table.getColWidth(colId);
  }

  public build(): TableChanges {
    super.build();
    return {
      id: this.args.id,
      changes: [this.colWidthChange],
      undoChanges: { changes: [this.colWidthUndoChange] },
    };
  }
}

export class ColWidthChangesFactory implements TableChangesFactory {
  public createTableChanges(
    table: Table & TableCols,
    args: ColWidthTableChangesArgs
  ): TableChanges | Promise<TableChanges> {
    return new ColWidthTableChangesBuilder(table, args).build();
  }
}

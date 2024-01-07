import {
  Table,
  LineRange,
  createLineRange,
  createLineRange4Dto,
  createDto4LineRangeList,
  createLineRangeList4Dto,
  asTableMergedRegions,
  TableMergedRegions,
} from 'fittable-core/model';
import {
  TableChanges,
  TableChangesFactory,
  Args,
} from 'fittable-core/operations';

import {
  LineInsertChange,
  RowInsertChange,
  ColInsertChange,
  MoveLinesDto,
} from '../../table-change-writter/line/line-insert-change-writter.js';
import {
  LineRemoveChange,
  RowRemoveChange,
  ColRemoveChange,
} from '../../table-change-writter/line/line-remove-change-writter.js';
import { MergedRegionsChange } from '../../table-change-writter/merged-regions/merged-regions-change-writter.js';

type LineInsertArgs = {
  selectedLines: LineRange[];
  numberOfNewLines: number;
  insertAfter?: boolean;
};

abstract class LineInsertChangesBuilder {
  protected readonly lineInsertChange: LineInsertChange = {
    numberOfNewLines: 0,
    lineRanges: [],
    moveLines: [],
  };
  protected readonly mergedRegionsChange: MergedRegionsChange = {
    id: 'merged-regions',
    moveRegions: [],
    increaseRegions: [],
  };
  protected readonly lineRemoveUndoChange: LineRemoveChange = {
    lineRanges: [],
    moveLines: [],
  };
  protected readonly mergedRegionsUndoChange: MergedRegionsChange = {
    id: 'merged-regions',
    moveRegions: [],
    increaseRegions: [],
  };

  protected mergedRegionsTable?: Table & TableMergedRegions;
  private selectedLines: LineRange[];

  constructor(
    protected readonly table: Table,
    protected readonly args: LineInsertArgs
  ) {
    this.mergedRegionsTable = asTableMergedRegions(table);
    this.selectedLines = args.selectedLines;
  }

  protected abstract getNumberOfLines(): number;
  protected abstract getRegionLineId(rowId: number, colId: number): number;
  protected abstract getLineSpan(rowId: number, colId: number): number;
  protected abstract moveRegion(rowId: number, colId: number): void;
  protected abstract increaseRegion(rowId: number, colId: number): void;

  protected insertLines(): void {
    if (this.args.insertAfter) {
      this.selectedLines = this.createInsertAfterLineRanges(this.selectedLines);
    }
    this.lineInsertChange.lineRanges = createDto4LineRangeList(
      this.selectedLines
    );
    this.lineInsertChange.moveLines = this.createMovableLinesDto();
    this.lineInsertChange.numberOfNewLines = this.args.numberOfNewLines;
  }

  private createInsertAfterLineRanges(selectedLines: LineRange[]): LineRange[] {
    const newLineRanges: LineRange[] = [];
    for (const lineRange of selectedLines) {
      const from: number = lineRange.getFrom() + 1;
      const to: number | undefined =
        lineRange.getTo() < this.getNumberOfLines() - 1
          ? lineRange.getTo() + 1
          : undefined;
      newLineRanges.push(createLineRange(from, to));
    }
    return newLineRanges;
  }

  private createMovableLinesDto(): MoveLinesDto[] {
    const movableLinesDto: MoveLinesDto[] = [];
    let move: number = this.args.numberOfNewLines;
    const numberOfLines: number = this.getNumberOfLines();
    for (let i = 0; i < this.selectedLines.length; i++) {
      const lineRange: LineRange = this.selectedLines[i];
      if (lineRange.getFrom() >= numberOfLines) continue;
      movableLinesDto.push({ lineRange: lineRange.getDto(), move });
      move++;
      if (i > 0) {
        const previousLineRange: LineRange = this.selectedLines[i - 1].clone();
        previousLineRange.setFrom(previousLineRange.getFrom() - 1);
        movableLinesDto[i - 1].lineRange = previousLineRange.getDto();
      }
    }
    if (movableLinesDto.length > 0) {
      const lastMovableLines: MoveLinesDto =
        movableLinesDto[movableLinesDto.length - 1];
      const lastLineRange: LineRange = createLineRange4Dto(
        lastMovableLines.lineRange
      ).clone();
      if (lastLineRange.getFrom() < numberOfLines - 1) {
        lastLineRange.setTo(numberOfLines - 1);
        lastMovableLines.lineRange = lastLineRange.getDto();
      }
    }
    return movableLinesDto;
  }

  protected undoInsertLines(): void {
    this.removeInsertedLines();
    this.revertMovedLines();
  }

  private removeInsertedLines(): void {
    const lineRanges: LineRange[] = createLineRangeList4Dto(
      this.lineInsertChange.lineRanges
    );
    const from: number = lineRanges[0].getFrom();
    const to: number = from + this.lineInsertChange.numberOfNewLines - 1;
    const lineRangeDto: unknown = createLineRange(from, to).getDto();
    this.lineRemoveUndoChange.lineRanges.push(lineRangeDto);
  }

  public revertMovedLines(): void {
    this.lineInsertChange.moveLines.forEach(
      (movableLines: MoveLinesDto): void => {
        const lineRangeDto: unknown = movableLines.lineRange;
        const lineRange: LineRange = createLineRange4Dto(lineRangeDto);
        const from: number = lineRange.getFrom() + movableLines.move;
        const to: number = lineRange.getTo() + movableLines.move;
        this.lineRemoveUndoChange.moveLines.push({
          lineRange: createLineRange(from, to).getDto(),
          move: -1 * movableLines.move,
        });
      }
    );
  }

  protected updateMergedRegions(): void {
    this.mergedRegionsTable?.forEachMergedCell(
      (rowId: number, colId: number): void => {
        for (const lineRange of this.selectedLines) {
          const selectedFrom: number = lineRange.getFrom() - 1;
          const regionFrom: number = this.getRegionLineId(rowId, colId);
          const lineSpan: number = this.getLineSpan(rowId, colId);
          const regionTo: number = lineSpan
            ? regionFrom + lineSpan - 1
            : regionFrom;
          if (selectedFrom < regionFrom) {
            this.moveRegion(rowId, colId);
          } else if (selectedFrom >= regionFrom && selectedFrom < regionTo) {
            this.increaseRegion(rowId, colId);
          }
        }
      }
    );
  }
}

export type RowInsertTableChangesArgs = Args<'row-insert'> & LineInsertArgs;

export class RowInsertTableChangesBuilder extends LineInsertChangesBuilder {
  constructor(
    protected readonly table: Table,
    protected readonly args: RowInsertTableChangesArgs
  ) {
    super(table, args);
  }

  public build(): TableChanges {
    if (this.args.numberOfNewLines <= 0) {
      throw new Error('Number of inserted rows must be greater than 0!');
    }
    this.insertLines();
    this.undoInsertLines();
    this.updateMergedRegions();
    const rowInsertChange: RowInsertChange = {
      id: 'row-insert',
      ...this.lineInsertChange,
    };
    const rowInsertUndoChange: RowRemoveChange = {
      id: 'row-remove',
      ...this.lineRemoveUndoChange,
    };
    return {
      id: this.args.id,
      changes: [rowInsertChange, this.mergedRegionsChange],
      undoChanges: {
        changes: [rowInsertUndoChange, this.mergedRegionsUndoChange],
      },
    };
  }

  protected getNumberOfLines(): number {
    return this.table.getNumberOfRows();
  }

  protected getRegionLineId(rowId: number): number {
    return rowId;
  }

  protected getLineSpan(rowId: number, colId: number): number {
    return this.mergedRegionsTable?.getRowSpan(rowId, colId) ?? 0;
  }

  protected moveRegion(rowId: number, colId: number): void {
    this.mergedRegionsChange.moveRegions?.push({
      rowId,
      colId,
      moveRow: this.args.numberOfNewLines,
      moveCol: 0,
    });
    this.mergedRegionsUndoChange.moveRegions?.push({
      rowId: rowId + this.args.numberOfNewLines,
      colId,
      moveRow: -this.args.numberOfNewLines,
      moveCol: 0,
    });
  }

  protected increaseRegion(rowId: number, colId: number): void {
    this.mergedRegionsChange.increaseRegions?.push({
      rowId,
      colId,
      increaseRow: this.args.numberOfNewLines,
      increaseCol: 0,
    });
    this.mergedRegionsUndoChange.increaseRegions?.push({
      rowId,
      colId,
      increaseRow: -this.args.numberOfNewLines,
      increaseCol: 0,
    });
  }
}

export class RowInsertChangesFactory implements TableChangesFactory {
  public createTableChanges(
    table: Table,
    args: RowInsertTableChangesArgs
  ): TableChanges | Promise<TableChanges> {
    return new RowInsertTableChangesBuilder(table, args).build();
  }
}

export type ColInsertTableChangesArgs = Args<'column-insert'> & LineInsertArgs;

export class ColInsertTableChangesBuilder extends LineInsertChangesBuilder {
  constructor(
    protected readonly table: Table,
    protected readonly args: ColInsertTableChangesArgs
  ) {
    super(table, args);
  }

  protected getNumberOfLines(): number {
    return this.table.getNumberOfCols();
  }

  public build(): TableChanges {
    if (this.args.numberOfNewLines <= 0) {
      throw new Error('Number of inserted columns must be greater than 0!');
    }
    this.insertLines();
    this.undoInsertLines();
    this.updateMergedRegions();
    const colInsertChange: ColInsertChange = {
      id: 'column-insert',
      ...this.lineInsertChange,
    };
    const colInsertUndoChange: ColRemoveChange = {
      id: 'column-remove',
      ...this.lineRemoveUndoChange,
    };
    return {
      id: this.args.id,
      changes: [colInsertChange, this.mergedRegionsChange],
      undoChanges: {
        changes: [colInsertUndoChange, this.mergedRegionsUndoChange],
      },
    };
  }

  protected getRegionLineId(rowId: number, colId: number): number {
    return colId;
  }

  protected getLineSpan(rowId: number, colId: number): number {
    return this.mergedRegionsTable?.getColSpan(rowId, colId) ?? 0;
  }

  protected moveRegion(rowId: number, colId: number): void {
    this.mergedRegionsChange.moveRegions?.push({
      rowId,
      colId,
      moveRow: 0,
      moveCol: this.args.numberOfNewLines,
    });
    this.mergedRegionsUndoChange.moveRegions?.push({
      rowId,
      colId: colId + this.args.numberOfNewLines,
      moveRow: 0,
      moveCol: -this.args.numberOfNewLines,
    });
  }

  protected increaseRegion(rowId: number, colId: number): void {
    this.mergedRegionsChange.increaseRegions?.push({
      rowId,
      colId,
      increaseRow: 0,
      increaseCol: this.args.numberOfNewLines,
    });
    this.mergedRegionsUndoChange.increaseRegions?.push({
      rowId,
      colId,
      increaseRow: 0,
      increaseCol: -this.args.numberOfNewLines,
    });
  }
}

export class ColInsertChangesFactory implements TableChangesFactory {
  public createTableChanges(
    table: Table,
    args: ColInsertTableChangesArgs
  ): TableChanges | Promise<TableChanges> {
    return new ColInsertTableChangesBuilder(table, args).build();
  }
}

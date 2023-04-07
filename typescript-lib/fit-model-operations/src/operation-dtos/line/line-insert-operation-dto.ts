import {
  Table,
  LineRange,
  createLineRange,
  createLineRange4Dto,
  createDto4LineRangeList,
  createLineRangeList4Dto,
  asTableMergedRegions,
  TableMergedRegions,
} from 'fit-core/model/index.js';
import {
  OperationDto,
  OperationDtoFactory,
  OperationId,
} from 'fit-core/operations/index.js';

import {
  LineInsertOperationStepDto,
  RowInsertOperationStepDto,
  ColInsertOperationStepDto,
  MoveLinesDto,
} from '../../operation-steps/line/line-insert-operation-step.js';
import {
  LineRemoveOperationStepDto,
  RowRemoveOperationStepDto,
  ColRemoveOperationStepDto,
} from '../../operation-steps/line/line-remove-operation-step.js';
import { MergedRegionsOperationStepDto } from '../../operation-steps/merged-regions/merged-regions-operation-step.js';

type LineInsertOperationDtoArgs = {
  selectedLines: LineRange[];
  numberOfNewLines: number;
  insertAfter?: boolean;
};

abstract class LineInsertOperationDtoBuilder {
  protected readonly lineInsertStepDto: LineInsertOperationStepDto = {
    numberOfNewLines: 0,
    lineRanges: [],
    moveLines: [],
  };
  protected readonly mergedRegionsStepDto: MergedRegionsOperationStepDto = {
    id: 'merged-regions',
    moveRegions: [],
    increaseRegions: [],
  };
  protected readonly undoLineRemoveStepDto: LineRemoveOperationStepDto = {
    lineRanges: [],
    moveLines: [],
  };
  protected readonly undoMergedRegionsStepDto: MergedRegionsOperationStepDto = {
    id: 'merged-regions',
    moveRegions: [],
    increaseRegions: [],
  };

  protected mergedRegionsTable?: Table & TableMergedRegions;
  private selectedLines: LineRange[];

  constructor(
    protected readonly table: Table,
    protected readonly args: LineInsertOperationDtoArgs
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
    this.lineInsertStepDto.lineRanges = createDto4LineRangeList(
      this.selectedLines
    );
    this.lineInsertStepDto.moveLines = this.createMovableLinesDto();
    this.lineInsertStepDto.numberOfNewLines = this.args.numberOfNewLines;
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
      this.lineInsertStepDto.lineRanges
    );
    const from: number = lineRanges[0].getFrom();
    const to: number = from + this.lineInsertStepDto.numberOfNewLines - 1;
    const lineRangeDto: unknown = createLineRange(from, to).getDto();
    this.undoLineRemoveStepDto.lineRanges.push(lineRangeDto);
  }

  public revertMovedLines(): void {
    this.lineInsertStepDto.moveLines.forEach(
      (movableLines: MoveLinesDto): void => {
        const lineRangeDto: unknown = movableLines.lineRange;
        const lineRange: LineRange = createLineRange4Dto(lineRangeDto);
        const from: number = lineRange.getFrom() + movableLines.move;
        const to: number = lineRange.getTo() + movableLines.move;
        this.undoLineRemoveStepDto.moveLines.push({
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

export type RowInsertOperationDtoArgs = OperationId<'row-insert'> &
  LineInsertOperationDtoArgs;

export class RowInsertOperationDtoBuilder extends LineInsertOperationDtoBuilder {
  constructor(
    protected readonly table: Table,
    protected readonly args: RowInsertOperationDtoArgs
  ) {
    super(table, args);
  }

  public build(): OperationDto {
    if (this.args.numberOfNewLines <= 0) {
      throw new Error('Number of inserted rows must be greater than 0!');
    }
    this.insertLines();
    this.undoInsertLines();
    this.updateMergedRegions();
    const rowInsertStepDto: RowInsertOperationStepDto = {
      id: 'row-insert',
      ...this.lineInsertStepDto,
    };
    const undoRowInsertStepDto: RowRemoveOperationStepDto = {
      id: 'row-remove',
      ...this.undoLineRemoveStepDto,
    };
    return {
      id: this.args.id,
      steps: [rowInsertStepDto, this.mergedRegionsStepDto],
      undoOperation: {
        steps: [undoRowInsertStepDto, this.undoMergedRegionsStepDto],
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
    this.mergedRegionsStepDto.moveRegions?.push({
      rowId,
      colId,
      moveRow: this.args.numberOfNewLines,
      moveCol: 0,
    });
    this.undoMergedRegionsStepDto.moveRegions?.push({
      rowId: rowId + this.args.numberOfNewLines,
      colId,
      moveRow: -this.args.numberOfNewLines,
      moveCol: 0,
    });
  }

  protected increaseRegion(rowId: number, colId: number): void {
    this.mergedRegionsStepDto.increaseRegions?.push({
      rowId,
      colId,
      increaseRow: this.args.numberOfNewLines,
      increaseCol: 0,
    });
    this.undoMergedRegionsStepDto.increaseRegions?.push({
      rowId,
      colId,
      increaseRow: -this.args.numberOfNewLines,
      increaseCol: 0,
    });
  }
}

export class RowInsertOperationDtoFactory implements OperationDtoFactory {
  public createOperationDto(
    table: Table,
    args: RowInsertOperationDtoArgs
  ): OperationDto | Promise<OperationDto> {
    return new RowInsertOperationDtoBuilder(table, args).build();
  }
}

export type ColInsertOperationDtoArgs = OperationId<'column-insert'> &
  LineInsertOperationDtoArgs;

export class ColInsertOperationDtoBuilder extends LineInsertOperationDtoBuilder {
  constructor(
    protected readonly table: Table,
    protected readonly args: ColInsertOperationDtoArgs
  ) {
    super(table, args);
  }

  protected getNumberOfLines(): number {
    return this.table.getNumberOfCols();
  }

  public build(): OperationDto {
    if (this.args.numberOfNewLines <= 0) {
      throw new Error('Number of inserted columns must be greater than 0!');
    }
    this.insertLines();
    this.undoInsertLines();
    this.updateMergedRegions();
    const colInsertStepDto: ColInsertOperationStepDto = {
      id: 'column-insert',
      ...this.lineInsertStepDto,
    };
    const undoColInsertStepDto: ColRemoveOperationStepDto = {
      id: 'column-remove',
      ...this.undoLineRemoveStepDto,
    };
    return {
      id: this.args.id,
      steps: [colInsertStepDto, this.mergedRegionsStepDto],
      undoOperation: {
        steps: [undoColInsertStepDto, this.undoMergedRegionsStepDto],
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
    this.mergedRegionsStepDto.moveRegions?.push({
      rowId,
      colId,
      moveRow: 0,
      moveCol: this.args.numberOfNewLines,
    });
    this.undoMergedRegionsStepDto.moveRegions?.push({
      rowId,
      colId: colId + this.args.numberOfNewLines,
      moveRow: 0,
      moveCol: -this.args.numberOfNewLines,
    });
  }

  protected increaseRegion(rowId: number, colId: number): void {
    this.mergedRegionsStepDto.increaseRegions?.push({
      rowId,
      colId,
      increaseRow: 0,
      increaseCol: this.args.numberOfNewLines,
    });
    this.undoMergedRegionsStepDto.increaseRegions?.push({
      rowId,
      colId,
      increaseRow: 0,
      increaseCol: -this.args.numberOfNewLines,
    });
  }
}

export class ColInsertOperationDtoFactory implements OperationDtoFactory {
  public createOperationDto(
    table: Table,
    args: ColInsertOperationDtoArgs
  ): OperationDto | Promise<OperationDto> {
    return new ColInsertOperationDtoBuilder(table, args).build();
  }
}

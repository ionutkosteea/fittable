import {
  Table,
  LineRange,
  createLineRange,
  createLineRange4Dto,
  createDto4LineRangeList,
  createLineRangeList4Dto,
  asTableMergedRegions,
  MergedRegion,
} from 'fit-core/model/index.js';
import {
  OperationDto,
  OperationDtoFactory,
  Id,
} from 'fit-core/operations/index.js';

import {
  LineInsertOperationStepDto,
  RowInsertOperationStepDto,
  ColumnInsertOperationStepDto,
  MovableLinesDto,
} from '../../operation-steps/line/line-insert-operation-step.js';
import {
  LineRemoveOperationStepDto,
  RowRemoveOperationStepDto,
  ColumnRemoveOperationStepDto,
} from '../../operation-steps/line/line-remove-operation-step.js';
import { MergedRegionsOperationStepDto } from '../../operation-steps/merged-regions/merged-regions-operation-step.js';

type LineInsertOperationDtoArgs = {
  selectedLines: LineRange[];
  numberOfInsertableLines: number;
  canInsertAfter?: boolean;
};

abstract class LineInsertOperationDtoBuilder {
  protected readonly lineInsertStepDto: LineInsertOperationStepDto = {
    numberOfNewLines: 0,
    selectedLineRanges: [],
    movableLines: [],
  };
  protected readonly mergedRegionsStepDto: MergedRegionsOperationStepDto = {
    id: 'merged-regions',
    create4CellRanges: [],
    remove4CellCoords: [],
  };
  protected readonly undoLineRemoveStepDto: LineRemoveOperationStepDto = {
    removableLineRanges: [],
    movableLineRanges: [],
  };
  protected readonly undoMergedRegionsStepDto: MergedRegionsOperationStepDto = {
    id: 'merged-regions',
    create4CellRanges: [],
    remove4CellCoords: [],
  };

  private selectedLines: LineRange[];

  constructor(
    protected readonly table: Table,
    protected readonly args: LineInsertOperationDtoArgs
  ) {
    this.selectedLines = args.selectedLines;
  }

  protected abstract getNumberOfLines(): number;
  protected abstract getFromLineId(region: MergedRegion): number;
  protected abstract getToLineId(region: MergedRegion): number;
  protected abstract move(region: MergedRegion): void;
  protected abstract increase(region: MergedRegion): void;

  protected insertLines(): void {
    if (this.args.canInsertAfter) {
      this.selectedLines = this.createInsertAfterLineRanges(this.selectedLines);
    }
    this.lineInsertStepDto.selectedLineRanges = createDto4LineRangeList(
      this.selectedLines
    );
    this.lineInsertStepDto.movableLines = this.createMovableLinesDto();
    this.lineInsertStepDto.numberOfNewLines = this.args.numberOfInsertableLines;
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

  private createMovableLinesDto(): MovableLinesDto[] {
    const movableLinesDto: MovableLinesDto[] = [];
    let move: number = this.args.numberOfInsertableLines;
    const numberOfLines: number = this.getNumberOfLines();
    for (let i = 0; i < this.selectedLines.length; i++) {
      const lineRange: LineRange = this.selectedLines[i];
      if (lineRange.getFrom() >= numberOfLines) continue;
      movableLinesDto.push({ updatableLineRange: lineRange.getDto(), move });
      move++;
      if (i > 0) {
        const previousLineRange: LineRange = this.selectedLines[i - 1].clone();
        previousLineRange.setFrom(previousLineRange.getFrom() - 1);
        movableLinesDto[i - 1].updatableLineRange = previousLineRange.getDto();
      }
    }
    if (movableLinesDto.length > 0) {
      const lastMovableLines: MovableLinesDto =
        movableLinesDto[movableLinesDto.length - 1];
      const lastLineRange: LineRange = createLineRange4Dto(
        lastMovableLines.updatableLineRange
      ).clone();
      if (lastLineRange.getFrom() < numberOfLines - 1) {
        lastLineRange.setTo(numberOfLines - 1);
        lastMovableLines.updatableLineRange = lastLineRange.getDto();
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
      this.lineInsertStepDto.selectedLineRanges
    );
    const from: number = lineRanges[0].getFrom();
    const to: number = from + this.lineInsertStepDto.numberOfNewLines - 1;
    const lineRangeDto: unknown = createLineRange(from, to).getDto();
    this.undoLineRemoveStepDto.removableLineRanges.push(lineRangeDto);
  }

  public revertMovedLines(): void {
    this.lineInsertStepDto.movableLines.forEach(
      (movableLines: MovableLinesDto): void => {
        const lineRangeDto: unknown = movableLines.updatableLineRange;
        const lineRange: LineRange = createLineRange4Dto(lineRangeDto);
        const from: number = lineRange.getFrom() + movableLines.move;
        const to: number = lineRange.getTo() + movableLines.move;
        this.undoLineRemoveStepDto.movableLineRanges.push({
          updatableLineRange: createLineRange(from, to).getDto(),
          move: movableLines.move,
        });
      }
    );
  }

  protected updateMergedRegions(): void {
    asTableMergedRegions(this.table)
      ?.getMergedRegions()
      .forEachRegion((region: MergedRegion) => {
        for (const lineRange of this.selectedLines) {
          const selectedFrom: number = lineRange.getFrom() - 1;
          const regionFrom: number = this.getFromLineId(region);
          const regionTo: number = this.getToLineId(region);
          const newRegion: MergedRegion = region.clone() as MergedRegion;
          if (selectedFrom < regionFrom) {
            this.move(newRegion);
            this.updateMergedRegion(region, newRegion);
          } else if (selectedFrom >= regionFrom && selectedFrom < regionTo) {
            this.increase(newRegion);
            this.updateMergedRegion(region, newRegion);
          }
        }
      });
  }

  private updateMergedRegion(
    region: MergedRegion,
    newRegion: MergedRegion
  ): void {
    this.mergedRegionsStepDto.create4CellRanges.push(newRegion.getDto());
    this.mergedRegionsStepDto.remove4CellCoords.push(region.getFrom().getDto());
    this.undoMergedRegionsStepDto.create4CellRanges.push(region.getDto());
    this.undoMergedRegionsStepDto.remove4CellCoords.push(
      newRegion.getFrom().getDto()
    );
  }
}

export type RowInsertOperationDtoArgs = Id<'row-insert'> &
  LineInsertOperationDtoArgs;

export class RowInsertOperationDtoBuilder extends LineInsertOperationDtoBuilder {
  constructor(
    protected readonly table: Table,
    protected readonly args: RowInsertOperationDtoArgs
  ) {
    super(table, args);
  }

  public build(): OperationDto {
    if (this.args.numberOfInsertableLines <= 0) {
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

  protected getFromLineId(region: MergedRegion): number {
    return region.getFrom().getRowId();
  }

  protected getToLineId(region: MergedRegion): number {
    return region.getTo().getRowId();
  }

  protected move(region: MergedRegion): void {
    region.move(this.args.numberOfInsertableLines, 0);
  }

  protected increase(region: MergedRegion): void {
    region.increase(this.args.numberOfInsertableLines, 0);
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

export type ColumnInsertOperationDtoArgs = Id<'column-insert'> &
  LineInsertOperationDtoArgs;

export class ColumnInsertOperationDtoBuilder extends LineInsertOperationDtoBuilder {
  constructor(
    protected readonly table: Table,
    protected readonly args: ColumnInsertOperationDtoArgs
  ) {
    super(table, args);
  }

  protected getNumberOfLines(): number {
    return this.table.getNumberOfColumns();
  }

  public build(): OperationDto {
    if (this.args.numberOfInsertableLines <= 0) {
      throw new Error('Number of inserted columns must be greater than 0!');
    }
    this.insertLines();
    this.undoInsertLines();
    this.updateMergedRegions();
    const columnInsertStepDto: ColumnInsertOperationStepDto = {
      id: 'column-insert',
      ...this.lineInsertStepDto,
    };
    const undoColumnInsertStepDto: ColumnRemoveOperationStepDto = {
      id: 'column-remove',
      ...this.undoLineRemoveStepDto,
    };
    return {
      id: this.args.id,
      steps: [columnInsertStepDto, this.mergedRegionsStepDto],
      undoOperation: {
        steps: [undoColumnInsertStepDto, this.undoMergedRegionsStepDto],
      },
    };
  }

  protected getFromLineId(region: MergedRegion): number {
    return region.getFrom().getColId();
  }

  protected getToLineId(region: MergedRegion): number {
    return region.getTo().getColId();
  }

  protected move(region: MergedRegion): void {
    region.move(0, this.args.numberOfInsertableLines);
  }

  protected increase(region: MergedRegion): void {
    region.increase(0, this.args.numberOfInsertableLines);
  }
}

export class ColumnInsertOperationDtoFactory implements OperationDtoFactory {
  public createOperationDto(
    table: Table,
    args: ColumnInsertOperationDtoArgs
  ): OperationDto | Promise<OperationDto> {
    return new ColumnInsertOperationDtoBuilder(table, args).build();
  }
}

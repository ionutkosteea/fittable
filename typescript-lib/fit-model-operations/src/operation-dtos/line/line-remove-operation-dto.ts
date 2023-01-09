import { implementsTKeys } from 'fit-core/common/index.js';
import {
  Table,
  Style,
  TableStyles,
  Value,
  CellRange,
  Cell,
  LineRange,
  createLineRangeList4Dto,
  createLineRange4Dto,
  createLineRange,
  createDto4LineRangeList,
  createCellRangeList4Dto,
  createDto4CellRangeList,
  asCellStyle,
  CellStyle,
  MergedRegion,
  asTableMergedRegions,
  CellCoord,
} from 'fit-core/model/index.js';
import {
  OperationDto,
  OperationDtoFactory,
  Id,
} from 'fit-core/operations/index.js';

import { CellRangeAddressObjects } from '../../utils/cell/cell-range-address-objects.js';
import { LineRangeAddressObjects } from '../../utils/line/line-range-address-objects.js';

import {
  TableLinesHelper,
  TableRowsHelper,
  TableColumnsHelper,
} from '../../utils/line/table-lines-helper.js';
import {
  countAllCellStyleNames,
  countSelectedCellStyleNames,
} from '../../utils/style/style-functions.js';

import {
  LineRemoveOperationStepDto,
  MovableLinesDto,
  RowRemoveOperationStepDto,
  ColumnRemoveOperationStepDto,
} from '../../operation-steps/line/line-remove-operation-step.js';
import {
  LineDimensionOperationStepDto,
  RowHeightOperationStepDto,
  ColumnWidthOperationStepDto,
  DimensionDto,
} from '../../operation-steps/line/line-dimension-operation-step.js';

import {
  LineInsertOperationStepDto,
  RowInsertOperationStepDto,
  ColumnInsertOperationStepDto,
} from '../../operation-steps/line/line-insert-operation-step.js';
import { CellValueOperationStepDto } from '../../operation-steps/cell/cell-value-operation-step.js';
import { StyleOperationStepDto } from '../../operation-steps/style/style-operation-step.js';
import { MergedRegionsOperationStepDto } from '../../operation-steps/merged-regions/merged-regions-operation-step.js';

type LineRemoveOperationDtoArgs = {
  selectedLines: LineRange[];
};

abstract class LineRemoveOperationDtoBuilder {
  protected lineRemoveStepDto: LineRemoveOperationStepDto = {
    removableLineRanges: [],
    movableLineRanges: [],
  };
  protected styleStepDto: StyleOperationStepDto = {
    id: 'style',
    cellStyleNames: [],
    createStyles: [],
    updateStyles: [],
    removeStyles: [],
  };
  protected mergedRegionsStepDto: MergedRegionsOperationStepDto = {
    id: 'merged-regions',
    create4CellRanges: [],
    remove4CellCoords: [],
  };
  protected undoLineInsertStepDto: LineInsertOperationStepDto = {
    numberOfNewLines: 0,
    selectedLineRanges: [],
    movableLines: [],
  };
  protected undoLineDimensionStepDto: LineDimensionOperationStepDto = {
    dimensions: [],
  };
  protected undoCellValueStepDto: CellValueOperationStepDto = {
    id: 'cell-value',
    values: [],
  };
  protected undoStyleStepDto: StyleOperationStepDto = {
    id: 'style',
    cellStyleNames: [],
    createStyles: [],
    updateStyles: [],
    removeStyles: [],
  };
  protected undoMergedRegionsStepDto: MergedRegionsOperationStepDto = {
    id: 'merged-regions',
    create4CellRanges: [],
    remove4CellCoords: [],
  };

  private readonly isStyledTable: boolean;

  constructor(
    protected readonly table: Table,
    protected readonly args: LineRemoveOperationDtoArgs
  ) {
    this.isStyledTable = implementsTKeys<TableStyles>(table, ['getStyle']);
  }

  protected abstract getTableLinesHelper(): TableLinesHelper;
  protected abstract getFromLineId(region: MergedRegion): number;
  protected abstract getToLineId(region: MergedRegion): number;
  protected abstract move(region: MergedRegion, factor: number): void;
  protected abstract decrease(region: MergedRegion, factor: number): void;

  protected update(): void {
    this.removeLines();
    this.moveLines();
    this.isStyledTable && this.removeStyles();
  }

  private removeLines(): void {
    this.lineRemoveStepDto.removableLineRanges = createDto4LineRangeList(
      this.args.selectedLines
    );
  }

  private moveLines(): void {
    const movableLinesDto: MovableLinesDto[] = [];
    const removableLinesDto: unknown[] =
      this.lineRemoveStepDto.removableLineRanges;
    const removableLines: LineRange[] =
      createLineRangeList4Dto(removableLinesDto);
    const sortedLines: LineRange[] = this.sortLineRanges(removableLines);
    const numberOfLines: number = this.getTableLinesHelper().getNumberOfLines();
    let move = 0;
    for (let i = 0; i < sortedLines.length; i++) {
      move += sortedLines[i].getNumberOfLines();
      const from: number = sortedLines[i].getTo() + 1;
      if (from < numberOfLines) {
        const updatableLineRange: unknown = createLineRange(from).getDto();
        movableLinesDto.push({ updatableLineRange, move });
      }
      if (i > 0) {
        const lineRangeDto: unknown = movableLinesDto[i - 1].updatableLineRange;
        const to: number = sortedLines[i].getFrom() - 1;
        const lineRange: LineRange =
          createLineRange4Dto(lineRangeDto).setTo(to);
        movableLinesDto[i - 1].updatableLineRange = lineRange.getDto();
      }
    }
    if (movableLinesDto.length > 0) {
      const n: number = movableLinesDto.length - 1;
      const lineRangeDto: unknown = movableLinesDto[n].updatableLineRange;
      const lineRange: LineRange = createLineRange4Dto(lineRangeDto);
      if (lineRange.getTo() === lineRange.getFrom()) {
        lineRange.setTo(numberOfLines - 1);
        movableLinesDto[n].updatableLineRange = lineRange.getDto();
      }
    }
    this.lineRemoveStepDto.movableLineRanges = movableLinesDto;
  }

  private sortLineRanges(lineRanges: LineRange[]): LineRange[] {
    const sortedLineRanges: LineRange[] = lineRanges.sort(
      (left: LineRange, right: LineRange) => {
        if (left.getTo() < right.getTo()) return -1;
        else return 0;
      }
    );
    return sortedLineRanges;
  }

  private removeStyles(): void {
    const sTable: Table & TableStyles = this.getStyledTable();
    const allCellsCnt: Map<string, number> = countAllCellStyleNames(sTable);
    const selectedCellsCnt: Map<string, number> = countSelectedCellStyleNames(
      sTable,
      createCellRangeList4Dto(this.getUpdatableCellRangesDto())
    );
    selectedCellsCnt.forEach(
      (numOfSelectedCells: number, styleName: string) => {
        if (numOfSelectedCells >= (allCellsCnt.get(styleName) ?? 0)) {
          this.styleStepDto.removeStyles.push(styleName);
        }
      }
    );
  }

  private getStyledTable(): Table & TableStyles {
    return this.table as Table & TableStyles;
  }

  private getUpdatableCellRangesDto(): unknown[] {
    const updatableCellRangesDto: unknown[] = [];
    for (const cellStyleNames of this.undoStyleStepDto.cellStyleNames) {
      cellStyleNames.updatableCellRanges.forEach((cellRangeDto: unknown) =>
        updatableCellRangesDto.push(cellRangeDto)
      );
    }
    return updatableCellRangesDto;
  }

  protected undo(): void {
    this.undoLineDimensions();
    this.undoRemovedLines();
    this.undoCellValues();
    this.isStyledTable && this.undoStyles();
  }

  private undoLineDimensions(): void {
    const oldDimensions: LineRangeAddressObjects<number> =
      new LineRangeAddressObjects();
    for (const lineRangesDto of this.lineRemoveStepDto.removableLineRanges) {
      createLineRange4Dto(lineRangesDto).forEachLine((lineId: number) => {
        const helper: TableLinesHelper = this.getTableLinesHelper();
        const dimension: number | undefined = helper.getDimension(lineId);
        dimension && oldDimensions.set(dimension, createLineRange(lineId));
      });
    }
    oldDimensions.forEach((dimension: number, lineRanges?: LineRange[]) => {
      if (lineRanges) {
        const updatableLineRanges: unknown[] =
          createDto4LineRangeList(lineRanges);
        const dimensionDto: DimensionDto = { updatableLineRanges, dimension };
        this.undoLineDimensionStepDto.dimensions.push(dimensionDto);
      }
    });
  }

  private undoRemovedLines(): void {
    this.undoLineInsertStepDto.numberOfNewLines = 1;
    this.undoLineInsertStepDto.selectedLineRanges =
      this.lineRemoveStepDto.removableLineRanges;
    this.lineRemoveStepDto.movableLineRanges.forEach(
      (movableLines: MovableLinesDto) => {
        const lineRange: LineRange = createLineRange4Dto(
          movableLines.updatableLineRange
        );
        const from: number = lineRange.getFrom() - movableLines.move;
        const to: number = lineRange.getTo() - movableLines.move;
        this.undoLineInsertStepDto.movableLines.push({
          updatableLineRange: createLineRange(from, to).getDto(),
          move: movableLines.move,
        });
      }
    );
  }

  private undoCellValues(): void {
    const oldValues: CellRangeAddressObjects<Value | undefined> =
      new CellRangeAddressObjects();
    this.lineRemoveStepDto.removableLineRanges.forEach(
      (removableLineRange: unknown) => {
        this.getTableLinesHelper().forEachLineCell(
          createLineRange4Dto(removableLineRange),
          (rowId: number, colId: number) => {
            const cell: Cell | undefined = this.table.getCell(rowId, colId);
            cell?.getValue() && oldValues.set(cell.getValue(), rowId, colId);
          }
        );
      }
    );
    oldValues.forEach((value: Value | undefined, address: CellRange[]) => {
      const updatableCellRanges: unknown[] = createDto4CellRangeList(address);
      this.undoCellValueStepDto.values.push({ updatableCellRanges, value });
    });
  }

  private undoStyles(): void {
    this.undoRemovedCellStyleNames();
    this.undoRemovedStyles();
  }

  private undoRemovedCellStyleNames(): void {
    const oldStyleNames: CellRangeAddressObjects<string> =
      new CellRangeAddressObjects();
    this.lineRemoveStepDto.removableLineRanges.forEach(
      (removableLineRange: unknown) => {
        this.getTableLinesHelper().forEachLineCell(
          createLineRange4Dto(removableLineRange),
          (rowId: number, colId: number) => {
            const cell: Cell | undefined = this.table.getCell(rowId, colId);
            const cellStyle: CellStyle | undefined = asCellStyle(cell);
            const styleName: string | undefined = cellStyle?.getStyleName();
            styleName && oldStyleNames.set(styleName, rowId, colId);
          }
        );
      }
    );
    oldStyleNames.forEach((styleName: string, address: CellRange[]) => {
      this.undoStyleStepDto.cellStyleNames.push({
        updatableCellRanges: createDto4CellRangeList(address),
        styleName,
      });
    });
  }

  private undoRemovedStyles(): void {
    this.styleStepDto.removeStyles.forEach((styleName: string) => {
      const styledTable: Table & TableStyles = this.getStyledTable();
      const style: Style | undefined = styledTable.getStyle(styleName);
      style &&
        this.undoStyleStepDto.createStyles.push({
          styleName,
          style: style.getDto(),
        });
    });
  }

  protected updateMergedRegions(): void {
    asTableMergedRegions(this.table)
      ?.getMergedRegions()
      .forEachRegion((region: MergedRegion): void => {
        const regionFrom: number = this.getFromLineId(region);
        const regionTo: number = this.getToLineId(region);
        let newRegion: MergedRegion = region.clone() as MergedRegion;
        for (const lineRange of this.args.selectedLines) {
          const selectionFrom: number = lineRange.getFrom();
          const selectionTo: number = lineRange.getTo();
          const selectionNumberOfLines: number = lineRange.getNumberOfLines();
          if (selectionFrom < regionFrom) {
            if (selectionTo < regionFrom) {
              this.move(newRegion, -selectionNumberOfLines);
              this.updateMergedRegion(region, newRegion);
            } else {
              const tempRegion: MergedRegion = region.clone() as MergedRegion;
              const decreaseFactor: number = selectionTo + 1 - regionFrom;
              this.decrease(tempRegion, decreaseFactor);
              if (this.canRemoveRegion(tempRegion)) {
                this.removeMergedRegion(region);
              } else {
                newRegion = tempRegion;
                const moveFactor: number = selectionTo + 1 - decreaseFactor;
                this.move(newRegion, -moveFactor);
                this.updateMergedRegion(region, newRegion);
              }
            }
          } else if (selectionFrom === regionFrom) {
            this.removeMergedRegion(region);
          } else if (selectionFrom > regionFrom && selectionFrom <= regionTo) {
            let decreaseFactor: number = selectionNumberOfLines;
            if (selectionTo > regionTo) {
              decreaseFactor = regionTo + 1 - selectionFrom;
            }
            this.decrease(newRegion, decreaseFactor);
            this.updateMergedRegion(region, newRegion);
          }
        }
      });
  }

  private canRemoveRegion(region: MergedRegion): boolean {
    const from: CellCoord = region.getFrom();
    const to: CellCoord = region.getTo();
    return (
      from.getRowId() === to.getRowId() && from.getColId() === to.getColId()
    );
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

  private removeMergedRegion(region: MergedRegion): void {
    this.mergedRegionsStepDto.remove4CellCoords.push(region.getFrom().getDto());
    this.undoMergedRegionsStepDto.create4CellRanges.push(region.getDto());
  }
}

export type RowRemoveOperationDtoArgs = Id<'row-remove'> &
  LineRemoveOperationDtoArgs;

export class RowRemoveOperationDtoBuilder extends LineRemoveOperationDtoBuilder {
  constructor(
    protected readonly table: Table,
    protected readonly args: RowRemoveOperationDtoArgs
  ) {
    super(table, args);
  }

  public build(): OperationDto {
    this.update();
    this.undo();
    this.updateMergedRegions();
    const rowRemoveStepDto: RowRemoveOperationStepDto = {
      id: 'row-remove',
      ...this.lineRemoveStepDto,
    };
    const undoRowInsertStepDto: RowInsertOperationStepDto = {
      id: 'row-insert',
      ...this.undoLineInsertStepDto,
    };
    const undoRowHeightStepDto: RowHeightOperationStepDto = {
      id: 'row-height',
      ...this.undoLineDimensionStepDto,
    };
    return {
      id: this.args.id,
      steps: [rowRemoveStepDto, this.styleStepDto, this.mergedRegionsStepDto],
      undoOperation: {
        steps: [
          undoRowInsertStepDto,
          undoRowHeightStepDto,
          this.undoCellValueStepDto,
          this.undoStyleStepDto,
          this.undoMergedRegionsStepDto,
        ],
      },
    };
  }

  protected getTableLinesHelper() {
    return new TableRowsHelper(this.table);
  }

  protected getFromLineId(region: MergedRegion): number {
    return region.getFrom().getRowId();
  }

  protected getToLineId(region: MergedRegion): number {
    return region.getTo().getRowId();
  }

  protected move(region: MergedRegion, rowFactor: number): void {
    region.move(rowFactor, 0);
  }

  protected decrease(region: MergedRegion, rowFactor: number): void {
    region.decrease(rowFactor, 0);
  }
}

export class RowRemoveOperationDtoFactory implements OperationDtoFactory {
  public createOperationDto(
    table: Table,
    args: RowRemoveOperationDtoArgs
  ): OperationDto | Promise<OperationDto> {
    return new RowRemoveOperationDtoBuilder(table, args).build();
  }
}

export type ColumnRemoveOperationDtoArgs = Id<'column-remove'> &
  LineRemoveOperationDtoArgs;

export class ColumnRemoveOperationDtoBuilder extends LineRemoveOperationDtoBuilder {
  constructor(
    protected readonly table: Table,
    protected readonly args: ColumnRemoveOperationDtoArgs
  ) {
    super(table, args);
  }

  public build(): OperationDto {
    this.update();
    this.undo();
    this.updateMergedRegions();
    const columnRemoveStepDto: ColumnRemoveOperationStepDto = {
      id: 'column-remove',
      ...this.lineRemoveStepDto,
    };
    const undoColumnInsertStepDto: ColumnInsertOperationStepDto = {
      id: 'column-insert',
      ...this.undoLineInsertStepDto,
    };
    const undoColumnWidthStepDto: ColumnWidthOperationStepDto = {
      id: 'column-width',
      ...this.undoLineDimensionStepDto,
    };
    return {
      id: this.args.id,
      steps: [
        columnRemoveStepDto,
        this.styleStepDto,
        this.mergedRegionsStepDto,
      ],
      undoOperation: {
        steps: [
          undoColumnInsertStepDto,
          undoColumnWidthStepDto,
          this.undoCellValueStepDto,
          this.undoStyleStepDto,
          this.undoMergedRegionsStepDto,
        ],
      },
    };
  }

  protected getTableLinesHelper() {
    return new TableColumnsHelper(this.table);
  }

  protected getFromLineId(region: MergedRegion): number {
    return region.getFrom().getColId();
  }

  protected getToLineId(region: MergedRegion): number {
    return region.getTo().getColId();
  }

  protected move(region: MergedRegion, colFactor: number): void {
    region.move(0, colFactor);
  }

  protected decrease(region: MergedRegion, colFactor: number): void {
    region.decrease(0, colFactor);
  }
}

export class ColumnRemoveOperationDtoFactory implements OperationDtoFactory {
  public createOperationDto(
    table: Table,
    args: ColumnRemoveOperationDtoArgs
  ): OperationDto | Promise<OperationDto> {
    return new ColumnRemoveOperationDtoBuilder(table, args).build();
  }
}

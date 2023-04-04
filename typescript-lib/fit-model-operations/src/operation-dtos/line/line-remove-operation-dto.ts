import {
  Table,
  Style,
  TableStyles,
  Value,
  CellRange,
  LineRange,
  createLineRangeList4Dto,
  createLineRange4Dto,
  createLineRange,
  createDto4LineRangeList,
  createCellRangeList4Dto,
  createDto4CellRangeList,
  asTableMergedRegions,
  TableBasics,
  asTableStyles,
  TableMergedRegions,
} from 'fit-core/model/index.js';
import {
  OperationDto,
  OperationDtoFactory,
  OperationId,
} from 'fit-core/operations/index.js';

import { CellRangeAddressObjects } from '../../utils/cell/cell-range-address-objects.js';
import { LineRangeAddressObjects } from '../../utils/line/line-range-address-objects.js';
import {
  TableLinesHelper,
  TableRowsHelper,
  TableColsHelper,
} from '../../utils/line/table-lines-helper.js';
import {
  countAllCellStyleNames,
  countSelectedCellStyleNames,
} from '../../utils/style/style-functions.js';
import {
  LineRemoveOperationStepDto,
  MoveLinesDto,
  RowRemoveOperationStepDto,
  ColRemoveOperationStepDto,
} from '../../operation-steps/line/line-remove-operation-step.js';
import {
  LineDimensionOperationStepDto,
  RowHeightOperationStepDto,
  ColWidthOperationStepDto,
  DimensionDto,
} from '../../operation-steps/line/line-dimension-operation-step.js';
import {
  LineInsertOperationStepDto,
  RowInsertOperationStepDto,
  ColInsertOperationStepDto,
} from '../../operation-steps/line/line-insert-operation-step.js';
import { CellValueOperationStepDto } from '../../operation-steps/cell/cell-value-operation-step.js';
import { StyleOperationStepDto } from '../../operation-steps/style/style-operation-step.js';
import {
  IncreaseRegion,
  MergedRegionsOperationStepDto,
  MoveRegion,
} from '../../operation-steps/merged-regions/merged-regions-operation-step.js';

type LineRemoveOperationDtoArgs = {
  selectedLines: LineRange[];
};

abstract class LineRemoveOperationDtoBuilder {
  protected lineRemoveStepDto: LineRemoveOperationStepDto = {
    lineRanges: [],
    moveLines: [],
  };
  protected styleStepDto: StyleOperationStepDto = {
    id: 'style-changes',
    cellStyleNames: [],
    createStyles: [],
    updateStyles: [],
    removeStyles: [],
  };
  protected mergedRegionsStepDto: MergedRegionsOperationStepDto = {
    id: 'merged-regions',
    removeRegions: [],
    moveRegions: [],
    increaseRegions: [],
  };
  protected undoLineInsertStepDto: LineInsertOperationStepDto = {
    numberOfNewLines: 0,
    lineRanges: [],
    moveLines: [],
  };
  protected undoLineDimensionStepDto: LineDimensionOperationStepDto = {
    dimensions: [],
  };
  protected undoCellValueStepDto: CellValueOperationStepDto = {
    id: 'cell-value',
    values: [],
  };
  protected undoStyleStepDto: StyleOperationStepDto = {
    id: 'style-changes',
    cellStyleNames: [],
    createStyles: [],
    updateStyles: [],
    removeStyles: [],
  };
  protected undoMergedRegionsStepDto: MergedRegionsOperationStepDto = {
    id: 'merged-regions',
    createRegions: [],
    moveRegions: [],
    increaseRegions: [],
  };

  protected readonly styledTable?: TableBasics & TableStyles;
  protected readonly mergedRegionsTable?: TableBasics & TableMergedRegions;

  constructor(
    protected readonly table: Table,
    protected readonly args: LineRemoveOperationDtoArgs
  ) {
    this.styledTable = asTableStyles(table);
    this.mergedRegionsTable = asTableMergedRegions(table);
  }

  protected abstract getTableLinesHelper(): TableLinesHelper;
  protected abstract getRegionLineId(rowId: number, colId: number): number;
  protected abstract getLineSpan(rowId: number, colId: number): number;
  protected abstract moveRegion(
    rowId: number,
    colId: number,
    factor: number
  ): void;
  protected abstract increaseRegion(
    rowId: number,
    colId: number,
    factor: number
  ): void;

  protected removeRegion(rowId: number, colId: number): void {
    this.mergedRegionsStepDto.removeRegions?.push({ rowId, colId });
    this.undoMergedRegionsStepDto.createRegions?.push({
      rowId,
      colId,
      rowSpan: this.mergedRegionsTable?.getRowSpan(rowId, colId),
      colSpan: this.mergedRegionsTable?.getColSpan(rowId, colId),
    });
  }

  protected update(): void {
    this.removeLines();
    this.moveLines();
    this.styledTable && this.removeStyles();
  }

  private removeLines(): void {
    this.lineRemoveStepDto.lineRanges = createDto4LineRangeList(
      this.args.selectedLines
    );
  }

  private moveLines(): void {
    const moveLinesDto: MoveLinesDto[] = [];
    const removeLineRangesDto: unknown[] = this.lineRemoveStepDto.lineRanges;
    const removableLines: LineRange[] =
      createLineRangeList4Dto(removeLineRangesDto);
    const sortedLines: LineRange[] = this.sortLineRanges(removableLines);
    const numberOfLines: number = this.getTableLinesHelper().getNumberOfLines();
    let move = 0;
    for (let i = 0; i < sortedLines.length; i++) {
      move += sortedLines[i].getNumberOfLines();
      const from: number = sortedLines[i].getTo() + 1;
      if (from < numberOfLines) {
        const lineRangeDto: unknown = createLineRange(from).getDto();
        moveLinesDto.push({ lineRange: lineRangeDto, move });
      }
      if (i > 0) {
        const lineRangeDto: unknown = moveLinesDto[i - 1].lineRange;
        const to: number = sortedLines[i].getFrom() - 1;
        const lineRange: LineRange =
          createLineRange4Dto(lineRangeDto).setTo(to);
        moveLinesDto[i - 1].lineRange = lineRange.getDto();
      }
    }
    if (moveLinesDto.length > 0) {
      const n: number = moveLinesDto.length - 1;
      const lineRangeDto: unknown = moveLinesDto[n].lineRange;
      const lineRange: LineRange = createLineRange4Dto(lineRangeDto);
      if (lineRange.getTo() === lineRange.getFrom()) {
        lineRange.setTo(numberOfLines - 1);
        moveLinesDto[n].lineRange = lineRange.getDto();
      }
    }
    this.lineRemoveStepDto.moveLines = moveLinesDto;
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
      createCellRangeList4Dto(this.getCellRangeDtos())
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

  private getCellRangeDtos(): unknown[] {
    const cellRangeDtos: unknown[] = [];
    for (const cellStyleNames of this.undoStyleStepDto.cellStyleNames) {
      cellStyleNames.cellRanges.forEach((cellRangeDto: unknown): void => {
        cellRangeDtos.push(cellRangeDto);
      });
    }
    return cellRangeDtos;
  }

  protected undo(): void {
    this.undoLineDimensions();
    this.undoRemovedLines();
    this.undoCellValues();
    this.styledTable && this.undoStyles();
  }

  private undoLineDimensions(): void {
    const oldDimensions: LineRangeAddressObjects<number> =
      new LineRangeAddressObjects();
    for (const lineRangesDto of this.lineRemoveStepDto.lineRanges) {
      createLineRange4Dto(lineRangesDto).forEachLine((lineId: number): void => {
        const helper: TableLinesHelper = this.getTableLinesHelper();
        const dimension: number | undefined = helper.getDimension(lineId);
        dimension && oldDimensions.set(dimension, createLineRange(lineId));
      });
    }
    oldDimensions.forEach(
      (dimension: number, lineRanges?: LineRange[]): void => {
        if (lineRanges) {
          const updatableLineRanges: unknown[] =
            createDto4LineRangeList(lineRanges);
          const dimensionDto: DimensionDto = {
            lineRanges: updatableLineRanges,
            dimension,
          };
          this.undoLineDimensionStepDto.dimensions.push(dimensionDto);
        }
      }
    );
  }

  private undoRemovedLines(): void {
    this.undoLineInsertStepDto.numberOfNewLines = 1;
    this.undoLineInsertStepDto.lineRanges = this.lineRemoveStepDto.lineRanges;
    this.lineRemoveStepDto.moveLines.forEach(
      (movableLines: MoveLinesDto): void => {
        const lineRange: LineRange = //
          createLineRange4Dto(movableLines.lineRange);
        const from: number = lineRange.getFrom() - movableLines.move;
        const to: number = lineRange.getTo() - movableLines.move;
        this.undoLineInsertStepDto.moveLines.push({
          lineRange: createLineRange(from, to).getDto(),
          move: movableLines.move,
        });
      }
    );
  }

  private undoCellValues(): void {
    const oldValues: CellRangeAddressObjects<Value | undefined> =
      new CellRangeAddressObjects();
    this.lineRemoveStepDto.lineRanges.forEach(
      (removableLineRange: unknown): void => {
        this.getTableLinesHelper().forEachLineCell(
          createLineRange4Dto(removableLineRange),
          (rowId: number, colId: number): void => {
            const value: Value | undefined = //
              this.table.getCellValue(rowId, colId);
            value && oldValues.set(value, rowId, colId);
          }
        );
      }
    );
    oldValues.forEach(
      (value: Value | undefined, address: CellRange[]): void => {
        const cellRanges: unknown[] = createDto4CellRangeList(address);
        this.undoCellValueStepDto.values.push({ cellRanges, value });
      }
    );
  }

  private undoStyles(): void {
    this.undoRemovedCellStyleNames();
    this.undoRemovedStyles();
  }

  private undoRemovedCellStyleNames(): void {
    const oldStyleNames: CellRangeAddressObjects<string> =
      new CellRangeAddressObjects();
    this.lineRemoveStepDto.lineRanges.forEach(
      (removableLineRange: unknown): void => {
        this.getTableLinesHelper().forEachLineCell(
          createLineRange4Dto(removableLineRange),
          (rowId: number, colId: number): void => {
            const styleName: string | undefined = //
              this.styledTable?.getCellStyleName(rowId, colId);
            styleName && oldStyleNames.set(styleName, rowId, colId);
          }
        );
      }
    );
    oldStyleNames.forEach((styleName: string, address: CellRange[]) => {
      this.undoStyleStepDto.cellStyleNames.push({
        cellRanges: createDto4CellRangeList(address),
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
    this.mergedRegionsTable?.forEachMergedCell(
      (rowId: number, colId: number): void => {
        const regionFrom: number = this.getRegionLineId(rowId, colId);
        const lineSpan: number = this.getLineSpan(rowId, colId);
        const regionTo: number = lineSpan
          ? regionFrom + lineSpan - 1
          : regionFrom;
        for (const lineRange of this.args.selectedLines) {
          const selectionFrom: number = lineRange.getFrom();
          const selectionTo: number = lineRange.getTo();
          const selectionNumberOfLines: number = lineRange.getNumberOfLines();
          if (selectionFrom < regionFrom) {
            if (selectionTo < regionFrom) {
              this.moveRegion(rowId, colId, -selectionNumberOfLines);
            } else {
              this.removeRegion(rowId, colId);
            }
          } else if (selectionFrom === regionFrom) {
            this.removeRegion(rowId, colId);
          } else if (selectionFrom > regionFrom && selectionFrom <= regionTo) {
            let decreaseFactor: number = selectionNumberOfLines;
            if (selectionTo > regionTo) {
              decreaseFactor = regionTo + 1 - selectionFrom;
            }
            this.increaseRegion(rowId, colId, -decreaseFactor);
          }
        }
      }
    );
    this.adjustUndoMergedRegionsWithMoveFactor();
  }

  private adjustUndoMergedRegionsWithMoveFactor(): void {
    for (const mr of this.mergedRegionsStepDto.moveRegions ?? []) {
      this.undoMergedRegionsStepDto.moveRegions?.forEach(
        (umr: MoveRegion): void => {
          if (mr.rowId === umr.rowId && mr.colId === umr.colId) {
            umr.rowId += mr.moveRow;
            umr.colId += mr.moveCol;
          }
        }
      );
      this.undoMergedRegionsStepDto.increaseRegions?.forEach(
        (uir: IncreaseRegion): void => {
          if (mr.rowId === uir.rowId && mr.colId === uir.colId) {
            uir.rowId += mr.moveRow;
            uir.colId += mr.moveCol;
          }
        }
      );
    }
  }
}

export type RowRemoveOperationDtoArgs = OperationId<'row-remove'> &
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

  protected getRegionLineId(rowId: number): number {
    return rowId;
  }

  protected getLineSpan(rowId: number, colId: number): number {
    return this.mergedRegionsTable?.getRowSpan(rowId, colId) ?? 0;
  }

  protected moveRegion(rowId: number, colId: number, moveRow: number): void {
    this.mergedRegionsStepDto.moveRegions?.push({
      rowId,
      colId,
      moveRow,
      moveCol: 0,
    });
    this.undoMergedRegionsStepDto.moveRegions?.push({
      rowId,
      colId,
      moveRow: -moveRow,
      moveCol: 0,
    });
  }

  protected increaseRegion(
    rowId: number,
    colId: number,
    increaseRow: number
  ): void {
    this.mergedRegionsStepDto.increaseRegions?.push({
      rowId,
      colId,
      increaseRow,
      increaseCol: 0,
    });
    this.undoMergedRegionsStepDto.increaseRegions?.push({
      rowId,
      colId,
      increaseRow: -increaseRow,
      increaseCol: 0,
    });
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

export type ColRemoveOperationDtoArgs = OperationId<'column-remove'> &
  LineRemoveOperationDtoArgs;

export class ColRemoveOperationDtoBuilder extends LineRemoveOperationDtoBuilder {
  constructor(
    protected readonly table: Table,
    protected readonly args: ColRemoveOperationDtoArgs
  ) {
    super(table, args);
  }

  public build(): OperationDto {
    this.update();
    this.undo();
    this.updateMergedRegions();
    const colRemoveStepDto: ColRemoveOperationStepDto = {
      id: 'column-remove',
      ...this.lineRemoveStepDto,
    };
    const undoColInsertStepDto: ColInsertOperationStepDto = {
      id: 'column-insert',
      ...this.undoLineInsertStepDto,
    };
    const undoColWidthStepDto: ColWidthOperationStepDto = {
      id: 'column-width',
      ...this.undoLineDimensionStepDto,
    };
    return {
      id: this.args.id,
      steps: [colRemoveStepDto, this.styleStepDto, this.mergedRegionsStepDto],
      undoOperation: {
        steps: [
          undoColInsertStepDto,
          undoColWidthStepDto,
          this.undoCellValueStepDto,
          this.undoStyleStepDto,
          this.undoMergedRegionsStepDto,
        ],
      },
    };
  }

  protected getTableLinesHelper() {
    return new TableColsHelper(this.table);
  }

  protected getRegionLineId(rowId: number, colId: number): number {
    return colId;
  }

  protected getLineSpan(rowId: number, colId: number): number {
    return this.mergedRegionsTable?.getColSpan(rowId, colId) ?? 0;
  }

  protected moveRegion(rowId: number, colId: number, moveCol: number): void {
    this.mergedRegionsStepDto.moveRegions?.push({
      rowId,
      colId,
      moveRow: 0,
      moveCol,
    });
    this.undoMergedRegionsStepDto.moveRegions?.push({
      rowId,
      colId: colId + moveCol,
      moveRow: 0,
      moveCol: -moveCol,
    });
  }

  protected increaseRegion(
    rowId: number,
    colId: number,
    increaseCol: number
  ): void {
    this.mergedRegionsStepDto.increaseRegions?.push({
      rowId,
      colId,
      increaseRow: 0,
      increaseCol,
    });
    this.undoMergedRegionsStepDto.increaseRegions?.push({
      rowId,
      colId,
      increaseRow: 0,
      increaseCol: -increaseCol,
    });
  }
}

export class ColRemoveOperationDtoFactory implements OperationDtoFactory {
  public createOperationDto(
    table: Table,
    args: ColRemoveOperationDtoArgs
  ): OperationDto | Promise<OperationDto> {
    return new ColRemoveOperationDtoBuilder(table, args).build();
  }
}

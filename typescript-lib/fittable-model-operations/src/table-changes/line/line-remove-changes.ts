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
  DataType,
  asTableDataTypes,
  TableDataTypes,
  TableDataRefs,
  asTableDataRefs,
} from 'fittable-core/model';
import {
  TableChanges,
  TableChangesFactory,
  Args,
} from 'fittable-core/operations';

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
  LineRemoveChange,
  MoveLinesItem,
  RowRemoveChange,
  ColRemoveChange,
} from '../../table-change-writter/line/line-remove-change-writter.js';
import {
  LineDimensionChange,
  RowHeighChange,
  ColWidthChange,
  DimensionItem,
} from '../../table-change-writter/line/line-dimension-change-writter.js';
import {
  LineInsertChange,
  RowInsertChange,
  ColInsertChange,
} from '../../table-change-writter/line/line-insert-change-writter.js';
import { CellValueChange } from '../../table-change-writter/cell/cell-value-change-writter.js';
import { DataTypeChange } from '../../table-change-writter/cell/cell-data-type-change-writter.js';
import { StyleChange } from '../../table-change-writter/style/style-change-writter.js';
import {
  IncreaseRegionItem,
  MergedRegionsChange,
  MoveRegionItem,
} from '../../table-change-writter/merged-regions/merged-regions-change-writter.js';
import { CellDataRefChange } from '../../table-change-writter/cell/cell-data-ref-change-writter.js';

type LineRemoveArgs = {
  selectedLines: LineRange[];
};

abstract class LineRemoveChangesBuilder {
  protected lineRemoveChange: LineRemoveChange = {
    lineRanges: [],
    moveLines: [],
  };
  protected styleChange: StyleChange = {
    id: 'style-update',
    cellStyleNames: [],
    createStyles: [],
    updateStyles: [],
    removeStyles: [],
  };
  protected mergedRegionsChange: MergedRegionsChange = {
    id: 'merged-regions',
    removeRegions: [],
    moveRegions: [],
    increaseRegions: [],
  };
  protected lineInsertUndoChange: LineInsertChange = {
    numberOfNewLines: 0,
    lineRanges: [],
    moveLines: [],
  };
  protected lineDimensionUndoChange: LineDimensionChange = {
    items: [],
  };
  protected cellValueUndoChange: CellValueChange = {
    id: 'cell-value',
    items: [],
  };
  protected dataTypeUndoChange: DataTypeChange = {
    id: 'cell-data-type',
    items: [],
  };
  protected celldataRefUndoChange: CellDataRefChange = {
    id: 'cell-data-ref',
    items: [],
  };
  protected styleUndoChange: StyleChange = {
    id: 'style-update',
    cellStyleNames: [],
    createStyles: [],
    updateStyles: [],
    removeStyles: [],
  };
  protected mergedRegionsUndoChange: MergedRegionsChange = {
    id: 'merged-regions',
    createRegions: [],
    moveRegions: [],
    increaseRegions: [],
  };

  protected readonly tableCellDataType?: TableBasics & TableDataTypes;
  protected readonly tableDataRefs?: TableBasics & TableDataRefs;
  protected readonly tableStyles?: TableBasics & TableStyles;
  protected readonly tableMergedRegions?: TableBasics & TableMergedRegions;

  constructor(
    protected readonly table: Table,
    protected readonly args: LineRemoveArgs
  ) {
    this.tableCellDataType = asTableDataTypes(table);
    this.tableDataRefs = asTableDataRefs(table);
    this.tableStyles = asTableStyles(table);
    this.tableMergedRegions = asTableMergedRegions(table);
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
    this.mergedRegionsChange.removeRegions?.push({ rowId, colId });
    this.mergedRegionsUndoChange.createRegions?.push({
      rowId,
      colId,
      rowSpan: this.tableMergedRegions?.getRowSpan(rowId, colId),
      colSpan: this.tableMergedRegions?.getColSpan(rowId, colId),
    });
  }

  protected update(): void {
    this.removeLines();
    this.moveLines();
    this.tableStyles && this.removeStyles();
  }

  private removeLines(): void {
    this.lineRemoveChange.lineRanges = createDto4LineRangeList(
      this.args.selectedLines
    );
  }

  private moveLines(): void {
    const moveLinesDto: MoveLinesItem[] = [];
    const removeLineRangesDto: unknown[] = this.lineRemoveChange.lineRanges;
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
        moveLinesDto.push({ lineRange: lineRangeDto, move: -1 * move });
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
    this.lineRemoveChange.moveLines = moveLinesDto;
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
          this.styleChange.removeStyles.push(styleName);
        }
      }
    );
  }

  private getStyledTable(): Table & TableStyles {
    return this.table as Table & TableStyles;
  }

  private getCellRangeDtos(): unknown[] {
    const cellRangeDtos: unknown[] = [];
    for (const cellStyleNames of this.styleUndoChange.cellStyleNames) {
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
    this.undoDataTypes();
    this.undoCellDataRefs();
    this.undoStyles();
  }

  private undoLineDimensions(): void {
    const oldDimensions: LineRangeAddressObjects<number> =
      new LineRangeAddressObjects();
    for (const lineRangesDto of this.lineRemoveChange.lineRanges) {
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
          const dimensionDto: DimensionItem = {
            lineRanges: updatableLineRanges,
            dimension,
          };
          this.lineDimensionUndoChange.items.push(dimensionDto);
        }
      }
    );
  }

  private undoRemovedLines(): void {
    this.lineInsertUndoChange.numberOfNewLines = 1;
    this.lineInsertUndoChange.lineRanges = this.lineRemoveChange.lineRanges;
    this.lineRemoveChange.moveLines.forEach(
      (movableLines: MoveLinesItem): void => {
        const lineRange: LineRange = //
          createLineRange4Dto(movableLines.lineRange);
        const move: number = -1 * movableLines.move;
        const from: number = lineRange.getFrom() - move;
        const to: number = lineRange.getTo() - move;
        this.lineInsertUndoChange.moveLines.push({
          lineRange: createLineRange(from, to).getDto(),
          move,
        });
      }
    );
  }

  private undoCellValues(): void {
    const oldValues: CellRangeAddressObjects<Value | undefined> =
      new CellRangeAddressObjects();
    this.lineRemoveChange.lineRanges.forEach(
      (removableLineRange: unknown): void => {
        this.getTableLinesHelper().forEachLineCell(
          createLineRange4Dto(removableLineRange),
          (rowId: number, colId: number): void => {
            const value: Value | undefined = //
              this.table.getCellValue(rowId, colId);
            value !== undefined && oldValues.set(value, rowId, colId);
          }
        );
      }
    );
    oldValues.forEach(
      (value: Value | undefined, address: CellRange[]): void => {
        const cellRanges: unknown[] = createDto4CellRangeList(address);
        this.cellValueUndoChange.items.push({ cellRanges, value });
      }
    );
  }

  private undoDataTypes(): void {
    if (!this.tableCellDataType) return;
    const oldDataTypes: CellRangeAddressObjects<DataType | undefined> =
      new CellRangeAddressObjects();
    this.lineRemoveChange.lineRanges.forEach(
      (removableLineRange: unknown): void => {
        this.getTableLinesHelper().forEachLineCell(
          createLineRange4Dto(removableLineRange),
          (rowId: number, colId: number): void => {
            const dataType: DataType | undefined = //
              this.tableCellDataType?.getCellDataType(rowId, colId);
            dataType !== undefined && oldDataTypes.set(dataType, rowId, colId);
          }
        );
      }
    );
    oldDataTypes.forEach(
      (dataType: DataType | undefined, address: CellRange[]): void => {
        this.dataTypeUndoChange.items.push({
          cellRanges: createDto4CellRangeList(address),
          dataType: dataType?.getDto()
        });
      }
    );
  }

  private undoCellDataRefs(): void {
    if (!this.tableDataRefs) return;
    const oldCellDataRefs: CellRangeAddressObjects<string | undefined> =
      new CellRangeAddressObjects();
    this.lineRemoveChange.lineRanges.forEach(
      (removableLineRange: unknown): void => {
        this.getTableLinesHelper().forEachLineCell(
          createLineRange4Dto(removableLineRange),
          (rowId: number, colId: number): void => {
            const dataRef: string | undefined = this.tableDataRefs?.getCellDataRef(rowId, colId);
            dataRef !== undefined && oldCellDataRefs.set(dataRef, rowId, colId);
          }
        );
      }
    );
    oldCellDataRefs.forEach(
      (dataRef: string | undefined, address: CellRange[]): void => {
        this.celldataRefUndoChange.items.push({
          cellRanges: createDto4CellRangeList(address),
          dataRef
        });
      }
    );
  }

  private undoStyles(): void {
    if (!this.tableStyles) return;
    this.undoRemovedCellStyleNames();
    this.undoRemovedStyles();
  }

  private undoRemovedCellStyleNames(): void {
    const oldStyleNames: CellRangeAddressObjects<string> =
      new CellRangeAddressObjects();
    this.lineRemoveChange.lineRanges.forEach(
      (removableLineRange: unknown): void => {
        this.getTableLinesHelper().forEachLineCell(
          createLineRange4Dto(removableLineRange),
          (rowId: number, colId: number): void => {
            const styleName: string | undefined = //
              this.tableStyles?.getCellStyleName(rowId, colId);
            styleName && oldStyleNames.set(styleName, rowId, colId);
          }
        );
      }
    );
    oldStyleNames.forEach((styleName: string, address: CellRange[]) => {
      this.styleUndoChange.cellStyleNames.push({
        cellRanges: createDto4CellRangeList(address),
        styleName,
      });
    });
  }

  private undoRemovedStyles(): void {
    this.styleChange.removeStyles.forEach((styleName: string) => {
      const styledTable: Table & TableStyles = this.getStyledTable();
      const style: Style | undefined = styledTable.getStyle(styleName);
      style &&
        this.styleUndoChange.createStyles.push({
          styleName,
          style: style.getDto(),
        });
    });
  }

  protected updateMergedRegions(): void {
    this.tableMergedRegions?.forEachMergedCell(
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
    for (const mr of this.mergedRegionsChange.moveRegions ?? []) {
      this.mergedRegionsUndoChange.moveRegions?.forEach(
        (umr: MoveRegionItem): void => {
          if (mr.rowId === umr.rowId && mr.colId === umr.colId) {
            umr.rowId += mr.moveRow;
            umr.colId += mr.moveCol;
          }
        }
      );
      this.mergedRegionsUndoChange.increaseRegions?.forEach(
        (uir: IncreaseRegionItem): void => {
          if (mr.rowId === uir.rowId && mr.colId === uir.colId) {
            uir.rowId += mr.moveRow;
            uir.colId += mr.moveCol;
          }
        }
      );
    }
  }
}

export type RowRemoveArgs = Args<'row-remove'> & LineRemoveArgs;

export class RowRemoveChangesBuilder extends LineRemoveChangesBuilder {
  constructor(
    protected readonly table: Table,
    protected readonly args: RowRemoveArgs
  ) {
    super(table, args);
  }

  public build(): TableChanges {
    this.update();
    this.undo();
    this.updateMergedRegions();
    const rowRemoveChange: RowRemoveChange = {
      id: 'row-remove',
      ...this.lineRemoveChange,
    };
    const rowInsertUndoChange: RowInsertChange = {
      id: 'row-insert',
      ...this.lineInsertUndoChange,
    };
    const rowHeightUndoChange: RowHeighChange = {
      id: 'row-height',
      ...this.lineDimensionUndoChange,
    };
    return {
      id: this.args.id,
      changes: [rowRemoveChange, this.styleChange, this.mergedRegionsChange],
      undoChanges: {
        changes: [
          rowInsertUndoChange,
          rowHeightUndoChange,
          this.cellValueUndoChange,
          this.dataTypeUndoChange,
          this.celldataRefUndoChange,
          this.styleUndoChange,
          this.mergedRegionsUndoChange,
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
    return this.tableMergedRegions?.getRowSpan(rowId, colId) ?? 0;
  }

  protected moveRegion(rowId: number, colId: number, moveRow: number): void {
    this.mergedRegionsChange.moveRegions?.push({
      rowId,
      colId,
      moveRow,
      moveCol: 0,
    });
    this.mergedRegionsUndoChange.moveRegions?.push({
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
    this.mergedRegionsChange.increaseRegions?.push({
      rowId,
      colId,
      increaseRow,
      increaseCol: 0,
    });
    this.mergedRegionsUndoChange.increaseRegions?.push({
      rowId,
      colId,
      increaseRow: -increaseRow,
      increaseCol: 0,
    });
  }
}

export class RowRemoveChangesFactory implements TableChangesFactory {
  public createTableChanges(
    table: Table,
    args: RowRemoveArgs
  ): TableChanges | Promise<TableChanges> {
    return new RowRemoveChangesBuilder(table, args).build();
  }
}

export type ColRemoveArgs = Args<'column-remove'> & LineRemoveArgs;

export class ColRemoveChangesBuilder extends LineRemoveChangesBuilder {
  constructor(
    protected readonly table: Table,
    protected readonly args: ColRemoveArgs
  ) {
    super(table, args);
  }

  public build(): TableChanges {
    this.update();
    this.undo();
    this.updateMergedRegions();
    const colRemoveChange: ColRemoveChange = {
      id: 'column-remove',
      ...this.lineRemoveChange,
    };
    const colInsertUndoChange: ColInsertChange = {
      id: 'column-insert',
      ...this.lineInsertUndoChange,
    };
    const colWidthUndoChange: ColWidthChange = {
      id: 'column-width',
      ...this.lineDimensionUndoChange,
    };
    return {
      id: this.args.id,
      changes: [colRemoveChange, this.styleChange, this.mergedRegionsChange],
      undoChanges: {
        changes: [
          colInsertUndoChange,
          colWidthUndoChange,
          this.cellValueUndoChange,
          this.dataTypeUndoChange,
          this.celldataRefUndoChange,
          this.styleUndoChange,
          this.mergedRegionsUndoChange,
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
    return this.tableMergedRegions?.getColSpan(rowId, colId) ?? 0;
  }

  protected moveRegion(rowId: number, colId: number, moveCol: number): void {
    this.mergedRegionsChange.moveRegions?.push({
      rowId,
      colId,
      moveRow: 0,
      moveCol,
    });
    this.mergedRegionsUndoChange.moveRegions?.push({
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
    this.mergedRegionsChange.increaseRegions?.push({
      rowId,
      colId,
      increaseRow: 0,
      increaseCol,
    });
    this.mergedRegionsUndoChange.increaseRegions?.push({
      rowId,
      colId,
      increaseRow: 0,
      increaseCol: -increaseCol,
    });
  }
}

export class ColRemoveChangesFactory implements TableChangesFactory {
  public createTableChanges(
    table: Table,
    args: ColRemoveArgs
  ): TableChanges | Promise<TableChanges> {
    return new ColRemoveChangesBuilder(table, args).build();
  }
}

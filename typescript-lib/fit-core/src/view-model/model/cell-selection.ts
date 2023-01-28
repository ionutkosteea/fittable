import { Subject, Observable } from 'rxjs';

import { CellCoord } from '../../model/cell-coord.js';
import { CellRange } from '../../model/cell-range.js';
import { getViewModelConfig } from '../view-model-config.js';
import { NeighborCells } from './common/neighbor-cells.js';
import { Rectangle } from './common/rectangle.js';
import { FocusableObject } from './controls.js';
import { TableViewer } from './table-viewer.js';

export interface CellSelectionRanges extends FocusableObject {
  createRange(): this;
  addRange(firstCell: CellCoord, lastCell?: CellCoord): this;
  getRanges(): CellRange[];
  removeRanges(): this;
  removePreviousRanges(): this;
  addCell(cellCoord: CellCoord): this;
  onAfterAddCell$(): Observable<CellCoord>;
  hasCell(cellCoord: CellCoord): boolean;
  getFirstCell(): CellCoord | undefined;
  getLastCell(): CellCoord | undefined;
  getNeighborCells(): NeighborCells;
  end(): this;
  addOnEnd$(onEnd$: Subject<CellRange[]>): this;
}

export interface CellSelection {
  rowHeader?: CellSelectionRanges;
  colHeader?: CellSelectionRanges;
  pageHeader?: CellSelectionRanges;
  body: CellSelectionRanges;
  clear(): this;
  destroy(): void;
}

export interface CellSelectionFactory {
  createCellSelection(tableViewer: TableViewer): CellSelection;
}

export function createCellSelection(tableViewer: TableViewer): CellSelection {
  const factory: CellSelectionFactory | undefined =
    getViewModelConfig().cellSelectionFactory;
  if (factory) return factory.createCellSelection(tableViewer);
  else throw new Error('CellSelectionFactory is not defined!');
}

export interface CellSelectionRectangles {
  paint(cellSelection: CellSelectionRanges): this;
  getRectangles(): Rectangle[];
}

export interface CellSelectionPainter {
  rowHeader?: CellSelectionRectangles;
  colHeader?: CellSelectionRectangles;
  pageHeader?: CellSelectionRectangles;
  body: CellSelectionRectangles;
  paint(): this;
  destroy(): void;
}

export interface CellSelectionPainterFactory {
  createCellSelectionPainter(
    tableViewer: TableViewer,
    cellSelection: CellSelection
  ): CellSelectionPainter;
}

export function createCellSelectionPainter(
  tableViewer: TableViewer,
  cellSelection: CellSelection
): CellSelectionPainter {
  const factory: CellSelectionPainterFactory | undefined =
    getViewModelConfig().cellSelectionPainterFactory;
  if (factory) {
    return factory.createCellSelectionPainter(tableViewer, cellSelection);
  } else {
    throw new Error('CellSelectionPainterFactory is not defined!');
  }
}

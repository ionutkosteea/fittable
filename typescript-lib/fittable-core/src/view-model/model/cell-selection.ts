import { Observable } from 'rxjs';

import { MissingFactoryError } from '../../common/factory-error.js';
import { CellCoord } from '../../model/cell-coord.js';
import { CellRange } from '../../model/cell-range.js';
import { getViewModelConfig } from '../view-model-config.js';
import { NeighborCells } from './common/neighbor-cells.js';
import { Rectangle } from './common/rectangle.js';
import { FocusableObject } from './controls.js';
import { ScrollContainer } from './scroll-container.js';
import { TableViewer } from './table-viewer.js';

export interface CellSelectionRanges extends FocusableObject {
  name: string;
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
  onEnd$(): Observable<CellRange[]>;
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
  else throw new MissingFactoryError();
}

export interface CellSelectionRectangles {
  paint(cellSelection: CellSelectionRanges): this;
  onAfterPaint$(): Observable<void>;
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

export type CellSelectionPainterArgs = {
  tableViewer: TableViewer;
  tableScrollContainer: ScrollContainer;
  cellSelection: CellSelection;
};

export interface CellSelectionPainterFactory {
  createCellSelectionPainter(
    args: CellSelectionPainterArgs
  ): CellSelectionPainter;
}

export function createCellSelectionPainter(
  args: CellSelectionPainterArgs
): CellSelectionPainter {
  const factory: CellSelectionPainterFactory | undefined =
    getViewModelConfig().cellSelectionPainterFactory;
  if (factory) return factory.createCellSelectionPainter(args);
  else throw new MissingFactoryError();
}

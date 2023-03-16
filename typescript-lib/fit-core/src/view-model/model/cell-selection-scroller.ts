import { MissingFactoryError } from '../../common/factory-error.js';
import { getViewModelConfig } from '../view-model-config.js';
import { ScrollContainer } from './scroll-container.js';
import { TableViewer } from './table-viewer.js';

export type ScrollDirection = 'Left' | 'Up' | 'Right' | 'Down';

export interface CellSelectionScroller {
  setRowId(rowId: number): this;
  setColId(colId: number): this;
  setScrollDirection(direction: ScrollDirection): this;
  scroll(): this;
}

export interface CellSelectionScrollerFactory {
  createCellSelectionScroller(
    tableViewer: TableViewer,
    tableScroller: ScrollContainer
  ): CellSelectionScroller;
}

export function createCellSelectionScroller(
  tableViewer: TableViewer,
  tableScroller: ScrollContainer
): CellSelectionScroller {
  const factory: CellSelectionScrollerFactory | undefined =
    getViewModelConfig().cellSelectionScrollerFactory;
  if (factory)
    return factory.createCellSelectionScroller(tableViewer, tableScroller);
  else throw new MissingFactoryError();
}

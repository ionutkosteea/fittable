import { RangeIterator } from '../../common/range-iterator.js';
import { getViewModelConfig } from '../view-model-config.js';
import { TableViewer } from './table-viewer.js';

export interface Scrollbar {
  setViewport(viewport: number): this;
  renderTable(scrollPosition: number): this;
  renderMergedRegions(): this;
  getOffset(): number;
  getFirstRenderableLine(): number;
  getLastRenderableLine(): number;
}

export interface TableScrollerCore {
  clientHeight: number;
  clientWidth: number;
  scrollLeft: number;
  scrollTop: number;
  scrollTo(left: number, top: number): void;
}

export interface TableScroller {
  init(core: TableScrollerCore): this;
  getHeight(): number;
  getWidth(): number;
  scrollTo(left: number, top: number): void;
  getLeft(): number;
  getTop(): number;
  setVerticalScrollbar(scrollbar?: Scrollbar): this;
  getVerticalScrollbar(): Scrollbar | undefined;
  setHorizontalScrollbar(scrollbar?: Scrollbar): this;
  getHorizontalScrollbar(): Scrollbar | undefined;
  resizeViewportWidth(): this;
  resizeViewportHeight(): this;
  getTableRowIds(): RangeIterator;
  getTableColIds(): RangeIterator;
  renderTable(): this;
  renderMergedRegions(): this;
}

export interface TableScrollerFactory {
  createTableScroller(tableViewer: TableViewer): TableScroller;
}

export function createTableScroller(tableViewer: TableViewer): TableScroller {
  return getViewModelConfig().tableScrollerFactory.createTableScroller(
    tableViewer
  );
}

import { Observable } from 'rxjs';

import { RangeIterator } from '../../common/range-iterator.js';
import { getViewModelConfig } from '../view-model-config.js';
import { Size } from './controls.js';

export interface Scrollbar {
  setViewport(viewport: number): this;
  renderModel(scrollPosition: number): this;
  renderMergedLines(): this;
  getOffset(): number;
  getFirstRenderableLine(): number;
  getLastRenderableLine(): number;
}

export interface Scroller {
  getLeft: () => number;
  getTop: () => number;
  scroll: (left: number, top: number) => void;
}

export interface ScrollContainer {
  getSize(): Size;
  setSize(size: Size): this;
  getScroller(): Scroller;
  setScroller(scroller: Scroller): this;
  setVerticalScrollbar(scrollbar?: Scrollbar): this;
  getVerticalScrollbar(): Scrollbar | undefined;
  setHorizontalScrollbar(scrollbar?: Scrollbar): this;
  getHorizontalScrollbar(): Scrollbar | undefined;
  getInnerOffsetX(): number;
  getInnerOffsetY(): number;
  getRenderableRows(): RangeIterator;
  getRenderableCols(): RangeIterator;
  renderModel(): this;
  onAfterRenderModel$(): Observable<void>;
  renderMergedRegions(): this;
}

export interface ScrollContainerArgs {
  getNumberOfRows(): number;
  getNumberOfCols(): number;
}

export interface ScrollContainerFactory {
  createScrollContainer(args?: ScrollContainerArgs): ScrollContainer;
}

export function createScrollContainer(
  args?: ScrollContainerArgs
): ScrollContainer {
  return getViewModelConfig() //
    .scrollContainerFactory.createScrollContainer(args);
}

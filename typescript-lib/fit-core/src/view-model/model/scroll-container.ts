import { Observable } from 'rxjs';

import { RangeIterator } from '../../common/range-iterator.js';
import { getViewModelConfig } from '../view-model-config.js';

export interface Scrollbar {
  setViewport(viewport: number): this;
  renderModel(scrollPosition: number): this;
  renderMergedLines(): this;
  getOffset(): number;
  getFirstRenderableLine(): number;
  getLastRenderableLine(): number;
}

export interface ScrollElement {
  clientHeight: number;
  clientWidth: number;
  scrollLeft: number;
  scrollTop: number;
  scrollTo(left: number, top: number): void;
}

export interface ScrollContainer {
  init(element: ScrollElement): this;
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
  getOffsetX(): number;
  getOffsetY(): number;
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

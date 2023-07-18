import { Observable } from 'rxjs';

import { RangeIterator } from '../../../dist/common/range-iterator.js';
import {
  FitHtmlDivElement,
  FitHtmlElement,
  ScrollContainer,
  Scrollbar,
  Scroller,
  Size,
} from '../../../dist/view-model/index.js';

export class TstScrollElement implements FitHtmlDivElement {
  clientHeight = 0;
  clientWidth = 0;
  scrollLeft = 0;
  scrollTop = 0;
  scrollTo(left: number, top: number): void {
    throw new Error('Method not implemented.');
  }
  parentElement: FitHtmlElement | null = null;
  tagName = 'div';
  getAttribute(name: string): string | null {
    throw new Error('Method not implemented.');
  }
}

export class TstScrollContainer implements ScrollContainer {
  getSize(): Size {
    throw new Error('Method not implemented.');
  }
  setSize(size: Size): this {
    throw new Error('Method not implemented.');
  }
  getScroller(): Scroller {
    throw new Error('Method not implemented.');
  }
  setScroller(scroller: Scroller): this {
    throw new Error('Method not implemented.');
  }
  setVerticalScrollbar(scrollbar?: Scrollbar | undefined): this {
    throw new Error('Method not implemented.');
  }
  getVerticalScrollbar(): Scrollbar | undefined {
    throw new Error('Method not implemented.');
  }
  setHorizontalScrollbar(scrollbar?: Scrollbar | undefined): this {
    throw new Error('Method not implemented.');
  }
  getHorizontalScrollbar(): Scrollbar | undefined {
    throw new Error('Method not implemented.');
  }
  getInnerOffsetX(): number {
    throw new Error('Method not implemented.');
  }
  getInnerOffsetY(): number {
    throw new Error('Method not implemented.');
  }
  getRenderableRows(): RangeIterator {
    throw new Error('Method not implemented.');
  }
  getRenderableCols(): RangeIterator {
    throw new Error('Method not implemented.');
  }
  renderModel(): this {
    throw new Error('Method not implemented.');
  }
  onAfterRenderModel$(): Observable<void> {
    throw new Error('Method not implemented.');
  }
  renderMergedRegions(): this {
    throw new Error('Method not implemented.');
  }
}

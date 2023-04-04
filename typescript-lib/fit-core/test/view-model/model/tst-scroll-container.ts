import { Observable } from 'rxjs';

import { RangeIterator } from '../../../dist/common/range-iterator.js';
import {
  ScrollElement,
  ScrollContainer,
  Scrollbar,
} from '../../../dist/view-model/index.js';

export class TstScrollElement implements ScrollElement {
  clientHeight = 0;
  clientWidth = 0;
  scrollLeft = 0;
  scrollTop = 0;
  scrollTo(left: number, top: number): void {
    throw new Error('Method not implemented.');
  }
}

export class TstScrollContainer implements ScrollContainer {
  init(element: ScrollElement): this {
    throw new Error('Method not implemented.');
  }
  getHeight(): number {
    throw new Error('Method not implemented.');
  }
  getWidth(): number {
    throw new Error('Method not implemented.');
  }
  scrollTo(left: number, top: number): void {
    throw new Error('Method not implemented.');
  }
  getLeft(): number {
    throw new Error('Method not implemented.');
  }
  getTop(): number {
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
  resizeViewportWidth(): this {
    throw new Error('Method not implemented.');
  }
  resizeViewportHeight(): this {
    throw new Error('Method not implemented.');
  }
  getOffsetX(): number {
    throw new Error('Method not implemented.');
  }
  getOffsetY(): number {
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

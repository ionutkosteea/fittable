import { Observable, Subject } from 'rxjs';

import { RangeIterator } from 'fittable-core/common';
import {
  Scrollbar,
  ScrollContainer,
  ScrollContainerFactory,
  TableViewer,
  ScrollContainerArgs,
  Size,
  Scroller,
} from 'fittable-core/view-model';

export class FitScrollContainer implements ScrollContainer {
  private scroller: Scroller = new FitScroller(0, 0);
  private size: Size = new FitSize(0, 0);
  private verticalScrollbar?: Scrollbar;
  private horizontalScrollbar?: Scrollbar;
  private readonly afterRenderModel$: Subject<void> = new Subject();

  constructor(private readonly args?: ScrollContainerArgs) {}

  public getScroller(): Scroller {
    return this.scroller;
  }

  public setScroller(scroller: Scroller): this {
    this.scroller = scroller;
    return this;
  }

  public getSize(): Size {
    return this.size;
  }

  public setSize(size: Size): this {
    this.size = size;
    return this;
  }

  public setVerticalScrollbar(scrollbar?: Scrollbar): this {
    this.verticalScrollbar = scrollbar;
    return this;
  }

  public getVerticalScrollbar(): Scrollbar | undefined {
    return this.verticalScrollbar;
  }

  public setHorizontalScrollbar(scrollbar?: Scrollbar): this {
    this.horizontalScrollbar = scrollbar;
    return this;
  }

  public getHorizontalScrollbar(): Scrollbar | undefined {
    return this.horizontalScrollbar;
  }

  public getInnerOffsetX(): number {
    return this.horizontalScrollbar?.getOffset() ?? 0;
  }

  public getInnerOffsetY(): number {
    return this.verticalScrollbar?.getOffset() ?? 0;
  }

  public getRenderableRows(): RangeIterator {
    const from: number = this.getFirstRenderableRow();
    const to: number = this.getLastRenderableRow();
    return new RangeIterator(from, to);
  }

  private getFirstRenderableRow(): number {
    return this.verticalScrollbar?.getFirstRenderableLine() ?? 0;
  }

  private getLastRenderableRow(): number {
    const scrollbar: Scrollbar | undefined = this.verticalScrollbar;
    if (scrollbar) return scrollbar.getLastRenderableLine() + 1;
    else return this.args?.getNumberOfRows() ?? 0;
  }

  public getRenderableCols(): RangeIterator {
    return new RangeIterator(
      this.getFirstRenderableCol(),
      this.getLastRenderableCol()
    );
  }

  private getFirstRenderableCol(): number {
    return this.horizontalScrollbar?.getFirstRenderableLine() ?? 0;
  }

  private getLastRenderableCol(): number {
    const scrollbar: Scrollbar | undefined = this.horizontalScrollbar;
    if (scrollbar) return scrollbar.getLastRenderableLine() + 1;
    else return this.args?.getNumberOfCols() ?? 0;
  }

  public renderModel(): this {
    this.verticalScrollbar
      ?.setViewport(this.size.getHeight())
      .renderModel(this.scroller.getTop());
    this.horizontalScrollbar
      ?.setViewport(this.size.getWidth())
      .renderModel(this.scroller.getLeft());
    this.afterRenderModel$.next();
    return this;
  }

  public onAfterRenderModel$(): Observable<void> {
    return this.afterRenderModel$.asObservable();
  }

  public renderMergedRegions(): this {
    this.verticalScrollbar
      ?.setViewport(this.size.getHeight())
      .renderMergedLines();
    this.horizontalScrollbar
      ?.setViewport(this.size.getWidth())
      .renderMergedLines();
    return this;
  }
}

export class FitScrollContainerFactory implements ScrollContainerFactory {
  public createScrollContainer(tableViewer: TableViewer): FitScrollContainer {
    return new FitScrollContainer(tableViewer);
  }
}

class FitScroller implements Scroller {
  constructor(private left: number, private top: number) {}

  public readonly getLeft = (): number => this.left;
  public readonly getTop = (): number => this.top;
  public readonly scroll = (left: number, top: number): void => {
    this.left = left;
    this.top = top;
  };
}

class FitSize implements Size {
  constructor(private width: number, private height: number) {}

  public readonly getWidth = (): number => this.width;
  public readonly getHeight = (): number => this.height;
}

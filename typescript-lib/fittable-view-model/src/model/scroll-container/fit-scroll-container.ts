import { Observable, Subject } from 'rxjs';

import { RangeIterator } from 'fittable-core/common';
import {
  Scrollbar,
  ScrollContainer,
  ScrollElement,
  ScrollContainerFactory,
  TableViewer,
  ScrollContainerArgs,
} from 'fittable-core/view-model';

export class FitScrollContainer implements ScrollContainer {
  private scrollElement?: ScrollElement;
  private verticalScrollbar?: Scrollbar;
  private horizontalScrollbar?: Scrollbar;
  private readonly afterRenderModel$: Subject<void> = new Subject();

  constructor(private readonly args?: ScrollContainerArgs) {}

  public init(element: ScrollElement): this {
    this.scrollElement = element;
    return this;
  }

  public getHeight(): number {
    return this.scrollElement?.clientHeight ?? 0;
  }

  public getWidth(): number {
    return this.scrollElement?.clientWidth ?? 0;
  }

  public scrollTo(left: number, top: number): void {
    this.scrollElement?.scrollTo(left, top);
  }

  public getLeft(): number {
    return this.scrollElement?.scrollLeft ?? 0;
  }

  public getTop(): number {
    return this.scrollElement?.scrollTop ?? 0;
  }

  public resizeViewportHeight(): this {
    this.verticalScrollbar?.setViewport(this.getHeight());
    return this;
  }

  public resizeViewportWidth(): this {
    this.horizontalScrollbar?.setViewport(this.getWidth());
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

  public getOffsetX(): number {
    return this.horizontalScrollbar?.getOffset() ?? 0;
  }

  public getOffsetY(): number {
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
    this.verticalScrollbar?.renderModel(this.getTop());
    this.horizontalScrollbar?.renderModel(this.getLeft());
    this.afterRenderModel$.next();
    return this;
  }

  public onAfterRenderModel$(): Observable<void> {
    return this.afterRenderModel$.asObservable();
  }

  public renderMergedRegions(): this {
    this.verticalScrollbar?.renderMergedLines();
    this.horizontalScrollbar?.renderMergedLines();
    return this;
  }
}

export class FitScrollContainerFactory implements ScrollContainerFactory {
  public createScrollContainer(tableViewer: TableViewer): FitScrollContainer {
    return new FitScrollContainer(tableViewer);
  }
}

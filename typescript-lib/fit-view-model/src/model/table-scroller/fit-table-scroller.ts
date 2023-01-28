import { RangeIterator } from 'fit-core/common/range-iterator.js';
import {
  Scrollbar,
  TableScroller,
  TableScrollerCore,
  TableScrollerFactory,
  TableViewer,
} from 'fit-core/view-model/index.js';

import { VerticalScrollbar, HorizontalScrollbar } from './fit-scrollbar.js';

export class FitTableScroller implements TableScroller {
  private core?: TableScrollerCore;
  private verticalScrollbar?: Scrollbar;
  private horizontalScrollbar?: Scrollbar;

  constructor(private readonly tableViewer: TableViewer) {
    this.verticalScrollbar = new VerticalScrollbar(tableViewer);
    this.horizontalScrollbar = new HorizontalScrollbar(tableViewer);
  }

  public init(core: TableScrollerCore): this {
    this.core = core;
    return this;
  }

  public getHeight(): number {
    return this.core?.clientHeight ?? 0;
  }

  public getWidth(): number {
    return this.core?.clientWidth ?? 0;
  }

  public scrollTo(left: number, top: number): void {
    this.core?.scrollTo(left, top);
  }

  public getLeft(): number {
    return this.core?.scrollLeft ?? 0;
  }

  public getTop(): number {
    return this.core?.scrollTop ?? 0;
  }

  public resizeViewportHeight(): this {
    this.verticalScrollbar?.setViewport(this.getHeight());
    return this;
  }

  public resizeViewportWidth(): this {
    this.horizontalScrollbar?.setViewport(this.getWidth());
    return this;
  }

  public setVerticalScrollbar(scrollbar?: VerticalScrollbar): this {
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

  public getTableRowIds(): RangeIterator {
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
    else return this.tableViewer.getTable().getNumberOfRows();
  }

  public getTableColIds(): RangeIterator {
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
    else return this.tableViewer.getTable().getNumberOfCols();
  }

  public renderTable(): this {
    this.verticalScrollbar?.renderTable(this.getTop());
    this.horizontalScrollbar?.renderTable(this.getLeft());
    return this;
  }

  public renderMergedRegions(): this {
    this.verticalScrollbar?.renderMergedRegions();
    this.horizontalScrollbar?.renderMergedRegions();
    return this;
  }
}

export class FitTableScrollerFactory implements TableScrollerFactory {
  public createTableScroller(tableViewer: TableViewer): FitTableScroller {
    return new FitTableScroller(tableViewer);
  }
}

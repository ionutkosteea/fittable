import { TableViewer, Scrollbar } from 'fit-core/view-model/index.js';

export abstract class VirtualScroller implements Scrollbar {
  private scrollViewport = 0;
  private scrollPosition = 0;
  private offset = 0;
  private firstVisibleLine = 0;
  private firstRenderableLine = 0;
  private lastRenderableLine = 0;
  private isScrollBackward = false;
  private isScrollRequired = false;

  protected abstract getTableNumberOfLines(): number;
  protected abstract getTableDimension(): number;
  protected abstract getLineDimension(lineId: number): number;
  protected abstract getLinePosition(lineId: number): number;
  protected abstract hasHiddenCells4Line(lineId: number): boolean;

  public setViewport(viewport = 0): this {
    this.scrollViewport = viewport;
    this.isScrollRequired = this.scrollViewport < this.getTableDimension();
    if (this.isScrollRequired) this.endScroll();
    else this.noScrollRequired();
    return this;
  }

  private noScrollRequired(): void {
    this.scrollPosition = 0;
    this.offset = 0;
    this.firstVisibleLine = 0;
    this.firstRenderableLine = 0;
    this.lastRenderableLine = this.getTableNumberOfLines() - 1;
    this.isScrollBackward = false;
  }

  public getOffset(): number {
    return this.offset;
  }

  public getFirstRenderableLine(): number {
    return this.firstRenderableLine;
  }

  public getLastRenderableLine(): number {
    return this.lastRenderableLine;
  }

  public renderTable(scrollPosition = 0): this {
    if (this.isScrollRequired) {
      this.isScrollBackward = scrollPosition < this.scrollPosition;
      this.scrollPosition = scrollPosition;
      if (!this.isLineScrolled(this.firstVisibleLine)) {
        this.startScroll();
        this.endScroll();
        this.renderMergedRegions();
      }
    }
    return this;
  }

  private startScroll(): void {
    this.isScrollBackward
      ? this.startScrollBackward()
      : this.startScrollForward();
  }

  private startScrollForward(): void {
    const from: number = this.firstVisibleLine + 1;
    const to: number = this.getTableNumberOfLines();
    for (let i: number = from; i < to; i++) {
      if (this.defineScrollStartParams(i)) return;
    }
  }

  private startScrollBackward(): void {
    for (let i: number = this.lastRenderableLine; i >= 0; i--) {
      if (this.defineScrollStartParams(i)) return;
    }
    this.offset = 0;
    this.firstVisibleLine = 0;
    this.firstRenderableLine = 0;
  }

  private defineScrollStartParams(lineId: number): boolean {
    if (!this.isLineScrolled(lineId)) return false;
    this.firstVisibleLine = lineId;
    if (this.firstVisibleLine > 0) {
      this.firstRenderableLine = this.firstVisibleLine - 1;
      this.offset = this.getLinePosition(this.firstRenderableLine);
    } else {
      this.firstRenderableLine = 0;
      this.offset = 0;
    }
    return true;
  }

  private isLineScrolled(lineId: number): boolean {
    const pos: number = this.getLinePosition(lineId);
    const dim: number = this.getLineDimension(lineId);
    return this.scrollPosition >= pos && this.scrollPosition < pos + dim;
  }

  private endScroll(): void {
    const firstPos: number = this.getLinePosition(this.firstVisibleLine);
    const viewport: number = firstPos + this.scrollViewport;
    const firstDim: number = this.getLineDimension(this.firstVisibleLine);
    let lastDims = 0;
    const from: number = this.firstVisibleLine + 1;
    const to: number = this.getTableNumberOfLines();
    for (let i: number = from; i < to; i++) {
      const pos: number = this.getLinePosition(i);
      if (pos < viewport) continue;
      lastDims += this.getLineDimension(i);
      if (lastDims < firstDim) continue;
      this.lastRenderableLine = i;
      return;
    }
    this.lastRenderableLine = this.getTableNumberOfLines() - 1;
  }

  public renderMergedRegions(): this {
    while (this.hasHiddenCells4Line(this.firstRenderableLine)) {
      if (this.firstRenderableLine === 0) break;
      this.firstRenderableLine--;
      this.offset = this.getLinePosition(this.firstRenderableLine);
    }
    return this;
  }
}

export class VerticalScrollbar extends VirtualScroller {
  constructor(private readonly tableViewer: TableViewer) {
    super();
  }
  protected getTableNumberOfLines(): number {
    return this.tableViewer.table.getNumberOfRows();
  }
  protected getTableDimension(): number {
    const headerHeight: number = this.tableViewer.getColumnHeaderHeight();
    const bodyHeight: number = this.tableViewer.getBodyHeight();
    return headerHeight + bodyHeight;
  }
  protected getLinePosition(rowId: number): number {
    return this.tableViewer.getRowPosition(rowId);
  }
  protected getLineDimension(rowId: number): number {
    return this.tableViewer.getRowHeight(rowId);
  }
  protected hasHiddenCells4Line(colId: number): boolean {
    return this.tableViewer.hasHiddenCells4Row(colId);
  }
}

export class HorizontalScrollbar extends VirtualScroller {
  constructor(private readonly tableViewer: TableViewer) {
    super();
  }
  protected getTableNumberOfLines(): number {
    return this.tableViewer.table.getNumberOfColumns();
  }
  protected getTableDimension(): number {
    const headerWidth: number = this.tableViewer.getRowHeaderWidth();
    const bodyWidth: number = this.tableViewer.getBodyWidth();
    return headerWidth + bodyWidth;
  }
  protected getLinePosition(colId: number): number {
    return this.tableViewer.getColumnPosition(colId);
  }
  protected getLineDimension(colId: number): number {
    return this.tableViewer.getColumnWidth(colId);
  }
  protected hasHiddenCells4Line(colId: number): boolean {
    return this.tableViewer.hasHiddenCells4Column(colId);
  }
}

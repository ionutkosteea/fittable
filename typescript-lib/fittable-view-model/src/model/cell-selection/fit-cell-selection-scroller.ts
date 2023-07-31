import {
  CellSelectionScroller,
  CellSelectionScrollerFactory,
  ScrollContainer,
  Scroller,
  TableViewer,
} from 'fittable-core/view-model';

export type ScrollDirection = 'Left' | 'Up' | 'Right' | 'Down';

export class FitCellSelectionScroller implements CellSelectionScroller {
  private rowId!: number;
  private colId!: number;
  private scrollDirection!: ScrollDirection;

  constructor(
    private tableViewer: TableViewer,
    private tableScrollContainer: ScrollContainer
  ) {}

  public setRowId(rowId: number): this {
    this.rowId = rowId;
    return this;
  }

  public setColId(colId: number): this {
    this.colId = colId;
    return this;
  }

  public setScrollDirection(direction: ScrollDirection): this {
    this.scrollDirection = direction;
    return this;
  }

  public scroll(): this {
    const scroller: Scroller = this.tableScrollContainer.getScroller();
    if (this.scrollDirection === 'Down') {
      const scrollLeft: number = scroller.getLeft();
      const scrollTop: number = this.scrollDown();
      if (scrollTop > -1) scroller.scroll(scrollLeft, scrollTop);
    } else if (this.scrollDirection === 'Right') {
      const scrollLeft: number = this.scrollRight();
      const scrollTop: number = scroller.getTop();
      if (scrollLeft > -1) scroller.scroll(scrollLeft, scrollTop);
    } else if (this.scrollDirection === 'Up') {
      const scrollLeft: number = scroller.getLeft();
      const scrollTop: number = this.scrollUp();
      if (scrollTop > -1) scroller.scroll(scrollLeft, scrollTop);
    } else if (this.scrollDirection === 'Left') {
      const scrollLeft: number = this.scrollLeft();
      const scrollTop: number = scroller.getTop();
      if (scrollLeft > -1) scroller.scroll(scrollLeft, scrollTop);
    }
    return this;
  }

  private scrollUp(): number {
    if (this.rowId === 0) return this.tableViewer.getRowPosition(0);
    const scrollTop: number = this.tableScrollContainer.getScroller().getTop();
    const rowPosition: number = this.tableViewer.getRowPosition(this.rowId);
    const rowHeight: number = this.getRowHeight(this.rowId);
    if (scrollTop >= rowPosition && scrollTop < rowPosition + rowHeight) {
      return this.tableViewer.getRowPosition(this.rowId - 1);
    } else {
      return -1;
    }
  }

  private scrollDown(): number {
    const numberOfRows: number = this.tableViewer.getNumberOfRows();
    if (this.rowId === numberOfRows - 1) return -1;
    const scrollTop: number = this.tableScrollContainer.getScroller().getTop();
    const clientHeight: number = //
      this.tableScrollContainer.getSize().getHeight();
    const viewport: number = scrollTop + clientHeight;
    const rowPosition: number = this.tableViewer.getRowPosition(this.rowId);
    const rowHeight: number = this.getRowHeight(this.rowId);
    if (viewport >= rowPosition && viewport <= rowPosition + rowHeight) {
      const nextRowHeight: number = this.getRowHeight(this.rowId + 1);
      return scrollTop + rowPosition + rowHeight - viewport + nextRowHeight;
    } else {
      return -1;
    }
  }

  private getRowHeight(rowId: number): number {
    let height: number = this.tableViewer.getRowHeight(rowId);
    const rowSpan: number = this.tableViewer.getMaxRowSpan(rowId);
    for (let i = rowId + 1; i < rowId + rowSpan; i++) {
      height += this.tableViewer.getRowHeight(i);
    }
    return height;
  }

  private scrollLeft(): number {
    if (this.colId === 0) return this.tableViewer.getColPosition(0);
    const scrollLeft: number = //
      this.tableScrollContainer.getScroller().getLeft();
    const colPosition: number = this.tableViewer.getColPosition(this.colId);
    const colWidth: number = this.getColWidth(this.colId);
    if (scrollLeft >= colPosition && scrollLeft < colPosition + colWidth) {
      return this.tableViewer.getColPosition(this.colId - 1);
    } else {
      return -1;
    }
  }

  private scrollRight(): number {
    const numberOfCols: number = this.tableViewer.getNumberOfCols();
    if (this.colId === numberOfCols - 1) return -1;
    const scrollLeft: number = //
      this.tableScrollContainer.getScroller().getLeft();
    const clientWidth: number = //
      this.tableScrollContainer.getSize().getWidth();
    const viewport: number = scrollLeft + clientWidth;
    const colPosition: number = this.tableViewer.getColPosition(this.colId);
    const colWidth: number = this.getColWidth(this.colId);
    if (viewport >= colPosition && viewport <= colPosition + colWidth) {
      const nextColWidth: number = this.getColWidth(this.colId + 1);
      return scrollLeft + colPosition + colWidth - viewport + nextColWidth;
    } else {
      return -1;
    }
  }

  private getColWidth(colId: number): number {
    let width: number = this.tableViewer.getColWidth(colId);
    const colSpan: number = this.tableViewer.getMaxColSpan(colId);
    for (let i = colId + 1; i < colId + colSpan; i++) {
      width += this.tableViewer.getColWidth(i);
    }
    return width;
  }
}

export class FitCellSelectionScrollerFactory
  implements CellSelectionScrollerFactory
{
  public createCellSelectionScroller(
    viewer: TableViewer,
    scrollContainer: ScrollContainer
  ): CellSelectionScroller {
    return new FitCellSelectionScroller(viewer, scrollContainer);
  }
}

import {
  CellSelectionScroller,
  CellSelectionScrollerFactory,
  ScrollContainer,
  TableViewer,
} from 'fittable-core/view-model/index.js';

export type ScrollDirection = 'Left' | 'Up' | 'Right' | 'Down';

export class FitCellSelectionScroller implements CellSelectionScroller {
  private rowId!: number;
  private colId!: number;
  private scrollDirection!: ScrollDirection;

  constructor(
    private tableViewer: TableViewer,
    private tableScroller: ScrollContainer
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
    if (this.scrollDirection === 'Down') {
      const scrollLeft: number = this.tableScroller.getLeft();
      const scrollTop: number = this.scrollDown();
      if (scrollTop > -1) this.tableScroller.scrollTo(scrollLeft, scrollTop);
    } else if (this.scrollDirection === 'Right') {
      const scrollLeft: number = this.scrollRight();
      const scrollTop: number = this.tableScroller.getTop();
      if (scrollLeft > -1) this.tableScroller.scrollTo(scrollLeft, scrollTop);
    } else if (this.scrollDirection === 'Up') {
      const scrollLeft: number = this.tableScroller.getLeft();
      const scrollTop: number = this.scrollUp();
      if (scrollTop > -1) this.tableScroller.scrollTo(scrollLeft, scrollTop);
    } else if (this.scrollDirection === 'Left') {
      const scrollLeft: number = this.scrollLeft();
      const scrollTop: number = this.tableScroller.getTop();
      if (scrollLeft > -1) this.tableScroller.scrollTo(scrollLeft, scrollTop);
    }
    return this;
  }

  private scrollUp(): number {
    if (this.rowId === 0) return this.tableViewer.getRowPosition(0);
    const scrollTop: number = this.tableScroller.getTop();
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
    const scrollTop: number = this.tableScroller.getTop();
    const clientHeight: number = this.tableScroller.getHeight();
    const colHeaderHeight: number = this.tableViewer.getColHeaderHeight();
    const viewport: number = scrollTop + clientHeight - colHeaderHeight;
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
    const scrollLeft: number = this.tableScroller.getLeft();
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
    const scrollLeft: number = this.tableScroller.getLeft();
    const clientWidth: number = this.tableScroller.getWidth();
    const rowHeaderWidth: number = this.tableViewer.getRowHeaderWidth();
    const viewport: number = scrollLeft + clientWidth - rowHeaderWidth;
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
    scroller: ScrollContainer
  ): CellSelectionScroller {
    return new FitCellSelectionScroller(viewer, scroller);
  }
}

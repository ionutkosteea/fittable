import {
  TableScroller,
  TableScrollerCore,
  TableScrollerListener,
  TableScrollerListenerFactory,
} from 'fit-core/view-model/index.js';

export class FitTableScrollerListener implements TableScrollerListener {
  private isScrolling = false;

  constructor(public readonly tableScroller: TableScroller) {}

  public onInit(div: TableScrollerCore): void {
    this.tableScroller.init(div).resizeViewportHeight().resizeViewportWidth();
  }

  public onScroll(): void {
    this.isScrolling = true;
    setTimeout((): void => {
      if (this.isScrolling) {
        this.tableScroller.renderTable();
        this.isScrolling = false;
      }
    }, 200);
  }
}

export class FitTableScrollerListenerFactory
  implements TableScrollerListenerFactory
{
  public createTableScrollerListener(
    tableScroller: TableScroller
  ): FitTableScrollerListener {
    return new FitTableScrollerListener(tableScroller);
  }
}

import { Subscription, Subject } from 'rxjs';

import { CellRange } from 'fit-core/model/cell-range.js';
import {
  CellSelectionPainter,
  TableViewer,
  CellSelection,
  CellSelectionRectangles,
  CellSelectionPainterFactory,
  CellSelectionRanges,
} from 'fit-core/view-model/index.js';

import {
  BodySelectionRectangles,
  PageHeaderCellSelectionRectangles,
  RowHeaderSelectionRectangles,
  ColHeaderSelectionRectangles,
} from './fit-cell-selection-rectangles.js';

export class FitCellSelectionPainter implements CellSelectionPainter {
  public readonly body: CellSelectionRectangles;
  public readonly pageHeader?: CellSelectionRectangles;
  public readonly rowHeader?: CellSelectionRectangles;
  public readonly colHeader?: CellSelectionRectangles;

  private readonly subscriptions: Set<Subscription | undefined> = new Set();

  constructor(
    private readonly tableViewer: TableViewer,
    private readonly cellSelection: CellSelection
  ) {
    this.body = this.createBodyPainterRanges();
    this.pageHeader = this.createPageHeaderPainterRanges();
    this.rowHeader = this.createRowHeaderPainterRanges();
    this.colHeader = this.createColHeaderPainterRanges();
    this.subscribeToCellSelection();
  }

  private createBodyPainterRanges(): CellSelectionRectangles {
    return new BodySelectionRectangles(this.tableViewer);
  }

  private createPageHeaderPainterRanges(): CellSelectionRectangles | undefined {
    return (
      this.cellSelection.pageHeader &&
      new PageHeaderCellSelectionRectangles(this.tableViewer)
    );
  }

  private createRowHeaderPainterRanges(): CellSelectionRectangles | undefined {
    return (
      this.cellSelection.rowHeader &&
      new RowHeaderSelectionRectangles(this.tableViewer)
    );
  }

  private createColHeaderPainterRanges(): CellSelectionRectangles | undefined {
    return (
      this.cellSelection.colHeader &&
      new ColHeaderSelectionRectangles(this.tableViewer)
    );
  }

  private subscribeToCellSelection(): void {
    this.subscriptions.add(this.onAfterSelectBodyCell());
    this.subscriptions.add(this.onEndSelectBody());
    this.subscriptions.add(this.onAfterSelectPageHeaderCell());
    this.subscriptions.add(this.onEndSelectPageHeader());
    this.subscriptions.add(this.onAfterSelectRowHeaderCell());
    this.subscriptions.add(this.onEndSelectRowHeader());
    this.subscriptions.add(this.onAfterSelectColHeaderCell());
    this.subscriptions.add(this.onEndSelectColHeader());
  }

  private onAfterSelectBodyCell(): Subscription {
    return this.cellSelection.body
      .onAfterAddCell$()
      .subscribe(() => this.paintAll());
  }

  private paintAll(): void {
    this.body.paint(this.cellSelection.body);
    this.cellSelection.rowHeader &&
      this.rowHeader?.paint(this.cellSelection.rowHeader);
    this.cellSelection.colHeader &&
      this.colHeader?.paint(this.cellSelection.colHeader);
    this.cellSelection.pageHeader &&
      this.pageHeader?.paint(this.cellSelection.pageHeader);
  }

  private onEndSelectBody(): Subscription {
    const onEnd: Subject<CellRange[]> = new Subject();
    this.cellSelection.body.addOnEnd$(onEnd);
    return onEnd.subscribe(() => this.body.paint(this.cellSelection.body));
  }

  private onAfterSelectPageHeaderCell(): Subscription | undefined {
    return this.cellSelection.pageHeader
      ?.onAfterAddCell$()
      .subscribe(() =>
        this.pageHeader?.paint(
          this.cellSelection.pageHeader as CellSelectionRanges
        )
      );
  }

  private onEndSelectPageHeader(): Subscription | undefined {
    if (this.cellSelection.pageHeader) {
      const onEnd: Subject<CellRange[]> = new Subject();
      this.cellSelection.pageHeader.addOnEnd$(onEnd);
      return onEnd.subscribe(() =>
        this.pageHeader?.paint(
          this.cellSelection.pageHeader as CellSelectionRanges
        )
      );
    } else {
      return undefined;
    }
  }

  private onAfterSelectRowHeaderCell(): Subscription | undefined {
    return this.cellSelection.rowHeader
      ?.onAfterAddCell$()
      .subscribe(() =>
        this.rowHeader?.paint(
          this.cellSelection.rowHeader as CellSelectionRanges
        )
      );
  }

  private onEndSelectRowHeader(): Subscription | undefined {
    if (this.cellSelection.rowHeader) {
      const onEnd: Subject<CellRange[]> = new Subject();
      this.cellSelection.rowHeader.addOnEnd$(onEnd);
      return onEnd.subscribe(() =>
        this.rowHeader?.paint(
          this.cellSelection.rowHeader as CellSelectionRanges
        )
      );
    } else {
      return undefined;
    }
  }

  private onAfterSelectColHeaderCell(): Subscription | undefined {
    return this.cellSelection.colHeader
      ?.onAfterAddCell$()
      .subscribe(() =>
        this.colHeader?.paint(
          this.cellSelection.colHeader as CellSelectionRanges
        )
      );
  }

  private onEndSelectColHeader(): Subscription | undefined {
    if (this.cellSelection.colHeader) {
      const onEnd: Subject<CellRange[]> = new Subject();
      this.cellSelection.colHeader.addOnEnd$(onEnd);
      return onEnd.subscribe(() =>
        this.colHeader?.paint(
          this.cellSelection.colHeader as CellSelectionRanges
        )
      );
    } else {
      return undefined;
    }
  }

  public paint(): this {
    this.body.paint(this.cellSelection.body);
    this.cellSelection.rowHeader &&
      this.rowHeader?.paint(this.cellSelection.rowHeader);
    this.cellSelection.colHeader &&
      this.colHeader?.paint(this.cellSelection.colHeader);
    this.cellSelection.pageHeader &&
      this.pageHeader?.paint(this.cellSelection.pageHeader);
    return this;
  }

  public destroy(): void {
    this.subscriptions.forEach((s?: Subscription) => s?.unsubscribe());
  }
}

export class FitCellSelectionPainterFactory
  implements CellSelectionPainterFactory
{
  public createCellSelectionPainter(
    tableViewer: TableViewer,
    cellSelection: CellSelection
  ): CellSelectionPainter {
    return new FitCellSelectionPainter(tableViewer, cellSelection);
  }
}

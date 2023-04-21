import { Subscription } from 'rxjs';

import {
  CellSelectionPainter,
  CellSelectionRectangles,
  CellSelectionPainterFactory,
  CellSelectionRanges,
  CellSelectionPainterArgs,
} from 'fittable-core/view-model/index.js';

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

  constructor(private readonly args: CellSelectionPainterArgs) {
    this.body = this.createBodyPainterRanges();
    this.pageHeader = this.createPageHeaderPainterRanges();
    this.rowHeader = this.createRowHeaderPainterRanges();
    this.colHeader = this.createColHeaderPainterRanges();
    this.subscribeToCellSelection();
    this.subscribeToTableScroller();
  }

  private createBodyPainterRanges(): CellSelectionRectangles {
    return new BodySelectionRectangles(
      this.args.tableViewer,
      this.args.tableScroller
    );
  }

  private createPageHeaderPainterRanges(): CellSelectionRectangles | undefined {
    return (
      this.args.cellSelection.pageHeader &&
      new PageHeaderCellSelectionRectangles(
        this.args.tableViewer,
        this.args.tableScroller
      )
    );
  }

  private createRowHeaderPainterRanges(): CellSelectionRectangles | undefined {
    return (
      this.args.cellSelection.rowHeader &&
      new RowHeaderSelectionRectangles(
        this.args.tableViewer,
        this.args.tableScroller
      )
    );
  }

  private createColHeaderPainterRanges(): CellSelectionRectangles | undefined {
    return (
      this.args.cellSelection.colHeader &&
      new ColHeaderSelectionRectangles(
        this.args.tableViewer,
        this.args.tableScroller
      )
    );
  }

  private subscribeToCellSelection(): void {
    this.subscriptions.add(this.onAfterSelectBodyCell$());
    this.subscriptions.add(this.onEndSelectBody$());
    this.subscriptions.add(this.onAfterSelectPageHeaderCell$());
    this.subscriptions.add(this.onEndSelectPageHeader$());
    this.subscriptions.add(this.onAfterSelectRowHeaderCell$());
    this.subscriptions.add(this.onEndSelectRowHeader$());
    this.subscriptions.add(this.onAfterSelectColHeaderCell$());
    this.subscriptions.add(this.onEndSelectColHeader$());
  }

  private onAfterSelectBodyCell$(): Subscription {
    return this.args.cellSelection.body
      .onAfterAddCell$()
      .subscribe((): void => {
        this.paint();
      });
  }

  private onEndSelectBody$(): Subscription {
    return this.args.cellSelection.body.onEnd$().subscribe((): void => {
      this.body.paint(this.args.cellSelection.body);
    });
  }

  private onAfterSelectPageHeaderCell$(): Subscription | undefined {
    return this.args.cellSelection.pageHeader
      ?.onAfterAddCell$()
      .subscribe((): void => {
        this.pageHeader?.paint(
          this.args.cellSelection.pageHeader as CellSelectionRanges
        );
      });
  }

  private onEndSelectPageHeader$(): Subscription | undefined {
    if (this.args.cellSelection.pageHeader) {
      return this.args.cellSelection.pageHeader.onEnd$().subscribe((): void => {
        this.pageHeader?.paint(
          this.args.cellSelection.pageHeader as CellSelectionRanges
        );
      });
    } else {
      return undefined;
    }
  }

  private onAfterSelectRowHeaderCell$(): Subscription | undefined {
    return this.args.cellSelection.rowHeader
      ?.onAfterAddCell$()
      .subscribe((): void => {
        this.rowHeader?.paint(
          this.args.cellSelection.rowHeader as CellSelectionRanges
        );
      });
  }

  private onEndSelectRowHeader$(): Subscription | undefined {
    if (this.args.cellSelection.rowHeader) {
      return this.args.cellSelection.rowHeader.onEnd$().subscribe((): void => {
        this.rowHeader?.paint(
          this.args.cellSelection.rowHeader as CellSelectionRanges
        );
      });
    } else {
      return undefined;
    }
  }

  private onAfterSelectColHeaderCell$(): Subscription | undefined {
    return this.args.cellSelection.colHeader
      ?.onAfterAddCell$()
      .subscribe((): void => {
        this.colHeader?.paint(
          this.args.cellSelection.colHeader as CellSelectionRanges
        );
      });
  }

  private onEndSelectColHeader$(): Subscription | undefined {
    if (this.args.cellSelection.colHeader) {
      return this.args.cellSelection.colHeader.onEnd$().subscribe((): void => {
        this.colHeader?.paint(
          this.args.cellSelection.colHeader as CellSelectionRanges
        );
      });
    } else {
      return undefined;
    }
  }

  public paint(): this {
    this.body.paint(this.args.cellSelection.body);
    this.paintHeaders();
    return this;
  }

  private subscribeToTableScroller(): void {
    this.subscriptions.add(
      this.args.tableScroller.onAfterRenderModel$().subscribe((): void => {
        this.paintHeaders();
      })
    );
  }

  private paintHeaders(): void {
    this.args.cellSelection.rowHeader &&
      this.rowHeader?.paint(this.args.cellSelection.rowHeader);
    this.args.cellSelection.colHeader &&
      this.colHeader?.paint(this.args.cellSelection.colHeader);
    this.args.cellSelection.pageHeader &&
      this.pageHeader?.paint(this.args.cellSelection.pageHeader);
  }

  public destroy(): void {
    this.subscriptions.forEach((s?: Subscription) => s?.unsubscribe());
  }
}

export class FitCellSelectionPainterFactory
  implements CellSelectionPainterFactory
{
  public createCellSelectionPainter(
    args: CellSelectionPainterArgs
  ): CellSelectionPainter {
    return new FitCellSelectionPainter(args);
  }
}

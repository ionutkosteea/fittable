import { Subscription } from 'rxjs';

import { CssStyle } from 'fittable-core/model';
import {
  MobileLayout,
  MobileLayoutArgs,
  MobileLayoutFactory,
  Rectangle,
  Scroller,
} from 'fittable-core/view-model';

export class FitMobileLayout implements MobileLayout {
  public bodyOffset!: CssStyle;
  public pageHeaderOffset!: CssStyle;
  public rowHeaderOffset!: CssStyle;
  public colHeaderOffset!: CssStyle;
  public bodySelectionRectangles: CssStyle[] = [];
  public pageHeaderSelectionRectangles: CssStyle[] = [];
  public rowHeaderSelectionRectangles: CssStyle[] = [];
  public colHeaderSelectionRectangles: CssStyle[] = [];

  private readonly subscriptions: Set<Subscription | undefined> = new Set();

  constructor(private readonly args: MobileLayoutArgs) {
    this.calcOffsets();
    this.subscriptions.add(this.onScroll$());
    this.subscriptions.add(this.onPaintBodyCells$());
    this.subscriptions.add(this.onPaintPageHeaderCells$());
    this.subscriptions.add(this.onPaintRowHeaderCells$());
    this.subscriptions.add(this.onPaintColHeaserCells$());
  }

  private calcOffsets(): void {
    this.calcBodyOffset();
    this.calcPageHeaderOffset();
    this.calcColHeaderOffset();
    this.calcRowHeaderOffset();
  }

  private onScroll$(): Subscription {
    return this.args.tableScrollContainer
      .onAfterRenderModel$()
      .subscribe((): void => this.calcOffsets());
  }

  private calcBodyOffset(): void {
    const left: number =
      this.args.tableViewer.getRowHeaderWidth() +
      this.args.tableScrollContainer.getInnerOffsetX();
    const top: number =
      this.args.tableViewer.getColHeaderHeight() +
      this.args.tableScrollContainer.getInnerOffsetY();
    this.bodyOffset = {
      transform: 'translate3d(' + left + 'px,' + top + 'px,0px)',
    };
  }

  private calcPageHeaderOffset(): void {
    const left: number = this.args.tableScrollContainer.getScroller().getLeft();
    const top: number = this.args.tableScrollContainer.getScroller().getTop();
    this.pageHeaderOffset = {
      transform: 'translate3d(' + left + 'px,' + top + 'px,0px)',
    };
  }

  private calcColHeaderOffset(): void {
    const left: number =
      this.args.tableViewer.getRowHeaderWidth() +
      this.args.tableScrollContainer.getInnerOffsetX();
    const top: number = this.args.tableScrollContainer.getScroller().getTop();
    this.colHeaderOffset = {
      transform: 'translate3d(' + left + 'px,' + top + 'px,0px)',
    };
  }

  private calcRowHeaderOffset(): void {
    const left: number = this.args.tableScrollContainer.getScroller().getLeft();
    const top: number =
      this.args.tableViewer.getColHeaderHeight() +
      this.args.tableScrollContainer.getInnerOffsetY();
    this.rowHeaderOffset = {
      transform: 'translate3d(' + left + 'px,' + top + 'px,0px)',
    };
  }

  private onPaintBodyCells$(): Subscription | undefined {
    return this.args.cellSelectionPainter?.body
      .onAfterPaint$()
      .subscribe((): void => {
        this.bodySelectionRectangles = [];
        this.args.cellSelectionPainter?.body
          .getRectangles()
          .forEach((rect: Rectangle) => {
            this.bodySelectionRectangles.push({
              left: rect.left + 'px',
              top: rect.top + 'px',
              width: rect.width + 'px',
              height: rect.height + 'px',
            });
          });
      });
  }

  private onPaintPageHeaderCells$(): Subscription | undefined {
    return this.args.cellSelectionPainter?.pageHeader
      ?.onAfterPaint$()
      .subscribe((): void => {
        this.pageHeaderSelectionRectangles = [];
        this.args.cellSelectionPainter?.pageHeader
          ?.getRectangles()
          .forEach((rect: Rectangle) => {
            const scroller: Scroller =
              this.args.tableScrollContainer.getScroller();
            const left: number = rect.left + scroller.getLeft();
            const top: number = rect.top + scroller.getTop();
            this.pageHeaderSelectionRectangles.push({
              transform: 'translate3d(' + left + 'px,' + top + 'px,0px)',
              width: rect.width + 'px',
              height: rect.height + 'px',
            });
          });
      });
  }

  private onPaintColHeaserCells$(): Subscription | undefined {
    return this.args.cellSelectionPainter?.colHeader
      ?.onAfterPaint$()
      .subscribe((): void => {
        this.colHeaderSelectionRectangles = [];
        this.args.cellSelectionPainter?.colHeader
          ?.getRectangles()
          .forEach((rect: Rectangle) => {
            const scroller: Scroller =
              this.args.tableScrollContainer.getScroller();
            const top: number = rect.top + scroller.getTop();
            this.colHeaderSelectionRectangles.push({
              transform: 'translate3d(' + rect.left + 'px,' + top + 'px,0px)',
              width: rect.width + 'px',
              height: rect.height + 'px',
            });
          });
      });
  }

  private onPaintRowHeaderCells$(): Subscription | undefined {
    return this.args.cellSelectionPainter?.rowHeader
      ?.onAfterPaint$()
      .subscribe((): void => {
        this.rowHeaderSelectionRectangles = [];
        this.args.cellSelectionPainter?.rowHeader
          ?.getRectangles()
          .forEach((rect: Rectangle) => {
            const scroller: Scroller =
              this.args.tableScrollContainer.getScroller();
            const left: number = rect.left + scroller.getLeft();
            this.rowHeaderSelectionRectangles.push({
              transform: 'translate3d(' + left + 'px,' + rect.top + 'px,0px)',
              width: rect.width + 'px',
              height: rect.height + 'px',
            });
          });
      });
  }

  public destroy(): void {
    this.subscriptions.forEach((s?: Subscription): void => s?.unsubscribe());
  }
}

export class FitMobileLayoutFactory implements MobileLayoutFactory {
  public createMobileLayout(args: MobileLayoutArgs): MobileLayout {
    return new FitMobileLayout(args);
  }
}

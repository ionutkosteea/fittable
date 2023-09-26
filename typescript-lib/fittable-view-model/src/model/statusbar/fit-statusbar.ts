import { Subject, Observable, Subscription } from 'rxjs';

import {
  ScrollContainer,
  Statusbar,
  StatusbarFactory,
  TableViewer,
} from 'fittable-core/view-model';

import { getLanguageDictionary } from '../language/language-def.js';

export class FitStatusbar implements Statusbar {
  private text = '';
  private focus = false;
  private afterSetFocus$: Subject<boolean> = new Subject();

  private readonly subscriptions: Subscription[] = [];

  constructor(
    private readonly tableViewer: TableViewer,
    private readonly tableScrollContainer: ScrollContainer
  ) {
    this.init();
  }

  private init(): void {
    this.subscriptions.push(this.onAfterRenderScroller$());
    this.subscriptions.push(this.onAfterSetLocale$());
  }

  private onAfterRenderScroller$(): Subscription {
    return this.tableScrollContainer
      .onAfterRenderModel$()
      .subscribe((): void => this.updateText());
  }

  private onAfterSetLocale$(): Subscription {
    return getLanguageDictionary()
      .onAfterSetLocale$()
      .subscribe((): void => this.updateText());
  }

  private readonly updateText = (): void => {
    this.text = this.createText();
  };

  private readonly createText = (): string =>
    getLanguageDictionary().getText('Rows') +
    ': ' +
    this.getRenderedRows() +
    ' ' +
    getLanguageDictionary().getText('Columns') +
    ': ' +
    this.getRederedCols();

  public getText(): string {
    return this.text;
  }

  public getRenderedRows(): string {
    const numberOfRows: number = this.tableViewer.getNumberOfRows();
    const firstRow: number = this.getFirstRenderableRow();
    const lastRow: number = this.getLastRenderableRow();
    return numberOfRows + ' [' + firstRow + ',' + lastRow + ']';
  }

  public getRederedCols(): string {
    const numberOfCols: number = this.tableViewer.getNumberOfCols();
    const firstCol: number = this.getFirstRenderableCol();
    const lastCol: number = this.getLastRenderableCol();
    return numberOfCols + ' [' + firstCol + ',' + lastCol + ']';
  }

  private getFirstRenderableCol(): number {
    return (
      this.tableScrollContainer
        .getHorizontalScrollbar()
        ?.getFirstRenderableLine() ?? 0
    );
  }

  private getLastRenderableCol(): number {
    const colId: number =
      this.tableScrollContainer
        .getHorizontalScrollbar()
        ?.getLastRenderableLine() ?? 0;
    const numberOfCols: number = this.tableViewer.getNumberOfCols();
    return colId > 0 ? colId : numberOfCols > 0 ? numberOfCols - 1 : 0;
  }

  private getFirstRenderableRow(): number {
    return (
      this.tableScrollContainer
        .getVerticalScrollbar()
        ?.getFirstRenderableLine() ?? 0
    );
  }

  private getLastRenderableRow(): number {
    const rowId: number =
      this.tableScrollContainer
        .getVerticalScrollbar()
        ?.getLastRenderableLine() ?? 0;
    const numberOfRows: number = this.tableViewer.getNumberOfRows();
    return rowId > 0 ? rowId : numberOfRows > 0 ? numberOfRows - 1 : 0;
  }

  public setFocus(focus: boolean, ignoreTrigger?: boolean): this {
    this.focus = focus;
    !ignoreTrigger && this.afterSetFocus$.next(focus);
    return this;
  }

  public hasFocus(): boolean {
    return this.focus;
  }

  public onAfterSetFocus$(): Observable<boolean> {
    return this.afterSetFocus$.asObservable();
  }

  public destroy(): void {
    this.subscriptions.forEach((s: Subscription): void => s.unsubscribe());
  }
}

export class FitStatusbarFactory implements StatusbarFactory {
  public createStatusbar(
    tableViewer: TableViewer,
    tableScrollContainer: ScrollContainer
  ): Statusbar {
    return new FitStatusbar(tableViewer, tableScrollContainer);
  }
}

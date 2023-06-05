import { Subject, Observable, Subscription } from 'rxjs';

import {
  Statusbar,
  StatusbarArgs,
  StatusbarFactory,
} from 'fittable-core/view-model';

import { FitTextKey } from '../language-dictionary/language-dictionary-keys.js';

export class FitStatusbar implements Statusbar {
  private text = '';
  private focus = false;
  private afterSetFocus$: Subject<boolean> = new Subject();

  private readonly subscriptions: Subscription[] = [];

  constructor(private readonly args: StatusbarArgs) {
    this.init();
  }

  private init(): void {
    this.refresh();
    this.subscriptions.push(this.onAfterRenderScroller$());
    this.subscriptions.push(this.onAfterSetCurrentLanguage$());
  }

  private onAfterRenderScroller$(): Subscription {
    return this.args.tableScroller
      .onAfterRenderModel$()
      .subscribe((): void => this.refresh());
  }

  private onAfterSetCurrentLanguage$(): Subscription {
    return this.args.dictionary
      .onAfterSetCurrentLanguage$()
      .subscribe((): void => this.refresh());
  }

  public refresh(): void {
    this.text = this.createText();
  }

  private readonly createText = (): string =>
    this.getTranslation('Rows') +
    ': ' +
    this.getRenderedRows() +
    ' ' +
    this.getTranslation('Columns') +
    ': ' +
    this.getRederedCols();

  public getText(): string {
    return this.text;
  }

  public getRenderedRows(): string {
    const numberOfRows: number = this.args.tableViewer.getNumberOfRows();
    const firstRow: number = this.getFirstRenderableRow();
    const lastRow: number = this.getLastRenderableRow();
    return numberOfRows + ' [' + firstRow + ',' + lastRow + ']';
  }

  public getRederedCols(): string {
    const numberOfCols: number = this.args.tableViewer.getNumberOfCols();
    const firstCol: number = this.getFirstRenderableCol();
    const lastCol: number = this.getLastRenderableCol();
    return numberOfCols + ' [' + firstCol + ',' + lastCol + ']';
  }

  private getFirstRenderableCol(): number {
    return (
      this.args.tableScroller
        .getHorizontalScrollbar()
        ?.getFirstRenderableLine() ?? 0
    );
  }

  private getLastRenderableCol(): number {
    const colId: number =
      this.args.tableScroller
        .getHorizontalScrollbar()
        ?.getLastRenderableLine() ?? 0;
    const numberOfCols: number = this.args.tableViewer.getNumberOfCols();
    return colId > 0 ? colId : numberOfCols > 0 ? numberOfCols - 1 : 0;
  }

  private getFirstRenderableRow(): number {
    return (
      this.args.tableScroller
        .getVerticalScrollbar()
        ?.getFirstRenderableLine() ?? 0
    );
  }

  private getLastRenderableRow(): number {
    const rowId: number =
      this.args.tableScroller.getVerticalScrollbar()?.getLastRenderableLine() ??
      0;
    const numberOfRows: number = this.args.tableViewer.getNumberOfRows();
    return rowId > 0 ? rowId : numberOfRows > 0 ? numberOfRows - 1 : 0;
  }

  private readonly getTranslation = (text: FitTextKey): string =>
    this.args.dictionary.getText(text);

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
  public createStatusbar(args: StatusbarArgs): Statusbar {
    return new FitStatusbar(args);
  }
}

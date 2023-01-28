import { Subject, Observable } from 'rxjs';

import {
  Statusbar,
  StatusbarArgs,
  StatusbarFactory,
} from 'fit-core/view-model/index.js';

import { FitTextKey } from '../../language-dictionary/language-dictionary-keys.js';

export class FitStatusbar implements Statusbar {
  private focus = false;
  private afterSetFocus$: Subject<boolean> = new Subject();

  constructor(private readonly args: StatusbarArgs) {}

  public getText(): string {
    return (
      this.getTranslation('Rows') +
      ': ' +
      this.getRenderedRows() +
      ' ' +
      this.getTranslation('Columns') +
      ': ' +
      this.getRederedCols()
    );
  }

  public getRenderedRows(): string {
    const numberOfRows: number = this.args.tableViewer
      .getTable()
      .getNumberOfRows();
    const firstRow: number = this.getFirstRenderableRow();
    const lastRow: number = this.getLastRenderableRow();
    return numberOfRows + ' [' + firstRow + ',' + lastRow + ']';
  }

  public getRederedCols(): string {
    const numberOfCols: number = this.args.tableViewer
      .getTable()
      .getNumberOfCols();
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
    const numberOfCols: number = this.args.tableViewer
      .getTable()
      .getNumberOfCols();
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
    const numberOfRows: number = this.args.tableViewer
      .getTable()
      .getNumberOfRows();
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
}

export class FitStatusbarFactory implements StatusbarFactory {
  public createStatusbar(args: StatusbarArgs): Statusbar {
    return new FitStatusbar(args);
  }
}

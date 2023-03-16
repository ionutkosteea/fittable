import { CellRange, createStyle, Style, Table } from 'fit-core/model/index.js';

import { getFirstCellStyle } from '../../../common/style-functions.js';
import { FitUIOperationArgs } from '../../../operation-executor/operation-args.js';
import { ControlUpdater } from './control-updater.js';
import { FitControlArgs } from './fit-control-args.js';
import { PushButton } from './push-button.js';

export class StylePushButton extends PushButton implements ControlUpdater {
  private style?: Style;
  private pushed = false;

  constructor(private readonly args: FitControlArgs) {
    super();
    this.setPushed((): boolean => this.pushed);
    this.setRun(this.createRunFn);
  }

  private readonly createRunFn = (): void => {
    if (!this.style) throw new Error('Style is not defined!');
    const selectedCells: CellRange[] = this.args.getSelectedCells();
    const style: Style = this.isPushed()
      ? this.getUndefinedStyle()
      : this.style.clone();
    const args: FitUIOperationArgs = {
      id: 'style-update',
      selectedCells,
      styleSnippet: style,
    };
    this.args.operationExecutor.run(args);
    this.pushed = !this.pushed;
  };

  private readonly getUndefinedStyle = (): Style => {
    const undefinedStyle: Style = createStyle();
    this.style!.forEach((name: string): boolean => {
      undefinedStyle.set(name);
      return true;
    });
    return undefinedStyle;
  };

  public setStyle(style: Style): this {
    this.style = style;
    return this;
  }

  public updateByCellSelection(): void {
    const table: Table | undefined = this.args.operationExecutor.getTable();
    if (!table) throw new Error('Invalid operation executor!');
    const selectedCells: CellRange[] = this.args.getSelectedCells();
    const style: Style | undefined = getFirstCellStyle(table, selectedCells);
    this.pushed = style?.contains(this.style) ?? false;
  }
}

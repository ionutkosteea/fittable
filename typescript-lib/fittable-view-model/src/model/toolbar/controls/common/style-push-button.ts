import { CellRange, createStyle, Style, Table } from 'fittable-core/model';
import { ControlArgs } from 'fittable-core/view-model';

import { getFirstCellStyle } from '../../../common/style-functions.js';
import { FitUIOperationArgs } from '../../../operation-executor/operation-args.js';
import { FitToggleControl } from '../../../common/controls/fit-toggle-control.js';
import { ControlUpdater } from './control-updater.js';

export class StylePushButton
  extends FitToggleControl
  implements ControlUpdater
{
  private style?: Style;
  private pushed = false;

  constructor(private readonly args: ControlArgs) {
    super();
    this.setOnFn((): boolean => this.pushed);
    this.setRun(this.createRunFn);
  }

  private readonly createRunFn = (): void => {
    if (!this.style) throw new Error('Style is not defined!');
    const selectedCells: CellRange[] = this.args.getSelectedCells();
    const style: Style = this.isOn()
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
    this.style?.forEach((name: string): boolean => {
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

import { Style, CellRange, createStyle, Table } from 'fit-core/model/index.js';
import { ControlArgs } from 'fit-core/view-model/index.js';

import { FitOperationArgs } from '../../../../operation-executor/operation-args.js';
import { getFirstCellStyle } from '../../../../common/style-functions.js';
import { PushButton } from './push-button.js';

export abstract class StylePushButton extends PushButton {
  protected abstract style: Style;

  private pushed = false;

  constructor(protected readonly args: ControlArgs) {
    super(args);
  }

  public updateByCellSelection(): void {
    const table: Table | undefined = this.args.operationExecutor.getTable();
    if (!table) throw new Error('Invalid operation executor!');
    const selectedCells: CellRange[] = this.args.getSelectedCells();
    const style: Style | undefined = getFirstCellStyle(table, selectedCells);
    this.pushed = style?.contains(this.style) ?? false;
  }

  public run(): void {
    const selectedCells: CellRange[] = this.args.getSelectedCells();
    const style: Style = this.isPushed()
      ? this.getUndefinedStyle()
      : this.style.clone();
    const args: FitOperationArgs = { id: 'style-update', selectedCells, style };
    this.args.operationExecutor.run(args);
    this.pushed = !this.pushed;
  }

  private getUndefinedStyle(): Style {
    const undefinedStyle: Style = createStyle();
    this.style.forEach((name: string): boolean => {
      undefinedStyle.set(name);
      return true;
    });
    return undefinedStyle;
  }

  protected isPushed() {
    return this.pushed;
  }
}

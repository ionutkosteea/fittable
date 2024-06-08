import {
  CellRange,
  CssValue,
  Style,
  Table,
  createStyle,
} from 'fittable-core/model';
import {
  asSelectorWindow,
  asValueControl,
  Control,
  ControlArgs,
  SelectorWindow,
  ValueControl,
} from 'fittable-core/view-model';

import { FitSelectorWindow } from '../../../common/controls/fit-selector-window.js';
import { FitUIOperationArgs } from '../../../operation-executor/operation-args.js';
import { getFirstCellStyle } from '../../../common/style-functions.js';
import { FitPopupControl } from '../../../common/controls/fit-popup-control.js';
import { FitValueControl } from '../../../common/controls/fit-value-control.js';
import { ControlUpdater } from './control-updater.js';

export class StyleCombo
  extends FitPopupControl<string>
  implements ControlUpdater
{
  private canChangeSelectionIcon = false;

  constructor(
    private readonly styleAttName: string,
    private readonly args: ControlArgs
  ) {
    super(new StyleComboWindow(styleAttName, args));
  }

  public setChangeSelectionIcon(canChange: boolean): this {
    this.canChangeSelectionIcon = canChange;
    return this;
  }

  public override getWindow(): StyleComboWindow {
    return super.getWindow() as StyleComboWindow;
  }

  public updateByCellSelection(): void {
    const table: Table | undefined = this.args.operationExecutor.getTable();
    if (!table) throw new Error('Invalid operation executor!');
    const selectedCells: CellRange[] = this.args.getSelectedCells();
    const style: Style | undefined = getFirstCellStyle(table, selectedCells);
    const attValue: string | number | undefined = style?.get(this.styleAttName);
    const selectorWindow: SelectorWindow | undefined = //
      asSelectorWindow(this.getWindow());
    if (!selectorWindow) throw new Error('Invalid selector window!');
    if (attValue) {
      let isSelectedControlId = false;
      for (const id of this.getWindow().getControlIds()) {
        const valueControl: ValueControl = this.getValueControl(id);
        if (valueControl.getValue() === attValue) {
          selectorWindow.setControlId(id);
          this.canChangeSelectionIcon &&
            this.setIcon(() => valueControl.getIcon());
          isSelectedControlId = true;
          return;
        }
      }
      if (!isSelectedControlId) {
        const value: string = '' + attValue;
        const newControl: FitValueControl = new FitValueControl()
          .setLabel((): string => value)
          .setValue(value);
        selectorWindow.addControl(value, newControl).setControlId(value);
      }
    } else {
      const controlId = selectorWindow.getControlIds()[0];
      this.canChangeSelectionIcon &&
        this.setIcon(() => selectorWindow.getControl(controlId).getIcon());
      selectorWindow.setControlId(controlId);
    }
  }

  public readonly getValueControl = (id: string): ValueControl => {
    const control: Control = this.getWindow().getControl(id);
    const valueControl: ValueControl | undefined = asValueControl(control);
    if (valueControl) return valueControl;
    else throw new Error('Invalid value control for id ' + id);
  };
}

class StyleComboWindow extends FitSelectorWindow<string> {
  constructor(
    private readonly styleAttName: string,
    private readonly args: ControlArgs
  ) {
    super();
  }

  public override addControl(id: string, control: Control): this {
    super.addControl(id, control);
    this.createRunFn(id, control);
    return this;
  }

  private createRunFn(id: string, control: Control): void {
    const valueControl: ValueControl | undefined = asValueControl(control);
    if (!valueControl) throw new Error(`Invalid value control for id '$id'`);
    valueControl.run = (): void => {
      const selectedCells: CellRange[] = this.args.getSelectedCells();
      const style: Style = createStyle() //
        .set(this.styleAttName, valueControl.getValue() as CssValue);
      const operationArgs: FitUIOperationArgs = {
        id: 'style-update',
        selectedCells,
        styleSnippet: style,
      };
      this.args.operationExecutor.run(operationArgs);
      this.setControlId(id);
      this.setVisible(false);
    };
  }
}

import { CellRange, createStyle, Style, Table } from 'fittable-core/model';
import {
  asValueControl,
  Control,
  ValueControl,
} from 'fittable-core/view-model';

import { FitUIOperationArgs } from '../../../operation-executor/operation-args.js';
import { getFirstCellStyle } from '../../../common/style-functions.js';
import { FitPopupControl } from '../../../common/controls/fit-popup-control.js';
import { FitValueControl } from '../../../common/controls/fit-value-control.js';
import { FitWindow } from '../../../common/controls/fit-window.js';
import { FitControlArgs } from './fit-control-args.js';
import { ControlUpdater } from './control-updater.js';

export class StyleCombo
  extends FitPopupControl<string>
  implements ControlUpdater
{
  private styleAttName?: string;

  constructor(private readonly args: FitControlArgs) {
    super(new FitWindow());
    this.setRun(this.createRunFn);
  }

  private readonly createRunFn = (): void => {
    if (!this.styleAttName) throw new Error('Style attribute is not defined!');
    const selectedCells: CellRange[] = this.args.getSelectedCells();
    const id: string | undefined = this.getSelectedControl();
    if (!id) throw new Error('Control ID is not defined!');
    const valueControl: ValueControl = this.getValueControl(id); //
    const style: Style = createStyle() //
      .set(this.styleAttName, valueControl.getValue());
    const args: FitUIOperationArgs = {
      id: 'style-update',
      selectedCells,
      styleSnippet: style,
    };
    this.args.operationExecutor.run(args);
  };

  public setStyleAttName(name: string): this {
    this.styleAttName = name;
    return this;
  }

  public updateByCellSelection(): void {
    if (!this.styleAttName) throw new Error('Style attribute is not defined!');
    const table: Table | undefined = this.args.operationExecutor.getTable();
    if (!table) throw new Error('Invalid operation executor!');
    const selectedCells: CellRange[] = this.args.getSelectedCells();
    const style: Style | undefined = getFirstCellStyle(table, selectedCells);
    const attValue: string | number | undefined = style?.get(this.styleAttName);
    if (attValue) {
      let isSelectedControlId = false;
      for (const id of this.getWindow().getControlIds()) {
        const valueControl: ValueControl = this.getValueControl(id);
        if (valueControl.getValue() === attValue) {
          this.setSelectedControl(id);
          isSelectedControlId = true;
          return;
        }
      }
      if (!isSelectedControlId) {
        const value: string = '' + attValue;
        const newControl: FitValueControl = new FitValueControl()
          .setLabel((): string => value)
          .setValue(value);
        this.getWindow().addControl(value, newControl);
        this.setSelectedControl(value);
      }
    } else {
      this.setSelectedControl('');
    }
  }

  private readonly getValueControl = (id: string): ValueControl => {
    const control: Control = this.getWindow().getControl(id);
    const valueControl: ValueControl | undefined = asValueControl(control);
    if (valueControl) return valueControl;
    else throw new Error('Invalid value control for id ' + id);
  };
}

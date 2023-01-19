import { Table, Style, createStyle, CellRange } from 'fit-core/model/index.js';
import {
  Window,
  OptionsControl,
  Control,
  ControlArgs,
  ValueControl,
  asValueControl,
} from 'fit-core/view-model/index.js';

import { FitOperationArgs } from '../../../../operation-executor/operation-args.js';
import { FitWindow } from '../../../../common/controls/fit-window.js';
import { FitValueControl } from '../../../../common/controls/fit-value-control.js';
import { FitTextKey } from '../../../../language-dictionary/language-dictionary-keys.js';
import { FitImageId } from '../../../../image-registry/fit-image-ids.js';
import { getFirstCellStyle } from '../../../../common/style-functions.js';
import { FitControlType } from '../../../../common/controls/fit-control-type.js';

export abstract class StyleCombo implements OptionsControl {
  protected abstract labelKey: FitTextKey;
  protected abstract imageId: FitImageId;
  protected abstract styleAttName: string;

  private readonly optionsWindow: Window = new FitWindow();
  private selectedOptionId?: string;

  constructor(protected readonly args: ControlArgs) {
    this.createOptionControls();
  }

  public abstract getType(): FitControlType | undefined;
  protected abstract createOptionControls(): void;

  public getLabel(): string {
    return this.args.dictionary.getText(this.labelKey);
  }

  public getIcon(): string | undefined {
    return this.args.imageRegistry.getImageUrl(this.imageId);
  }

  public getWindow(): Window {
    return this.optionsWindow;
  }

  public setSelectedControl(id: string): this {
    this.selectedOptionId = id;
    return this;
  }

  public getSelectedControl(): string | undefined {
    return this.selectedOptionId;
  }

  public updateByCellSelection(): void {
    const table: Table | undefined = this.args.operationExecutor.getTable();
    if (!table) throw new Error('Invalid operation executor!');
    const selectedCells: CellRange[] = this.args.getSelectedCells();
    const style: Style | undefined = getFirstCellStyle(table, selectedCells);
    const attValue: string | number | undefined = style?.get(this.styleAttName);
    if (attValue) {
      let isSelectedOptionId = false;
      this.optionsWindow.getControlIds().forEach((id: string): void => {
        const option: ValueControl = this.getValueControl(id);
        if (option.getValue() === attValue) {
          this.selectedOptionId = id;
          isSelectedOptionId = true;
          return;
        }
      });
      if (!isSelectedOptionId) {
        const value: string = '' + attValue;
        const newControl: Control = new FitValueControl()
          .setLabel((): string => value)
          .setValue(value);
        this.optionsWindow.addControl(value, newControl);
        this.selectedOptionId = value;
      }
    } else {
      this.selectedOptionId = undefined;
    }
  }

  public run(): void {
    const selectedCells: CellRange[] = this.args.getSelectedCells();
    const selectedOption: ValueControl = this.getValueControl(
      '' + this.selectedOptionId
    );
    const style: Style = createStyle() //
      .set(this.styleAttName, selectedOption.getValue());
    const args: FitOperationArgs = { id: 'style-update', selectedCells, style };
    this.args.operationExecutor.run(args);
  }

  private getValueControl(id: string): ValueControl {
    const control: Control = this.optionsWindow.getControl(id);
    const valueControl: ValueControl | undefined = asValueControl(control);
    if (valueControl) return valueControl;
    else throw new Error('Invalid value control for id ' + id);
  }

  public isValid(): boolean {
    return true;
  }

  protected readonly getText = (textKey: FitTextKey): string =>
    this.args.dictionary.getText(textKey);

  protected readonly getImageUrl = (imageId: FitImageId): string | undefined =>
    this.args.imageRegistry.getImageUrl(imageId);
}

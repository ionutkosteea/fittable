import { CellRange, Style, createStyle, Table } from 'fit-core/model/index.js';
import {
  ViewModelConfig,
  getViewModelConfig,
} from 'fit-core/view-model/index.js';

import { FitInputControl } from '../../common/controls/fit-input-control.js';
import { FitUIOperationArgs } from '../../operation-executor/operation-args.js';
import { getFirstCellStyle } from '../../common/style-functions.js';
import { FitControlArgs } from './common/fit-control-args.js';
import { ControlUpdater } from './common/control-updater.js';

export function createFontSizeInput(args: FitControlArgs): FitInputControl {
  return new FontSizeInput(args);
}

class FontSizeInput extends FitInputControl implements ControlUpdater {
  private config: ViewModelConfig = getViewModelConfig();
  private size?: number;

  constructor(private readonly args: FitControlArgs) {
    super();
    this.setType('input');
    this.setLabel((): string => args.dictionary.getText('Font size'));
    this.setRun(this.createRunFn);
    this.setValid((): boolean => this.getValue() > 0);
  }

  private createRunFn = (): void => {
    if (this.isValid()) {
      const selectedCells: CellRange[] = this.args.getSelectedCells();
      const style: Style = createStyle().set('font-size.px', this.getValue());
      const args: FitUIOperationArgs = {
        id: 'style-update',
        selectedCells,
        styleSnippet: style,
      };
      this.args.operationExecutor.run(args);
    } else {
      const oldValue: number = this.getStyleFontSize();
      console.warn(
        'Invalid font size ' +
          this.getValue() +
          '. Restore old value ' +
          oldValue +
          '.'
      );
      this.setValue(oldValue);
    }
  };

  public updateByCellSelection(): void {
    this.size = this.getStyleFontSize();
  }

  private getStyleFontSize = (): number => {
    const table: Table | undefined = this.args.operationExecutor.getTable();
    if (!table) throw new Error('Invalid operation executor!');
    const selectedCells: CellRange[] = this.args.getSelectedCells();
    const style: Style | undefined = getFirstCellStyle(table, selectedCells);
    const fontSize: string | number | undefined = style?.get('font-size.px');
    return fontSize ? (fontSize as number) : this.config.fontSize ?? 0;
  };

  public override getValue(): number {
    return this.size ?? this.config.fontSize ?? 0;
  }

  public override setValue(size?: number): this {
    if (size === this.config.fontSize) this.size = undefined;
    else this.size = size;
    return this;
  }
}

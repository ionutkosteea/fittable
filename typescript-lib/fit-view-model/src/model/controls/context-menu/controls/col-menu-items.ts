import { asTableCols, CellRange, Table } from 'fit-core/model/index.js';
import {
  ViewModelConfig,
  getViewModelConfig,
} from 'fit-core/view-model/index.js';

import { FitImageId } from '../../../image-registry/fit-image-ids.js';
import { FitTextKey } from '../../../language-dictionary/language-dictionary-keys.js';
import { FitOperationArgs } from '../../../operation-executor/operation-args.js';
import { InputMenuItem, MenuItem } from './menu-item.js';

export class ColResizeMenuItem extends InputMenuItem {
  protected labelKey: FitTextKey = 'Resize columns';
  protected iconId: FitImageId = 'width';
  private config: ViewModelConfig = getViewModelConfig();

  public override getValue(): number | undefined {
    return this.value ?? this.getColWidth();
  }

  private getColWidth(): number | undefined {
    const cellRange: CellRange | undefined = this.args.getSelectedCells()[0];
    if (!cellRange) return undefined;
    const colId: number = cellRange.getFrom().getColId();
    const table: Table | undefined = this.args.operationExecutor.getTable();
    if (!table) throw new Error('Invalid operation executor!');
    const colWidth: number | undefined = asTableCols(table)?.getColWidth(colId);
    return colWidth ?? this.config.colWidths;
  }

  public override isValid(): boolean {
    return this.value === undefined ? true : this.value > 0;
  }

  public run(): void {
    if (this.isValid()) {
      this.args.operationExecutor.run(this.getArgs());
      this.value = undefined;
    } else {
      const oldValue: number | undefined = this.value;
      this.value = undefined;
      throw new Error('Invalid control value ' + oldValue);
    }
  }

  private getArgs(): FitOperationArgs {
    return {
      id: 'column-width',
      selectedLines: this.getSelectedCols(),
      dimension: this.value === this.config.colWidths ? undefined : this.value,
    };
  }
}

export class ColInsertLeftMenuItem extends InputMenuItem {
  protected labelKey: FitTextKey = 'Insert columns left';
  protected iconId: FitImageId = 'insertLeft';
  protected value: number = 1;

  public override isValid(): boolean {
    return this.value === undefined ? true : this.value > 0;
  }

  public run(): void {
    if (this.isValid()) {
      this.args.operationExecutor.run(this.getArgs());
      this.value = 1;
    } else {
      const oldValue: number | undefined = this.value;
      this.value = 1;
      throw new Error('Invalid control value ' + oldValue);
    }
  }

  private getArgs(): FitOperationArgs {
    return {
      id: 'column-insert',
      selectedLines: this.getFirstLine(this.getSelectedCols()),
      numberOfInsertableLines: this.value,
    };
  }
}

export class ColInsertRightMenuItem extends InputMenuItem {
  protected labelKey: FitTextKey = 'Insert columns right';
  protected iconId: FitImageId = 'insertRight';
  protected value: number = 1;

  public override isValid(): boolean {
    return this.value === undefined ? true : this.value > 0;
  }

  public run(): void {
    if (this.isValid()) {
      this.args.operationExecutor.run(this.getArgs());
      this.value = 1;
    } else {
      const oldValue: number | undefined = this.value;
      this.value = 1;
      throw new Error('Invalid control value ' + oldValue);
    }
  }

  private getArgs(): FitOperationArgs {
    return {
      id: 'column-insert',
      selectedLines: this.getFirstLine(this.getSelectedCols()),
      numberOfInsertableLines: this.value,
      canInsertAfter: true,
    };
  }
}

export class ColRemoveMenuItem extends MenuItem {
  protected labelKey: FitTextKey = 'Remove columns';
  protected iconId: FitImageId = 'remove';

  public run(): void {
    this.args.operationExecutor.run(this.getArgs());
  }

  private getArgs(): FitOperationArgs {
    return {
      id: 'column-remove',
      selectedLines: this.getSelectedCols(),
    };
  }
}

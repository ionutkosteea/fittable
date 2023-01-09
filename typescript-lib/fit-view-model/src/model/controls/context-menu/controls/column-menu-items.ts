import {
  CellRange,
  Table,
  TableColumns,
  asTableColumns,
  Column,
  asColumnWidth,
} from 'fit-core/model/index.js';
import {
  ViewModelConfig,
  getViewModelConfig,
} from 'fit-core/view-model/index.js';

import { FitImageId } from '../../../image-registry/fit-image-registry.js';
import { FitTextKey } from '../../../language-dictionary/language-dictionary-keys.js';
import { FitOperationArgs } from '../../../operation-executor/operation-args.js';
import { InputMenuItem, MenuItem } from './menu-item.js';

export class ColumnResizeMenuItem extends InputMenuItem {
  protected labelKey: FitTextKey = 'Resize columns';
  protected iconId: FitImageId = 'width';
  private config: ViewModelConfig = getViewModelConfig();

  public override getValue(): number | undefined {
    return this.value ?? this.getColumnWidth();
  }

  private getColumnWidth(): number | undefined {
    const cellRange: CellRange | undefined = this.args.getSelectedCells()[0];
    if (!cellRange) return undefined;
    const colId: number = cellRange.getFrom().getColId();
    const table: Table | undefined = this.args.executor.getTable();
    if (!table) throw new Error('Invalid operation executor!');
    const cTable: TableColumns | undefined = asTableColumns(table);
    const column: Column | undefined = cTable?.getColumn(colId);
    const columnWidth: number | undefined = asColumnWidth(column)?.getWidth();
    return columnWidth ?? this.config.columnWidth;
  }

  public override isValid(): boolean {
    return this.value === undefined ? true : this.value > 0;
  }

  public run(): void {
    if (this.isValid()) {
      this.args.executor.run(this.getArgs());
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
      selectedLines: this.getSelectedColumns(),
      dimension:
        this.value === this.config.columnWidth ? undefined : this.value,
    };
  }
}

export class ColumnInsertLeftMenuItem extends InputMenuItem {
  protected labelKey: FitTextKey = 'Insert columns left';
  protected iconId: FitImageId = 'insertLeft';
  protected value: number = 1;

  public override isValid(): boolean {
    return this.value === undefined ? true : this.value > 0;
  }

  public run(): void {
    if (this.isValid()) {
      this.args.executor.run(this.getArgs());
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
      selectedLines: this.getFirstLine(this.getSelectedColumns()),
      numberOfInsertableLines: this.value,
    };
  }
}

export class ColumnInsertRightMenuItem extends InputMenuItem {
  protected labelKey: FitTextKey = 'Insert columns right';
  protected iconId: FitImageId = 'insertRight';
  protected value: number = 1;

  public override isValid(): boolean {
    return this.value === undefined ? true : this.value > 0;
  }

  public run(): void {
    if (this.isValid()) {
      this.args.executor.run(this.getArgs());
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
      selectedLines: this.getFirstLine(this.getSelectedColumns()),
      numberOfInsertableLines: this.value,
      canInsertAfter: true,
    };
  }
}

export class ColumnRemoveMenuItem extends MenuItem {
  protected labelKey: FitTextKey = 'Remove columns';
  protected iconId: FitImageId = 'remove';

  public run(): void {
    this.args.executor.run(this.getArgs());
  }

  private getArgs(): FitOperationArgs {
    return {
      id: 'column-remove',
      selectedLines: this.getSelectedColumns(),
    };
  }
}

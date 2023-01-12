import {
  CellRange,
  TableRows,
  asTableRows,
  Row,
  asRowHeight,
  Table,
} from 'fit-core/model/index.js';
import {
  ViewModelConfig,
  getViewModelConfig,
} from 'fit-core/view-model/index.js';

import { FitImageId } from '../../../image-registry/fit-image-registry.js';
import { FitTextKey } from '../../../language-dictionary/language-dictionary-keys.js';
import { FitOperationArgs } from '../../../operation-executor/operation-args.js';
import { InputMenuItem, MenuItem } from './menu-item.js';

export class RowResizeMenuItem extends InputMenuItem {
  protected labelKey: FitTextKey = 'Resize rows';
  protected iconId: FitImageId = 'height';
  private config: ViewModelConfig = getViewModelConfig();

  public override getValue(): number | undefined {
    return this.value ?? this.getRowHeight();
  }

  private getRowHeight(): number | undefined {
    const cellRange: CellRange | undefined = this.args.getSelectedCells()[0];
    if (!cellRange) return undefined;
    const rowId: number = cellRange.getFrom().getRowId();
    const table: Table | undefined = this.args.operationExecutor.getTable();
    if (!table) throw new Error('Invalid operation executor!');
    const rTable: TableRows | undefined = asTableRows(table);
    const row: Row | undefined = rTable?.getRow(rowId);
    const rowHeight: number | undefined = asRowHeight(row)?.getHeight();
    return rowHeight ?? this.config.rowHeight;
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
      id: 'row-height',
      selectedLines: this.getSelectedRows(),
      dimension: this.value === this.config.rowHeight ? undefined : this.value,
    };
  }
}

export class RowInsertAboveMenuItem extends InputMenuItem {
  protected labelKey: FitTextKey = 'Insert rows above';
  protected iconId: FitImageId = 'insertAbove';
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
      id: 'row-insert',
      selectedLines: this.getFirstLine(this.getSelectedRows()),
      numberOfInsertableLines: this.value,
    };
  }
}

export class RowInsertBelowMenuItem extends InputMenuItem {
  protected labelKey: FitTextKey = 'Insert rows below';
  protected iconId: FitImageId = 'insertBelow';
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
      id: 'row-insert',
      selectedLines: this.getFirstLine(this.getSelectedRows()),
      numberOfInsertableLines: this.value,
      canInsertAfter: true,
    };
  }
}

export class RowRemoveMenuItem extends MenuItem {
  protected labelKey: FitTextKey = 'Remove rows';
  protected iconId: FitImageId = 'remove';

  public run(): void {
    this.args.operationExecutor.run(this.getArgs());
  }

  private getArgs(): FitOperationArgs {
    return {
      id: 'row-remove',
      selectedLines: this.getSelectedRows(),
    };
  }
}

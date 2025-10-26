import {
  asTableCellDataType,
  asTableStyles,
  CellCoord,
  DataType,
  getLanguageDictionary,
  Table,
} from 'fittable-core/model';
import {
  TableChanges,
  TableChangesFactory,
  TableChangeWritter,
  TableChangeWritterFactory,
} from 'fittable-core/operations';
import { ControlArgs } from 'fittable-core/view-model';

import {
  FitUIOperationArgs,
  FitUIOperationId,
} from '../../operation-executor/operation-args.js';
import { getImageRegistry } from '../../image-registry/fit-image-registry.js';
import { FitToggleControl } from '../../common/controls/fit-toggle-control.js';
import { ControlUpdater } from './common/control-updater.js';

export function createPaintFormatButton(args: ControlArgs): FitToggleControl {
  return new PaintFormatButton(args);
}

const operationId: FitUIOperationId = 'paint-format-copy';

class PaintFormatButton extends FitToggleControl implements ControlUpdater {
  private pushed = false;
  private styleName?: string;
  private dataType?: DataType;

  constructor(private readonly args: ControlArgs) {
    super();
    this.setType('button');
    this.setLabel((): string =>
      getLanguageDictionary().getText('Paint format')
    );
    this.setOnFn((): boolean => this.pushed);
    this.setRun(this.createRunFn);
    this.setIcon((): string | undefined =>
      getImageRegistry().getUrl('paintFormat')
    );
    this.createStyleNameCopyOperation();
  }

  private createStyleNameCopyOperation(): void {
    this.args.operationExecutor.bindTableChangeWritterFactory(
      operationId,
      StyleNameCopyChangeWritterFactory
    );
    this.args.operationExecutor.bindTableChangesFactory(
      operationId,
      StyleNameCopyChangesFactory
    );
  }

  private readonly createRunFn = (): void => {
    if (this.pushed) this.styleName = undefined;
    else this.copyCellData();
    this.pushed = !this.pushed;
  };

  private readonly copyCellData = (): void => {
    const table: Table | undefined = this.args.operationExecutor.getTable();
    if (!table) throw new Error('Invalid operation executor!');
    const cellCoord: CellCoord = this.args.getSelectedCells()[0].getFrom();
    const rowId: number = cellCoord.getRowId();
    const colId: number = cellCoord.getColId();
    this.styleName = asTableStyles(table)?.getCellStyleName(rowId, colId);
    this.dataType = asTableCellDataType(table)?.getCellDataType(rowId, colId);
    this.args.operationExecutor.run({ id: operationId });
  };

  public updateByCellSelection(): void {
    if (!this.isOn()) return;
    this.pasteCellData();
    this.pushed = false;
  }

  private pasteCellData() {
    const args: FitUIOperationArgs = {
      id: 'paint-format',
      selectedCells: this.args.getSelectedCells(),
      styleName: this.styleName,
      dataType: this.dataType,
    };
    this.args.operationExecutor.run(args);
  }
}

class StyleNameCopyChangeWritterFactory implements TableChangeWritterFactory {
  public createTableChangeWritter(): TableChangeWritter {
    return {
      run: (): void => {
        // Operation copy should be throwable via the operation execution mechanism.
      },
    };
  }
}

class StyleNameCopyChangesFactory implements TableChangesFactory {
  public createTableChanges(): TableChanges | Promise<TableChanges> {
    return {
      id: operationId,
      changes: [{ id: operationId }],
    };
  }
}

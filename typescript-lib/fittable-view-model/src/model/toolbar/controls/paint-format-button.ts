import {
  asTableCellDataType,
  asTableStyles,
  CellCoord,
  DataType,
  getLanguageDictionary,
  Table,
} from 'fittable-core/model';
import {
  OperationDto,
  OperationDtoFactory,
  OperationStep,
  OperationStepFactory,
} from 'fittable-core/operations';
import { ControlArgs } from 'fittable-core/view-model';

import {
  FitUIOperationArgs,
  FitUIOperationId,
} from '../../operation-executor/operation-args.js';
import { PushButton } from './common/push-button.js';
import { ControlUpdater } from './common/control-updater.js';
import { getImageRegistry } from '../../image-registry/fit-image-registry.js';

export function createPaintFormatButton(args: ControlArgs): PushButton {
  return new PaintFormatButton(args);
}

const operationId: FitUIOperationId = 'paint-format-copy';

class PaintFormatButton extends PushButton implements ControlUpdater {
  private pushed = false;
  private styleName?: string;
  private dataType?: DataType;

  constructor(private readonly args: ControlArgs) {
    super();
    this.setType('button');
    this.setLabel((): string =>
      getLanguageDictionary().getText('Paint format')
    );
    this.setPushed((): boolean => this.pushed);
    this.setRun(this.createRunFn);
    this.setIcon((): string | undefined => {
      return this.pushed
        ? getImageRegistry().getUrl('paintFormatBlue')
        : getImageRegistry().getUrl('paintFormat');
    });
    this.createStyleNameCopyOperation();
  }

  private createStyleNameCopyOperation(): void {
    this.args.operationExecutor.bindOperationStepFactory(
      operationId,
      StyleNameCopyOperationStepFactory
    );
    this.args.operationExecutor.bindOperationDtoFactory(
      operationId,
      StyleNameCopyOperationDtoFactory
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
    if (!this.isPushed()) return;
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

class StyleNameCopyOperationStepFactory implements OperationStepFactory {
  public createStep(): OperationStep {
    return {
      run: (): void => {
        // Operation copy should be throwable via the operation execution mechanism.
      },
    };
  }
}

class StyleNameCopyOperationDtoFactory implements OperationDtoFactory {
  public createOperationDto(): OperationDto | Promise<OperationDto> {
    return {
      id: operationId,
      steps: [{ id: operationId }],
    };
  }
}

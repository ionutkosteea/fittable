import { asTableStyles, CellCoord, Table } from 'fit-core/model/index.js';
import {
  OperationDto,
  OperationDtoFactory,
  OperationStep,
  OperationStepFactory,
} from 'fit-core/operations/operation-core.js';

import {
  FitUIOperationArgs,
  FitUIOperationId,
} from '../../operation-executor/operation-args.js';
import { PushButton } from '../controls/common/push-button.js';
import { ControlUpdater } from './common/control-updater.js';
import { FitControlArgs } from './common/fit-control-args.js';

export function createPaintFormatButton(args: FitControlArgs): PushButton {
  return new PaintFormatButton(args);
}

const operationId: FitUIOperationId = 'style-name-copy';

class PaintFormatButton extends PushButton implements ControlUpdater {
  private pushed = false;
  private styleName?: string;

  constructor(private readonly args: FitControlArgs) {
    super();
    this.setType('push-button');
    this.setLabel((): string => args.dictionary.getText('Paint format'));
    this.setPushed((): boolean => this.pushed);
    this.setRun(this.createRunFn);
    this.setIcon((): string | undefined => {
      return this.pushed
        ? args.imageRegistry.getImageUrl('paintFormatBlue')
        : args.imageRegistry.getImageUrl('paintFormat');
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
    else this.copyStyleName();
    this.pushed = !this.pushed;
  };

  private readonly copyStyleName = (): void => {
    const table: Table | undefined = this.args.operationExecutor.getTable();
    if (!table) throw new Error('Invalid operation executor!');
    const cellCoord: CellCoord = this.args.getSelectedCells()[0].getFrom();
    const rowId: number = cellCoord.getRowId();
    const colId: number = cellCoord.getColId();
    this.styleName = asTableStyles(table)?.getCellStyleName(rowId, colId);
    this.args.operationExecutor.run({ id: operationId });
  };

  public updateByCellSelection(): void {
    if (!this.isPushed()) return;
    this.pasteStyleName();
    this.pushed = false;
  }

  private pasteStyleName() {
    const args: FitUIOperationArgs = {
      id: 'style-name',
      selectedCells: this.args.getSelectedCells(),
      styleName: this.styleName,
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

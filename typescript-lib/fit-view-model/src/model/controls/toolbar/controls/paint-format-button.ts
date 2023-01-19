import { CellCoord, Table, Cell, asCellStyle } from 'fit-core/model/index.js';
import { ControlArgs } from 'fit-core/view-model/index.js';

import { FitOperationArgs } from '../../../operation-executor/operation-args.js';
import { FitImageId } from '../../../image-registry/fit-image-ids.js';
import { FitTextKey } from '../../../language-dictionary/language-dictionary-keys.js';
import { FitControlType } from '../../../common/controls/fit-control-type.js';
import { PushButton } from './common/push-button.js';

export class PaintFormatButton extends PushButton {
  protected readonly labelKey: FitTextKey = 'Paint format';
  protected readonly iconPushedId: FitImageId = 'paintFormatBlue';
  protected readonly iconPulledId: FitImageId = 'paintFormat';
  private pushed = false;
  private styleName?: string;

  constructor(protected readonly args: ControlArgs) {
    super(args);
  }

  public updateByCellSelection(): void {
    if (!this.isPushed()) return;
    this.pasteStyleName();
    this.pushed = false;
  }

  private pasteStyleName() {
    const args: FitOperationArgs = {
      id: 'style-name',
      selectedCells: this.args.getSelectedCells(),
      styleName: this.styleName,
    };
    this.args.operationExecutor.run(args);
  }

  public getType(): FitControlType {
    return 'push-button';
  }

  public run(): void {
    if (this.pushed) {
      this.styleName = undefined;
    } else {
      this.copyStyleName();
    }
    this.pushed = !this.pushed;
  }

  private copyStyleName(): void {
    const cellCoord: CellCoord = this.args.getSelectedCells()[0].getFrom();
    const table: Table | undefined = this.args.operationExecutor.getTable();
    if (!table) throw new Error('Invalid operation executor!');
    const cell: Cell | undefined = table.getCell(
      cellCoord.getRowId(),
      cellCoord.getColId()
    );
    this.styleName = asCellStyle(cell)?.getStyleName();
  }

  protected isPushed(): boolean {
    return this.pushed;
  }
}

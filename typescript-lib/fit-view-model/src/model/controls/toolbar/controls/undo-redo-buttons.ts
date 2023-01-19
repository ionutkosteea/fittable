import { FitControlType } from '../../../common/controls/fit-control-type.js';
import { FitImageId } from '../../../image-registry/fit-image-ids.js';
import { FitTextKey } from '../../../language-dictionary/language-dictionary-keys.js';
import { PushButton } from './common/push-button.js';

export class UndoButton extends PushButton {
  protected readonly labelKey: FitTextKey = 'Undo';
  protected readonly iconPushedId: FitImageId = 'undoBlue';
  protected readonly iconPulledId: FitImageId = 'undo';

  public getType(): FitControlType {
    return 'push-button';
  }

  public run(): void {
    this.args.operationExecutor.undo();
  }

  protected isPushed(): boolean {
    return this.args.operationExecutor.canUndo();
  }
}

export class RedoButton extends PushButton {
  protected readonly labelKey: FitTextKey = 'Redo';
  protected readonly iconPushedId: FitImageId = 'redoBlue';
  protected readonly iconPulledId: FitImageId = 'redo';

  public getType(): FitControlType {
    return 'push-button';
  }

  public run(): void {
    this.args.operationExecutor.redo();
  }

  protected isPushed(): boolean {
    return this.args.operationExecutor.canRedo();
  }
}

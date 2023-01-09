import { FitTextKey } from '../../../language-dictionary/language-dictionary-keys.js';
import { FitImageId } from '../../../image-registry/fit-image-registry.js';
import { ControlType } from '../../../common/view-model-utils.js';
import { PushButton } from './common/push-button.js';

export class UndoButton extends PushButton {
  protected readonly labelKey: FitTextKey = 'Undo';
  protected readonly iconPushedId: FitImageId = 'undoBlue';
  protected readonly iconPulledId: FitImageId = 'undo';

  public getType(): ControlType {
    return 'push-button';
  }

  public run(): void {
    this.args.executor.undo();
  }

  protected isPushed(): boolean {
    return this.args.executor.canUndo();
  }
}

export class RedoButton extends PushButton {
  protected readonly labelKey: FitTextKey = 'Redo';
  protected readonly iconPushedId: FitImageId = 'redoBlue';
  protected readonly iconPulledId: FitImageId = 'redo';

  public getType(): ControlType {
    return 'push-button';
  }

  public run(): void {
    this.args.executor.redo();
  }

  protected isPushed(): boolean {
    return this.args.executor.canRedo();
  }
}

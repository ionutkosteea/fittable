import { PushButton } from '../controls/common/push-button.js';
import { FitControlArgs } from './common/fit-control-args.js';

export function createUndoButton(args: FitControlArgs): PushButton {
  const button: PushButton = new PushButton()
    .setType('push-button')
    .setLabel((): string => args.dictionary.getText('Undo'))
    .setPushed((): boolean => args.operationExecutor.canUndo())
    .setRun((): void => {
      args.operationExecutor.undo();
    });
  button.setIcon((): string | undefined => {
    return button.isPushed()
      ? args.imageRegistry.getImageUrl('undoBlue')
      : args.imageRegistry.getImageUrl('undo');
  });
  return button;
}

export function createRedoButton(args: FitControlArgs): PushButton {
  const button: PushButton = new PushButton()
    .setType('push-button')
    .setLabel((): string => args.dictionary.getText('Redo'))
    .setPushed((): boolean => args.operationExecutor.canRedo())
    .setRun((): void => {
      args.operationExecutor.redo();
    });
  button.setIcon((): string | undefined => {
    return button.isPushed()
      ? args.imageRegistry.getImageUrl('redoBlue')
      : args.imageRegistry.getImageUrl('redo');
  });
  return button;
}

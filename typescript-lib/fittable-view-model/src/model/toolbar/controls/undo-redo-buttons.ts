import { getLanguageDictionary } from 'fittable-core/model';
import { ControlArgs } from 'fittable-core/view-model';

import { PushButton } from './common/push-button.js';
import { getImageRegistry } from '../../image-registry/fit-image-registry.js';

export function createUndoButton(args: ControlArgs): PushButton {
  const button: PushButton = new PushButton()
    .setType('button')
    .setLabel((): string => getLanguageDictionary().getText('Undo'))
    .setPushed((): boolean => args.operationExecutor.canUndo())
    .setRun((): void => {
      args.operationExecutor.undo();
    });
  button.setIcon((): string | undefined => {
    return button.isPushed()
      ? getImageRegistry().getUrl('undoBlue')
      : getImageRegistry().getUrl('undo');
  });
  return button;
}

export function createRedoButton(args: ControlArgs): PushButton {
  const button: PushButton = new PushButton()
    .setType('button')
    .setLabel((): string => getLanguageDictionary().getText('Redo'))
    .setPushed((): boolean => args.operationExecutor.canRedo())
    .setRun((): void => {
      args.operationExecutor.redo();
    });
  button.setIcon((): string | undefined => {
    return button.isPushed()
      ? getImageRegistry().getUrl('redoBlue')
      : getImageRegistry().getUrl('redo');
  });
  return button;
}

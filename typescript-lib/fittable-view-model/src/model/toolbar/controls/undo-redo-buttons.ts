import { getLanguageDictionary } from 'fittable-core/model';
import { ControlArgs } from 'fittable-core/view-model';

import { FitToggleControl } from '../../common/controls/fit-toggle-control.js';
import { getImageRegistry } from '../../image-registry/fit-image-registry.js';

export function createUndoButton(args: ControlArgs): FitToggleControl {
  return new FitToggleControl()
    .setType('button')
    .setLabel((): string => getLanguageDictionary().getText('Undo'))
    .setIcon((): string | undefined => getImageRegistry().getUrl('undo'))
    .setOnFn((): boolean => args.operationExecutor.canUndo())
    .setRun((): void => {
      args.operationExecutor.undo();
    });
}

export function createRedoButton(args: ControlArgs): FitToggleControl {
  return new FitToggleControl()
    .setType('button')
    .setLabel((): string => getLanguageDictionary().getText('Redo'))
    .setIcon((): string | undefined => getImageRegistry().getUrl('redo'))
    .setOnFn((): boolean => args.operationExecutor.canRedo())
    .setRun((): void => {
      args.operationExecutor.redo();
    });
}

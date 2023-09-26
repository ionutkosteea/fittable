import { getLanguageDictionary } from 'fittable-core/model';
import { ControlArgs } from 'fittable-core/view-model';

import { FitControl } from '../../common/controls/fit-control.js';
import { FitUIOperationArgs } from '../../operation-executor/operation-args.js';
import { getImageRegistry } from '../../image-registry/fit-image-registry.js';

export function createCellClearMenuItem(
  hideWindowFn: () => void,
  args: ControlArgs
): FitControl {
  return new FitControl()
    .setType('menu-item')
    .setLabel((): string => getLanguageDictionary().getText('Clear cells'))
    .setIcon((): string | undefined => getImageRegistry().getUrl('clear'))
    .setRun((): void => {
      const operationId: FitUIOperationArgs = {
        id: 'cell-value',
        selectedCells: args.getSelectedCells(),
      };
      args.operationExecutor.run(operationId);
      hideWindowFn();
    });
}

export function createCellRemoveMenuItem(
  hideWindowFn: () => void,
  args: ControlArgs
): FitControl {
  return new FitControl()
    .setType('menu-item')
    .setLabel((): string => getLanguageDictionary().getText('Remove cells'))
    .setIcon((): string | undefined => getImageRegistry().getUrl('remove'))
    .setRun((): void => {
      const operationId: FitUIOperationArgs = {
        id: 'cell-remove',
        selectedCells: args.getSelectedCells(),
      };
      args.operationExecutor.run(operationId);
      hideWindowFn();
    });
}

export function createCellCutMenuItem(
  hideWindowFn: () => void,
  args: ControlArgs
): FitControl {
  return new FitControl()
    .setType('menu-item')
    .setLabel((): string => getLanguageDictionary().getText('Cut cells'))
    .setIcon((): string | undefined => getImageRegistry().getUrl('cut'))
    .setRun((): void => {
      const operationId: FitUIOperationArgs = {
        id: 'cell-cut',
        selectedCells: args.getSelectedCells(),
      };
      args.operationExecutor.run(operationId);
      hideWindowFn();
    });
}

export function createCellCopyMenuItem(
  hideWindowFn: () => void,
  args: ControlArgs
): FitControl {
  return new FitControl()
    .setType('menu-item')
    .setLabel((): string => getLanguageDictionary().getText('Copy cells'))
    .setIcon((): string | undefined => getImageRegistry().getUrl('copy'))
    .setRun((): void => {
      const operationId: FitUIOperationArgs = {
        id: 'cell-copy',
        selectedCells: args.getSelectedCells(),
      };
      args.operationExecutor.run(operationId);
      hideWindowFn();
    });
}

export function createCellPasteMenuItem(
  hideWindowFn: () => void,
  args: ControlArgs
): FitControl {
  return new FitControl()
    .setType('menu-item')
    .setLabel((): string => getLanguageDictionary().getText('Paste cells'))
    .setIcon((): string | undefined => getImageRegistry().getUrl('paste'))
    .setRun((): void => {
      const operationId: FitUIOperationArgs = {
        id: 'cell-paste',
        selectedCells: args.getSelectedCells(),
      };
      args.operationExecutor.run(operationId);
      hideWindowFn();
    });
}

export function createCellMergeMenuItem(
  hideWindowFn: () => void,
  args: ControlArgs
): FitControl {
  return new FitControl()
    .setType('menu-item')
    .setLabel((): string => getLanguageDictionary().getText('Merge cells'))
    .setIcon((): string | undefined => getImageRegistry().getUrl('merge'))
    .setRun((): void => {
      const operationId: FitUIOperationArgs = {
        id: 'cell-merge',
        selectedCells: args.getSelectedCells(),
      };
      args.operationExecutor.run(operationId);
      hideWindowFn();
    });
}

export function createCellUnmergeMenuItem(
  hideWindowFn: () => void,
  args: ControlArgs
): FitControl {
  return new FitControl()
    .setType('menu-item')
    .setLabel((): string => getLanguageDictionary().getText('Unmerge cells'))
    .setIcon((): string | undefined => getImageRegistry().getUrl('unmerge'))
    .setRun((): void => {
      const operationId: FitUIOperationArgs = {
        id: 'cell-unmerge',
        selectedCells: args.getSelectedCells(),
      };
      args.operationExecutor.run(operationId);
      hideWindowFn();
    });
}

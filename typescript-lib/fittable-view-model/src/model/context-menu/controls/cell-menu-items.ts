import { FitControl } from '../../common/controls/fit-control.js';
import { FitUIOperationArgs } from '../../operation-executor/operation-args.js';
import { FitControlArgs } from '../../toolbar/controls/common/fit-control-args.js';

export function createCellClearMenuItem(args: FitControlArgs): FitControl {
  return new FitControl()
    .setType('menu-item')
    .setLabel((): string => args.dictionary.getText('Clear cells'))
    .setIcon((): string | undefined => args.imageRegistry.getImageUrl('clear'))
    .setRun((): void => {
      const operationId: FitUIOperationArgs = {
        id: 'cell-value',
        selectedCells: args.getSelectedCells(),
      };
      args.operationExecutor.run(operationId);
    });
}

export function createCellRemoveMenuItem(args: FitControlArgs): FitControl {
  return new FitControl()
    .setType('menu-item')
    .setLabel((): string => args.dictionary.getText('Remove cells'))
    .setIcon((): string | undefined => args.imageRegistry.getImageUrl('remove'))
    .setRun((): void => {
      const operationId: FitUIOperationArgs = {
        id: 'cell-remove',
        selectedCells: args.getSelectedCells(),
      };
      args.operationExecutor.run(operationId);
    });
}

export function createCellCutMenuItem(args: FitControlArgs): FitControl {
  return new FitControl()
    .setType('menu-item')
    .setLabel((): string => args.dictionary.getText('Cut cells'))
    .setIcon((): string | undefined => args.imageRegistry.getImageUrl('cut'))
    .setRun((): void => {
      const operationId: FitUIOperationArgs = {
        id: 'cell-cut',
        selectedCells: args.getSelectedCells(),
      };
      args.operationExecutor.run(operationId);
    });
}

export function createCellCopyMenuItem(args: FitControlArgs): FitControl {
  return new FitControl()
    .setType('menu-item')
    .setLabel((): string => args.dictionary.getText('Copy cells'))
    .setIcon((): string | undefined => args.imageRegistry.getImageUrl('copy'))
    .setRun((): void => {
      const operationId: FitUIOperationArgs = {
        id: 'cell-copy',
        selectedCells: args.getSelectedCells(),
      };
      args.operationExecutor.run(operationId);
    });
}

export function createCellPasteMenuItem(args: FitControlArgs): FitControl {
  return new FitControl()
    .setType('menu-item')
    .setLabel((): string => args.dictionary.getText('Paste cells'))
    .setIcon((): string | undefined => args.imageRegistry.getImageUrl('paste'))
    .setRun((): void => {
      const operationId: FitUIOperationArgs = {
        id: 'cell-paste',
        selectedCells: args.getSelectedCells(),
      };
      args.operationExecutor.run(operationId);
    });
}

export function createCellMergeMenuItem(args: FitControlArgs): FitControl {
  return new FitControl()
    .setType('menu-item')
    .setLabel((): string => args.dictionary.getText('Merge cells'))
    .setIcon((): string | undefined => args.imageRegistry.getImageUrl('merge'))
    .setRun((): void => {
      const operationId: FitUIOperationArgs = {
        id: 'cell-merge',
        selectedCells: args.getSelectedCells(),
      };
      args.operationExecutor.run(operationId);
    });
}

export function createCellUnmergeMenuItem(args: FitControlArgs): FitControl {
  return new FitControl()
    .setType('menu-item')
    .setLabel((): string => args.dictionary.getText('Unmerge cells'))
    .setIcon((): string | undefined =>
      args.imageRegistry.getImageUrl('unmerge')
    )
    .setRun((): void => {
      const operationId: FitUIOperationArgs = {
        id: 'cell-unmerge',
        selectedCells: args.getSelectedCells(),
      };
      args.operationExecutor.run(operationId);
    });
}

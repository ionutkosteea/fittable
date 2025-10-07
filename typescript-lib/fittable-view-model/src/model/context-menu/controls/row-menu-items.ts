import {
  CellRange,
  createLineRange,
  getLanguageDictionary,
  LineRange,
  LineRangeList,
} from 'fittable-core/model';
import {
  ControlArgs,
} from 'fittable-core/view-model';

import { FitControl } from '../../common/controls/fit-control.js';
import { FitUIOperationArgs } from '../../operation-executor/operation-args.js';
import { getImageRegistry } from '../../image-registry/fit-image-registry.js';

export function createRowResizeMenuItem(
  hideWindowFn: () => void,
  args: ControlArgs
): FitControl {
  return new FitControl()
    .setType('menu-item')
    .setLabel((): string => getLanguageDictionary().getText('Resize rows'))
    .setIcon((): string | undefined => getImageRegistry().getUrl('height'))
    .setRun((): void => {
      args.rowResizeDialog?.setVisible(true);
      hideWindowFn();
    });
}

export function createRowInsertAboveMenuItem(
  hideWindowFn: () => void,
  args: ControlArgs
): FitControl {
  return new FitControl()
    .setType('menu-item')
    .setLabel((): string => getLanguageDictionary().getText('Insert rows above'))
    .setIcon((): string | undefined => getImageRegistry().getUrl('insertAbove'))
    .setRun((): void => {
      args.rowInsertAboveDialog?.setVisible(true);
      hideWindowFn();
    });
}

export function createRowInsertBelowMenuItem(
  hideWindowFn: () => void,
  args: ControlArgs
): FitControl {
  return new FitControl()
    .setType('menu-item')
    .setLabel((): string => getLanguageDictionary().getText('Insert rows below'))
    .setIcon((): string | undefined => getImageRegistry().getUrl('insertBelow'))
    .setRun((): void => {
      args.rowInsertBelowDialog?.setVisible(true);
      hideWindowFn();
    });
}

export function createRowRemoveMenuItem(
  hideWindowFn: () => void,
  args: ControlArgs
): FitControl {
  return new FitControl()
    .setType('menu-item')
    .setLabel((): string => getLanguageDictionary().getText('Remove rows'))
    .setIcon((): string | undefined => getImageRegistry().getUrl('remove'))
    .setRun((): void => {
      const operationArgs: FitUIOperationArgs = {
        id: 'row-remove',
        selectedLines: getSelectedRows(args.getSelectedCells()),
      };
      args.operationExecutor.run(operationArgs);
      hideWindowFn();
    });
}

function getSelectedRows(selectedCells: CellRange[]): LineRange[] {
  const lineRangeList: LineRangeList = new LineRangeList();
  selectedCells.forEach((cellRange: CellRange): void => {
    lineRangeList.add(
      createLineRange(
        cellRange.getFrom().getRowId(),
        cellRange.getTo().getRowId()
      )
    );
  });
  return lineRangeList.getRanges();
}
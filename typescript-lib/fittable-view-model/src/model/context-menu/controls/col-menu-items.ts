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

export function createColResizeMenuItem(
  hideWindowFn: () => void,
  args: ControlArgs
): FitControl {
  return new FitControl()
    .setType('menu-item')
    .setLabel((): string => getLanguageDictionary().getText('Resize columns'))
    .setIcon((): string | undefined => getImageRegistry().getUrl('width'))
    .setRun((): void => {
      args.colResizeDialog?.setVisible(true);
      hideWindowFn();
    });
}

export function createColInsertLeftMenuItem(
  hideWindowFn: () => void,
  args: ControlArgs
): FitControl {
  return new FitControl()
    .setType('menu-item')
    .setLabel((): string => getLanguageDictionary().getText('Insert columns left'))
    .setIcon((): string | undefined => getImageRegistry().getUrl('insertLeft'))
    .setRun((): void => {
      args.colInsertLeftDialog?.setVisible(true);
      hideWindowFn();
    });
}

export function createColInsertRightMenuItem(
  hideWindowFn: () => void,
  args: ControlArgs
): FitControl {
  return new FitControl()
    .setType('menu-item')
    .setLabel((): string => getLanguageDictionary().getText('Insert columns right'))
    .setIcon((): string | undefined => getImageRegistry().getUrl('insertRight'))
    .setRun((): void => {
      args.colInsertRightDialog?.setVisible(true);
      hideWindowFn();
    });
}

export function createColRemoveMenuItem(
  hideWindowFn: () => void,
  args: ControlArgs
): FitControl {
  return new FitControl()
    .setType('menu-item')
    .setLabel((): string => getLanguageDictionary().getText('Remove columns'))
    .setIcon((): string | undefined => getImageRegistry().getUrl('remove'))
    .setRun((): void => {
      const operationArgs: FitUIOperationArgs = {
        id: 'column-remove',
        selectedLines: getSelectedCols(args.getSelectedCells()),
      };
      args.operationExecutor.run(operationArgs);
      hideWindowFn();
    });
}

function getSelectedCols(selectedCells: CellRange[]): LineRange[] {
  const lineRangeList: LineRangeList = new LineRangeList();
  selectedCells.forEach((cellRange: CellRange): void => {
    lineRangeList.add(
      createLineRange(
        cellRange.getFrom().getColId(),
        cellRange.getTo().getColId()
      )
    );
  });
  return lineRangeList.getRanges();
}

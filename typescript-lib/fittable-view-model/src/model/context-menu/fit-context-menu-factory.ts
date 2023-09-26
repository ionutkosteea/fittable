import {
  asTableCols,
  asTableMergedRegions,
  asTableRows,
} from 'fittable-core/model';
import {
  Window,
  ContextMenuFactory,
  ControlArgs,
} from 'fittable-core/view-model';

import { FitSeparator } from '../common/controls/fit-separator.js';
import { FitWindow } from '../common/controls/fit-window.js';

import {
  createRowInsertAboveMenuItem,
  createRowInsertBelowMenuItem,
  createRowRemoveMenuItem,
  createRowResizeMenuItem,
} from './controls/row-menu-items.js';
import {
  createColInsertLeftMenuItem,
  createColInsertRightMenuItem,
  createColRemoveMenuItem,
  createColResizeMenuItem,
} from './controls/col-menu-items.js';
import {
  createCellClearMenuItem,
  createCellCopyMenuItem,
  createCellCutMenuItem,
  createCellMergeMenuItem,
  createCellPasteMenuItem,
  createCellRemoveMenuItem,
  createCellUnmergeMenuItem,
} from './controls/cell-menu-items.js';

export type FitContextMenuControlId =
  | 'row-height'
  | 'row-insert-before'
  | 'row-insert-after'
  | 'row-remove'
  | 'column-width'
  | 'column-insert-before'
  | 'column-insert-after'
  | 'column-remove'
  | 'clear'
  | 'remove'
  | 'cut'
  | 'copy'
  | 'paste'
  | 'merge'
  | 'unmerge'
  | `${'separator'}${string}`;

export class FitContextMenuFactory implements ContextMenuFactory {
  public createContextMenu(args: ControlArgs): Window {
    const window: FitWindow<FitContextMenuControlId> = new FitWindow();
    const hideWindowFn = (): void => {
      window.setVisible(false);
    };
    if (asTableRows(args.operationExecutor.getTable()) !== undefined) {
      window.addControl(
        'row-height',
        createRowResizeMenuItem(hideWindowFn, args)
      );
    }
    window
      .addControl(
        'row-insert-before',
        createRowInsertAboveMenuItem(hideWindowFn, args)
      )
      .addControl(
        'row-insert-after',
        createRowInsertBelowMenuItem(hideWindowFn, args)
      )
      .addControl('row-remove', createRowRemoveMenuItem(hideWindowFn, args))
      .addControl('separator1', new FitSeparator());
    if (asTableCols(args.operationExecutor.getTable()) !== undefined) {
      window.addControl(
        'column-width',
        createColResizeMenuItem(hideWindowFn, args)
      );
    }
    window
      .addControl(
        'column-insert-before',
        createColInsertLeftMenuItem(hideWindowFn, args)
      )
      .addControl(
        'column-insert-after',
        createColInsertRightMenuItem(hideWindowFn, args)
      )
      .addControl('column-remove', createColRemoveMenuItem(hideWindowFn, args))
      .addControl('separator2', new FitSeparator());
    window
      .addControl('clear', createCellClearMenuItem(hideWindowFn, args))
      .addControl('remove', createCellRemoveMenuItem(hideWindowFn, args))
      .addControl('cut', createCellCutMenuItem(hideWindowFn, args))
      .addControl('copy', createCellCopyMenuItem(hideWindowFn, args))
      .addControl('paste', createCellPasteMenuItem(hideWindowFn, args));
    if (asTableMergedRegions(args.operationExecutor.getTable()) !== undefined) {
      window
        .addControl('merge', createCellMergeMenuItem(hideWindowFn, args))
        .addControl('unmerge', createCellUnmergeMenuItem(hideWindowFn, args));
    }
    return window;
  }
}

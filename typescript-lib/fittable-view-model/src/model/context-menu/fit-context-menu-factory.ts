import {
  asTableCols,
  asTableMergedRegions,
  asTableRows,
} from 'fittable-core/model/index.js';
import { Window, ContextMenuFactory } from 'fittable-core/view-model/index.js';

import { FitSeparator } from '../common/controls/fit-separator.js';
import { FitWindow } from '../common/controls/fit-window.js';
import { FitControlArgs } from '../toolbar/controls/common/fit-control-args.js';

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
  public createContextMenu(args: FitControlArgs): Window {
    const window: FitWindow<FitContextMenuControlId> = new FitWindow();
    if (asTableRows(args.operationExecutor.getTable()) !== undefined) {
      window.addControl('row-height', createRowResizeMenuItem(args));
    }
    window
      .addControl('row-insert-before', createRowInsertAboveMenuItem(args))
      .addControl('row-insert-after', createRowInsertBelowMenuItem(args))
      .addControl('row-remove', createRowRemoveMenuItem(args))
      .addControl('separator1', new FitSeparator());
    if (asTableCols(args.operationExecutor.getTable()) !== undefined) {
      window.addControl('column-width', createColResizeMenuItem(args));
    }
    window
      .addControl('column-insert-before', createColInsertLeftMenuItem(args))
      .addControl('column-insert-after', createColInsertRightMenuItem(args))
      .addControl('column-remove', createColRemoveMenuItem(args))
      .addControl('separator2', new FitSeparator());
    window
      .addControl('clear', createCellClearMenuItem(args))
      .addControl('remove', createCellRemoveMenuItem(args))
      .addControl('cut', createCellCutMenuItem(args))
      .addControl('copy', createCellCopyMenuItem(args))
      .addControl('paste', createCellPasteMenuItem(args));
    if (asTableMergedRegions(args.operationExecutor.getTable()) !== undefined) {
      window
        .addControl('merge', createCellMergeMenuItem(args))
        .addControl('unmerge', createCellUnmergeMenuItem(args));
    }
    return window;
  }
}

import {
  Window,
  ContextMenuFactory,
  ControlArgs,
} from 'fit-core/view-model/index.js';

import { FitSeparator } from '../../common/controls/fit-separator.js';
import { FitWindow } from '../../common/controls/fit-window.js';

import {
  RowInsertAboveMenuItem,
  RowInsertBelowMenuItem,
  RowRemoveMenuItem,
  RowResizeMenuItem,
} from './controls/row-menu-items.js';
import {
  ColInsertLeftMenuItem,
  ColInsertRightMenuItem,
  ColRemoveMenuItem,
  ColResizeMenuItem,
} from './controls/col-menu-items.js';
import {
  CellClearMenuItem,
  CellCopyMenuItem,
  CellCutMenuItem,
  CellMergeMenuItem,
  CellPasteMenuItem,
  CellRemoveMenuItem,
  CellUnmergeMenuItem,
} from './controls/cell-menu-items.js';
import {
  asTableCols,
  asTableMergedRegions,
  asTableRows,
} from 'fit-core/model/table.js';

export type FitContextMenuControlId =
  | 'row-width'
  | 'row-insert-before'
  | 'row-insert-after'
  | 'row-remove'
  | 'column-height'
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
    if (asTableRows(args.operationExecutor.getTable()) !== undefined) {
      window.addControl('row-width', new RowResizeMenuItem(args));
    }
    window
      .addControl('row-insert-before', new RowInsertAboveMenuItem(args))
      .addControl('row-insert-after', new RowInsertBelowMenuItem(args))
      .addControl('row-remove', new RowRemoveMenuItem(args))
      .addControl('separator1', new FitSeparator());
    if (asTableCols(args.operationExecutor.getTable()) !== undefined) {
      window.addControl('column-height', new ColResizeMenuItem(args));
    }
    window
      .addControl('column-insert-before', new ColInsertLeftMenuItem(args))
      .addControl('column-insert-after', new ColInsertRightMenuItem(args))
      .addControl('column-remove', new ColRemoveMenuItem(args))
      .addControl('separator2', new FitSeparator());
    window
      .addControl('clear', new CellClearMenuItem(args))
      .addControl('remove', new CellRemoveMenuItem(args))
      .addControl('cut', new CellCutMenuItem(args))
      .addControl('copy', new CellCopyMenuItem(args))
      .addControl('paste', new CellPasteMenuItem(args));
    if (asTableMergedRegions(args.operationExecutor.getTable()) !== undefined) {
      window
        .addControl('merge', new CellMergeMenuItem(args))
        .addControl('unmerge', new CellUnmergeMenuItem(args));
    }
    return window;
  }
}

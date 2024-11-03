import { CellCopyChange } from '../table-change-writter/cell/cell-copy-change-writter.js';
import { CellRemoveChange } from '../table-change-writter/cell/cell-remove-change-writter.js';
import { CellValueChange } from '../table-change-writter/cell/cell-value-change-writter.js';
import {
  RowHeighChange,
  ColWidthChange,
} from '../table-change-writter/line/line-dimension-change-writter.js';
import {
  RowInsertChange,
  ColInsertChange,
} from '../table-change-writter/line/line-insert-change-writter.js';
import {
  RowRemoveChange,
  ColRemoveChange,
} from '../table-change-writter/line/line-remove-change-writter.js';
import { StyleChange } from '../table-change-writter/style/style-change-writter.js';

import { CellCopyArgs } from '../table-changes/cell/cell-copy-changes.js';
import { CellPasteArgs } from '../table-changes/cell/cell-paste-changes.js';
import { CellRemoveArgs } from '../table-changes/cell/cell-remove-changes.js';
import { CellValueArgs } from '../table-changes/cell/cell-value-changes.js';
import {
  ColWidthTableChangesArgs,
  RowHeightTableChangesArgs,
} from '../table-changes/line/line-dimension-changes.js';
import {
  RowInsertTableChangesArgs,
  ColInsertTableChangesArgs,
} from '../table-changes/line/line-insert-changes.js';
import {
  RowRemoveArgs,
  ColRemoveArgs,
} from '../table-changes/line/line-remove-changes.js';
import { StyleBorderArgs } from '../table-changes/style/style-border-changes.js';
import { PaintFormatArgs } from '../table-changes/style/paint-format-changes.js';
import { StyleRemoveArgs } from '../table-changes/style/style-remove-changes.js';
import { StyleUpdateArgs } from '../table-changes/style/style-update-changes.js';
import { CellCutArgs } from '../table-changes/cell/cell-cut-changes.js';
import { MergedRegionsChange } from '../table-change-writter/merged-regions/merged-regions-change-writter.js';
import { CellMergeArgs } from '../table-changes/merged-regions/cell-merge-changes.js';
import { CellUnmergeArgs } from '../table-changes/merged-regions/cell-unmerge-changes.js';
import { CellDataTypeArgs } from '../table-changes/cell/cell-data-type-changes.js';
import { DataTypeChange } from '../table-change-writter/cell/cell-data-type-change-writter.js';

export type FitOperationArgs =
  | CellCutArgs
  | CellCopyArgs
  | CellPasteArgs
  | CellRemoveArgs
  | CellValueArgs
  | CellDataTypeArgs
  | CellMergeArgs
  | CellUnmergeArgs
  | RowHeightTableChangesArgs
  | ColWidthTableChangesArgs
  | RowInsertTableChangesArgs
  | ColInsertTableChangesArgs
  | RowRemoveArgs
  | ColRemoveArgs
  | StyleBorderArgs
  | PaintFormatArgs
  | StyleRemoveArgs
  | StyleUpdateArgs;

export type FitOperationId =
  | CellCutArgs['id']
  | CellCopyArgs['id']
  | CellPasteArgs['id']
  | CellRemoveArgs['id']
  | CellValueArgs['id']
  | CellDataTypeArgs['id']
  | CellMergeArgs['id']
  | CellUnmergeArgs['id']
  | RowHeightTableChangesArgs['id']
  | ColWidthTableChangesArgs['id']
  | RowInsertTableChangesArgs['id']
  | ColInsertTableChangesArgs['id']
  | RowRemoveArgs['id']
  | ColRemoveArgs['id']
  | StyleBorderArgs['id']
  | PaintFormatArgs['id']
  | StyleRemoveArgs['id']
  | StyleUpdateArgs['id'];

export type FitTableChangeId =
  | CellCopyChange['id']
  | CellRemoveChange['id']
  | CellValueChange['id']
  | DataTypeChange['id']
  | RowHeighChange['id']
  | ColWidthChange['id']
  | RowInsertChange['id']
  | ColInsertChange['id']
  | RowRemoveChange['id']
  | ColRemoveChange['id']
  | StyleChange['id']
  | MergedRegionsChange['id'];

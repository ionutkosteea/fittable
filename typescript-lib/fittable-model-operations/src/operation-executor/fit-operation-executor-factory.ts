import { OperationExecutorFactory } from 'fittable-core/operations';

import { CellCopyChangeWritterFactory } from '../table-change-writter/cell/cell-copy-change-writter.js';
import { CellRemoveChangeWritterFactory } from '../table-change-writter/cell/cell-remove-change-writter.js';
import { CellValueChangeWritterFactory } from '../table-change-writter/cell/cell-value-change-writter.js';
import {
  ColWidthChangeWritterFactory,
  RowHeightChangeWritterFactory,
} from '../table-change-writter/line/line-dimension-change-writter.js';
import {
  ColInsertChangeWritterFactory,
  RowInsertChangeWritterFactory,
} from '../table-change-writter/line/line-insert-change-writter.js';
import {
  ColRemoveChangeWritterFactory,
  RowRemoveChangeWritterFactory,
} from '../table-change-writter/line/line-remove-change-writter.js';
import { StyleChangeWritterFactory } from '../table-change-writter/style/style-change-writter.js';

import { CellCopyChangesFactory } from '../table-changes/cell/cell-copy-changes.js';
import { CellPasteChangesFactory } from '../table-changes/cell/cell-paste-changes.js';
import { CellRemoveChangesFactory } from '../table-changes/cell/cell-remove-changes.js';
import { CellValueChangesFactory } from '../table-changes/cell/cell-value-changes.js';
import {
  ColWidthChangesFactory,
  RowHeightChangesFactory,
} from '../table-changes/line/line-dimension-changes.js';
import {
  ColInsertChangesFactory,
  RowInsertChangesFactory,
} from '../table-changes/line/line-insert-changes.js';
import {
  ColRemoveChangesFactory,
  RowRemoveChangesFactory,
} from '../table-changes/line/line-remove-changes.js';
import { StyleBorderChangesFactory } from '../table-changes/style/style-border-changes.js';
import { PaintFormatChangesFactory } from '../table-changes/style/paint-format-changes.js';
import { StyleRemoveChangesFactory } from '../table-changes/style/style-remove-changes.js';
import { StyleUpdateChangesFactory } from '../table-changes/style/style-update-changes.js';
import { CellCutChangesFactory } from '../table-changes/cell/cell-cut-changes.js';
import { FitOperationExecutor } from './fit-operation-executor.js';
import { MergedRegionsChangeWritterFactory } from '../table-change-writter/merged-regions/merged-regions-change-writter.js';
import { CellMergeChangesFactory } from '../table-changes/merged-regions/cell-merge-changes.js';
import { CellUnmergeChangesFactory } from '../table-changes/merged-regions/cell-unmerge-changes.js';
import { CellDataTypeChangeWritterFactory } from '../table-change-writter/cell/cell-data-type-change-writter.js';
import { CellDataTypeChangesFactory } from '../table-changes/cell/cell-data-type-changes.js';

export class FitOperationExecutorFactory implements OperationExecutorFactory {
  public createOperationExecutor(): FitOperationExecutor {
    return new FitOperationExecutor()
      .bindTableChangeWritterFactory(
        'column-width',
        ColWidthChangeWritterFactory
      )
      .bindTableChangeWritterFactory(
        'column-insert',
        ColInsertChangeWritterFactory
      )
      .bindTableChangeWritterFactory(
        'column-remove',
        ColRemoveChangeWritterFactory
      )
      .bindTableChangeWritterFactory(
        'row-height',
        RowHeightChangeWritterFactory
      )
      .bindTableChangeWritterFactory(
        'row-remove',
        RowRemoveChangeWritterFactory
      )
      .bindTableChangeWritterFactory(
        'row-insert',
        RowInsertChangeWritterFactory
      )
      .bindTableChangeWritterFactory(
        'cell-value',
        CellValueChangeWritterFactory
      )
      .bindTableChangeWritterFactory(
        'cell-data-type',
        CellDataTypeChangeWritterFactory
      )
      .bindTableChangeWritterFactory('cell-copy', CellCopyChangeWritterFactory)
      .bindTableChangeWritterFactory(
        'cell-remove',
        CellRemoveChangeWritterFactory
      )
      .bindTableChangeWritterFactory(
        'merged-regions',
        MergedRegionsChangeWritterFactory
      )
      .bindTableChangeWritterFactory('style-update', StyleChangeWritterFactory)
      .bindTableChangesFactory('row-height', RowHeightChangesFactory)
      .bindTableChangesFactory('row-insert', RowInsertChangesFactory)
      .bindTableChangesFactory('row-remove', RowRemoveChangesFactory)
      .bindTableChangesFactory('column-width', ColWidthChangesFactory)
      .bindTableChangesFactory('column-insert', ColInsertChangesFactory)
      .bindTableChangesFactory('column-remove', ColRemoveChangesFactory)
      .bindTableChangesFactory('cell-value', CellValueChangesFactory)
      .bindTableChangesFactory('cell-data-type', CellDataTypeChangesFactory)
      .bindTableChangesFactory('cell-cut', CellCutChangesFactory)
      .bindTableChangesFactory('cell-copy', CellCopyChangesFactory)
      .bindTableChangesFactory('cell-paste', CellPasteChangesFactory)
      .bindTableChangesFactory('cell-remove', CellRemoveChangesFactory)
      .bindTableChangesFactory('cell-merge', CellMergeChangesFactory)
      .bindTableChangesFactory('cell-unmerge', CellUnmergeChangesFactory)
      .bindTableChangesFactory('paint-format', PaintFormatChangesFactory)
      .bindTableChangesFactory('style-update', StyleUpdateChangesFactory)
      .bindTableChangesFactory('style-border', StyleBorderChangesFactory)
      .bindTableChangesFactory('style-remove', StyleRemoveChangesFactory);
  }
}

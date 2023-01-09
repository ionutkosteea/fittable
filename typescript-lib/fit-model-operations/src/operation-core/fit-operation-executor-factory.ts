import { OperationExecutorFactory } from 'fit-core/operations/index.js';

import {
  CellCopyOperationStepDto,
  CellCopyOperationStepFactory,
} from '../operation-steps/cell/cell-copy-operation-step.js';
import {
  CellRemoveOperationStepDto,
  CellRemoveOperationStepFactory,
} from '../operation-steps/cell/cell-remove-operation-step.js';
import {
  CellValueOperationStepDto,
  CellValueOperationStepFactory,
} from '../operation-steps/cell/cell-value-operation-step.js';
import {
  RowHeightOperationStepDto,
  ColumnWidthOperationStepDto,
  ColumnWidthOperationStepFactory,
  RowHeightOperationStepFactory,
} from '../operation-steps/line/line-dimension-operation-step.js';
import {
  RowInsertOperationStepDto,
  ColumnInsertOperationStepDto,
  ColumnInsertOperationStepFactory,
  RowInsertOperationStepFactory,
} from '../operation-steps/line/line-insert-operation-step.js';
import {
  RowRemoveOperationStepDto,
  ColumnRemoveOperationStepDto,
  ColumnRemoveOperationStepFactory,
  RowRemoveOperationStepFactory,
} from '../operation-steps/line/line-remove-operation-step.js';
import {
  StyleOperationStepDto,
  StyleOperationStepFactory,
} from '../operation-steps/style/style-operation-step.js';

import {
  CellCopyOperationDtoArgs,
  CellCopyOperationDtoFactory,
} from '../operation-dtos/cell/cell-copy-operation-dto.js';
import {
  CellPasteOperationDtoArgs,
  CellPasteOperationDtoFactory,
} from '../operation-dtos/cell/cell-paste-operation-dto.js';
import {
  CellRemoveOperationDtoArgs,
  CellRemoveOperationDtoFactory,
} from '../operation-dtos/cell/cell-remove-operation-dto.js';
import {
  CellValueOperationDtoArgs,
  CellValueOperationDtoFactory,
} from '../operation-dtos/cell/cell-value-operation-dto.js';
import {
  ColumnWidthOperationDtoArgs,
  RowHeightOperationDtoArgs,
  ColumnWidthOperationDtoFactory,
  RowHeightOperationDtoFactory,
} from '../operation-dtos/line/line-dimension-operation-dto.js';
import {
  RowInsertOperationDtoArgs,
  ColumnInsertOperationDtoArgs,
  ColumnInsertOperationDtoFactory,
  RowInsertOperationDtoFactory,
} from '../operation-dtos/line/line-insert-operation-dto.js';
import {
  RowRemoveOperationDtoArgs,
  ColumnRemoveOperationDtoArgs,
  ColumnRemoveOperationDtoFactory,
  RowRemoveOperationDtoFactory,
} from '../operation-dtos/line/line-remove-operation-dto.js';
import {
  StyleBorderOperationDtoArgs,
  StyleBorderOperationDtoFactory,
} from '../operation-dtos/style/style-border-operation-dto.js';
import {
  StyleNameOperationDtoArgs,
  StyleNameOperationDtoFactory,
} from '../operation-dtos/style/style-name-operation-dto.js';
import {
  StyleRemoveOperationDtoArgs,
  StyleRemoveOperationDtoFactory,
} from '../operation-dtos/style/style-remove-operation-dto.js';
import {
  StyleUpdateOperationDtoArgs,
  StyleUpdateOperationDtoFactory,
} from '../operation-dtos/style/style-update-operation-dto.js';
import {
  CellCutOperationDtoArgs,
  CellCutOperationDtoFactory,
} from '../operation-dtos/cell/cell-cut-operation-dto.js';
import { FitOperationExecutor } from './fit-operation-executor.js';
import {
  MergedRegionsOperationStepDto,
  MergedRegionsOperationStepFactory,
} from '../operation-steps/merged-regions/merged-regions-operation-step.js';
import {
  CellMergeOperationDtoArgs,
  CellMergeOperationDtoFactory,
} from '../operation-dtos/merged-regions/cell-merge-operation-dto.js';
import {
  CellUnmergeOperationDtoArgs,
  CellUnmergeOperationDtoFactory,
} from '../operation-dtos/merged-regions/cell-unmerge-operation-dto.js';

export type FitOperationDtoArgs =
  | CellCutOperationDtoArgs
  | CellCopyOperationDtoArgs
  | CellPasteOperationDtoArgs
  | CellRemoveOperationDtoArgs
  | CellValueOperationDtoArgs
  | CellMergeOperationDtoArgs
  | CellUnmergeOperationDtoArgs
  | RowHeightOperationDtoArgs
  | ColumnWidthOperationDtoArgs
  | RowInsertOperationDtoArgs
  | ColumnInsertOperationDtoArgs
  | RowRemoveOperationDtoArgs
  | ColumnRemoveOperationDtoArgs
  | StyleBorderOperationDtoArgs
  | StyleNameOperationDtoArgs
  | StyleRemoveOperationDtoArgs
  | StyleUpdateOperationDtoArgs;

export type FitOperationStepId =
  | CellCopyOperationStepDto['id']
  | CellRemoveOperationStepDto['id']
  | CellValueOperationStepDto['id']
  | RowHeightOperationStepDto['id']
  | ColumnWidthOperationStepDto['id']
  | RowInsertOperationStepDto['id']
  | ColumnInsertOperationStepDto['id']
  | RowRemoveOperationStepDto['id']
  | ColumnRemoveOperationStepDto['id']
  | StyleOperationStepDto['id']
  | MergedRegionsOperationStepDto['id'];

export class FitOperationExecutorFactory implements OperationExecutorFactory {
  public createOperationExecutor(): FitOperationExecutor<
    FitOperationDtoArgs,
    FitOperationStepId
  > {
    return new FitOperationExecutor<FitOperationDtoArgs, FitOperationStepId>()
      .bindOperationStepFactory('column-width', ColumnWidthOperationStepFactory)
      .bindOperationStepFactory(
        'column-insert',
        ColumnInsertOperationStepFactory
      )
      .bindOperationStepFactory(
        'column-remove',
        ColumnRemoveOperationStepFactory
      )
      .bindOperationStepFactory('row-height', RowHeightOperationStepFactory)
      .bindOperationStepFactory('row-remove', RowRemoveOperationStepFactory)
      .bindOperationStepFactory('row-insert', RowInsertOperationStepFactory)
      .bindOperationStepFactory('cell-value', CellValueOperationStepFactory)
      .bindOperationStepFactory('cell-copy', CellCopyOperationStepFactory)
      .bindOperationStepFactory('cell-remove', CellRemoveOperationStepFactory)
      .bindOperationStepFactory(
        'merged-regions',
        MergedRegionsOperationStepFactory
      )
      .bindOperationStepFactory('style', StyleOperationStepFactory)
      .bindOperationDtoFactory('row-height', RowHeightOperationDtoFactory)
      .bindOperationDtoFactory('row-insert', RowInsertOperationDtoFactory)
      .bindOperationDtoFactory('row-remove', RowRemoveOperationDtoFactory)
      .bindOperationDtoFactory('column-width', ColumnWidthOperationDtoFactory)
      .bindOperationDtoFactory('column-insert', ColumnInsertOperationDtoFactory)
      .bindOperationDtoFactory('column-remove', ColumnRemoveOperationDtoFactory)
      .bindOperationDtoFactory('cell-value', CellValueOperationDtoFactory)
      .bindOperationDtoFactory('cell-cut', CellCutOperationDtoFactory)
      .bindOperationDtoFactory('cell-copy', CellCopyOperationDtoFactory)
      .bindOperationDtoFactory('cell-paste', CellPasteOperationDtoFactory)
      .bindOperationDtoFactory('cell-remove', CellRemoveOperationDtoFactory)
      .bindOperationDtoFactory('cell-merge', CellMergeOperationDtoFactory)
      .bindOperationDtoFactory('cell-unmerge', CellUnmergeOperationDtoFactory)
      .bindOperationDtoFactory('style-name', StyleNameOperationDtoFactory)
      .bindOperationDtoFactory('style-update', StyleUpdateOperationDtoFactory)
      .bindOperationDtoFactory('style-border', StyleBorderOperationDtoFactory)
      .bindOperationDtoFactory('style-remove', StyleRemoveOperationDtoFactory);
  }
}

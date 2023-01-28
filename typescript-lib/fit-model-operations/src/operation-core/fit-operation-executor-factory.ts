import { OperationExecutorFactory } from 'fit-core/operations/index.js';

import { CellCopyOperationStepFactory } from '../operation-steps/cell/cell-copy-operation-step.js';
import { CellRemoveOperationStepFactory } from '../operation-steps/cell/cell-remove-operation-step.js';
import { CellValueOperationStepFactory } from '../operation-steps/cell/cell-value-operation-step.js';
import {
  ColWidthOperationStepFactory,
  RowHeightOperationStepFactory,
} from '../operation-steps/line/line-dimension-operation-step.js';
import {
  ColInsertOperationStepFactory,
  RowInsertOperationStepFactory,
} from '../operation-steps/line/line-insert-operation-step.js';
import {
  ColRemoveOperationStepFactory,
  RowRemoveOperationStepFactory,
} from '../operation-steps/line/line-remove-operation-step.js';
import { StyleOperationStepFactory } from '../operation-steps/style/style-operation-step.js';

import { CellCopyOperationDtoFactory } from '../operation-dtos/cell/cell-copy-operation-dto.js';
import { CellPasteOperationDtoFactory } from '../operation-dtos/cell/cell-paste-operation-dto.js';
import { CellRemoveOperationDtoFactory } from '../operation-dtos/cell/cell-remove-operation-dto.js';
import { CellValueOperationDtoFactory } from '../operation-dtos/cell/cell-value-operation-dto.js';
import {
  ColWidthOperationDtoFactory,
  RowHeightOperationDtoFactory,
} from '../operation-dtos/line/line-dimension-operation-dto.js';
import {
  ColInsertOperationDtoFactory,
  RowInsertOperationDtoFactory,
} from '../operation-dtos/line/line-insert-operation-dto.js';
import {
  ColRemoveOperationDtoFactory,
  RowRemoveOperationDtoFactory,
} from '../operation-dtos/line/line-remove-operation-dto.js';
import { StyleBorderOperationDtoFactory } from '../operation-dtos/style/style-border-operation-dto.js';
import { StyleNameOperationDtoFactory } from '../operation-dtos/style/style-name-operation-dto.js';
import { StyleRemoveOperationDtoFactory } from '../operation-dtos/style/style-remove-operation-dto.js';
import { StyleUpdateOperationDtoFactory } from '../operation-dtos/style/style-update-operation-dto.js';
import { CellCutOperationDtoFactory } from '../operation-dtos/cell/cell-cut-operation-dto.js';
import { FitOperationExecutor } from './fit-operation-executor.js';
import { MergedRegionsOperationStepFactory } from '../operation-steps/merged-regions/merged-regions-operation-step.js';
import { CellMergeOperationDtoFactory } from '../operation-dtos/merged-regions/cell-merge-operation-dto.js';
import { CellUnmergeOperationDtoFactory } from '../operation-dtos/merged-regions/cell-unmerge-operation-dto.js';

export class FitOperationExecutorFactory implements OperationExecutorFactory {
  public createOperationExecutor(): FitOperationExecutor {
    return new FitOperationExecutor()
      .bindOperationStepFactory('column-width', ColWidthOperationStepFactory)
      .bindOperationStepFactory('column-insert', ColInsertOperationStepFactory)
      .bindOperationStepFactory('column-remove', ColRemoveOperationStepFactory)
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
      .bindOperationDtoFactory('column-width', ColWidthOperationDtoFactory)
      .bindOperationDtoFactory('column-insert', ColInsertOperationDtoFactory)
      .bindOperationDtoFactory('column-remove', ColRemoveOperationDtoFactory)
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

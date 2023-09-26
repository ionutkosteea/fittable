import { CellCopyOperationStepDto } from '../operation-steps/cell/cell-copy-operation-step.js';
import { CellRemoveOperationStepDto } from '../operation-steps/cell/cell-remove-operation-step.js';
import { CellValueOperationStepDto } from '../operation-steps/cell/cell-value-operation-step.js';
import {
  RowHeightOperationStepDto,
  ColWidthOperationStepDto,
} from '../operation-steps/line/line-dimension-operation-step.js';
import {
  RowInsertOperationStepDto,
  ColInsertOperationStepDto,
} from '../operation-steps/line/line-insert-operation-step.js';
import {
  RowRemoveOperationStepDto,
  ColRemoveOperationStepDto,
} from '../operation-steps/line/line-remove-operation-step.js';
import { StyleOperationStepDto } from '../operation-steps/style/style-operation-step.js';

import { CellCopyOperationDtoArgs } from '../operation-dtos/cell/cell-copy-operation-dto.js';
import { CellPasteOperationDtoArgs } from '../operation-dtos/cell/cell-paste-operation-dto.js';
import { CellRemoveOperationDtoArgs } from '../operation-dtos/cell/cell-remove-operation-dto.js';
import { CellValueOperationDtoArgs } from '../operation-dtos/cell/cell-value-operation-dto.js';
import {
  ColWidthOperationDtoArgs,
  RowHeightOperationDtoArgs,
} from '../operation-dtos/line/line-dimension-operation-dto.js';
import {
  RowInsertOperationDtoArgs,
  ColInsertOperationDtoArgs,
} from '../operation-dtos/line/line-insert-operation-dto.js';
import {
  RowRemoveOperationDtoArgs,
  ColRemoveOperationDtoArgs,
} from '../operation-dtos/line/line-remove-operation-dto.js';
import { StyleBorderOperationDtoArgs } from '../operation-dtos/style/style-border-operation-dto.js';
import { PaintFormatOperationDtoArgs } from '../operation-dtos/style/paint-format-operation-dto.js';
import { StyleRemoveOperationDtoArgs } from '../operation-dtos/style/style-remove-operation-dto.js';
import { StyleUpdateOperationDtoArgs } from '../operation-dtos/style/style-update-operation-dto.js';
import { CellCutOperationDtoArgs } from '../operation-dtos/cell/cell-cut-operation-dto.js';
import { MergedRegionsOperationStepDto } from '../operation-steps/merged-regions/merged-regions-operation-step.js';
import { CellMergeOperationDtoArgs } from '../operation-dtos/merged-regions/cell-merge-operation-dto.js';
import { CellUnmergeOperationDtoArgs } from '../operation-dtos/merged-regions/cell-unmerge-operation-dto.js';
import { CellDataTypeOperationDtoArgs } from '../operation-dtos/cell/cell-data-type-operation-dto.js';
import { CellDataTypeOperationStepDto } from '../operation-steps/cell/cell-data-type-operation-step.js';

export type FitOperationArgs =
  | CellCutOperationDtoArgs
  | CellCopyOperationDtoArgs
  | CellPasteOperationDtoArgs
  | CellRemoveOperationDtoArgs
  | CellValueOperationDtoArgs
  | CellDataTypeOperationDtoArgs
  | CellMergeOperationDtoArgs
  | CellUnmergeOperationDtoArgs
  | RowHeightOperationDtoArgs
  | ColWidthOperationDtoArgs
  | RowInsertOperationDtoArgs
  | ColInsertOperationDtoArgs
  | RowRemoveOperationDtoArgs
  | ColRemoveOperationDtoArgs
  | StyleBorderOperationDtoArgs
  | PaintFormatOperationDtoArgs
  | StyleRemoveOperationDtoArgs
  | StyleUpdateOperationDtoArgs;

export type FitOperationDtoId =
  | CellCutOperationDtoArgs['id']
  | CellCopyOperationDtoArgs['id']
  | CellPasteOperationDtoArgs['id']
  | CellRemoveOperationDtoArgs['id']
  | CellValueOperationDtoArgs['id']
  | CellDataTypeOperationDtoArgs['id']
  | CellMergeOperationDtoArgs['id']
  | CellUnmergeOperationDtoArgs['id']
  | RowHeightOperationDtoArgs['id']
  | ColWidthOperationDtoArgs['id']
  | RowInsertOperationDtoArgs['id']
  | ColInsertOperationDtoArgs['id']
  | RowRemoveOperationDtoArgs['id']
  | ColRemoveOperationDtoArgs['id']
  | StyleBorderOperationDtoArgs['id']
  | PaintFormatOperationDtoArgs['id']
  | StyleRemoveOperationDtoArgs['id']
  | StyleUpdateOperationDtoArgs['id'];

export type FitOperationStepId =
  | CellCopyOperationStepDto['id']
  | CellRemoveOperationStepDto['id']
  | CellValueOperationStepDto['id']
  | CellDataTypeOperationStepDto['id']
  | RowHeightOperationStepDto['id']
  | ColWidthOperationStepDto['id']
  | RowInsertOperationStepDto['id']
  | ColInsertOperationStepDto['id']
  | RowRemoveOperationStepDto['id']
  | ColRemoveOperationStepDto['id']
  | StyleOperationStepDto['id']
  | MergedRegionsOperationStepDto['id'];

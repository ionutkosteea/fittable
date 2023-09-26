import { Table } from '../model/table/table.js';
import {
  OperationExecutor,
  createOperationExecutor,
} from '../operations/operation-core.js';
import { ViewModel, createViewModel } from './model/view-model.js';

export interface FittableDesigner {
  readonly table: Table;
  readonly operationExecutor?: OperationExecutor;
  readonly viewModel: ViewModel;
  loadTable(table: Table): void;
}

export function createFittableDesigner(
  table: Table,
  readOnly?: boolean
): FittableDesigner {
  const operationExecutor: OperationExecutor | undefined = readOnly
    ? undefined
    : createOperationExecutor();
  const viewModel: ViewModel = createViewModel(table, operationExecutor);
  return {
    get table(): Table {
      return viewModel.table;
    },
    operationExecutor,
    viewModel,
    loadTable: (table: Table): void => viewModel.loadTable(table),
  };
}

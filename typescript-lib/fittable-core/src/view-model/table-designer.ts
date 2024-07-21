import { Table } from '../model/table/table.js';
import {
  OperationExecutor,
} from '../operations/operation-core.js';
import { ViewModel } from './model/view-model.js';
import { getViewModelConfig } from './view-model-config.js';

export interface TableDesigner {
  readonly table: Table;
  readonly operationExecutor?: OperationExecutor;
  readonly viewModel: ViewModel;
  loadTable(table: Table): void;
}

export interface TableDesignerFactory {
  createTableDesigner(table: Table, readOnly?: boolean): TableDesigner;
}

export function createTableDesigner(table: Table, readOnly?: boolean): TableDesigner {
  return getViewModelConfig().tableDesignerFactory.createTableDesigner(table, readOnly);
}

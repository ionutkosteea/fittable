import { Table } from '../model/table.js';
import {
  OperationExecutor,
  createOperationExecutor,
} from '../operations/operation-core.js';
import { ViewModel, createViewModel } from './model/view-model.js';
import {
  HostListeners,
  createHostListeners,
} from './host-listeners/host-listeners.js';

export interface FittableDesigner {
  readonly table: Table;
  readonly operationExecutor?: OperationExecutor;
  readonly viewModel: ViewModel;
  readonly hostListeners: HostListeners;
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
  const hostListeners: HostListeners = createHostListeners(viewModel);
  return {
    get table(): Table {
      return viewModel.table;
    },
    operationExecutor,
    viewModel,
    hostListeners,
    loadTable: (table: Table): void => viewModel.loadTable(table),
  };
}

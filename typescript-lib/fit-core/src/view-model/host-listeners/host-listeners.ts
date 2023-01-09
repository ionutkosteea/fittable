import { ViewModel } from '../model/view-model.js';

import { getViewModelConfig } from '../view-model-config.js';
import { CellEditorListener } from './cell-editor-listener.js';
import { CellSelectionListener } from './cell-selection-listener.js';
import { TableScrollerListener } from './table-scroller-listener.js';
import { WindowListener } from './window-listener.js';
import { InputControlListener } from './input-control-listener.js';

export interface HostListeners {
  tableScrollerListener: TableScrollerListener;
  cellSelectionListener?: CellSelectionListener;
  cellEditorListener?: CellEditorListener;
  windowListener?: WindowListener;
  inputControlListener?: InputControlListener;
  destroy(): void;
}

export interface HostListenersFactory {
  createHostListeners(viewModel: ViewModel): HostListeners;
}
export function createHostListeners<T extends HostListeners>(
  viewModel: ViewModel
): T {
  return getViewModelConfig().hostListenersFactory.createHostListeners(
    viewModel
  ) as T;
}

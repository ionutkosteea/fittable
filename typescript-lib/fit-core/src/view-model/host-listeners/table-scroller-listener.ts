import { TableScroller, TableScrollerCore } from '../model/table-scroller.js';
import { getViewModelConfig } from '../view-model-config.js';
import { FitEvent } from './custom-events.js';

export interface TableScrollerListener {
  onInit(core: TableScrollerCore): void;
  onScroll(event?: FitEvent): void;
}

export interface TableScrollerListenerFactory {
  createTableScrollerListener(scroller: TableScroller): TableScrollerListener;
}

export function createTableScrollerListener(
  scroller: TableScroller
): TableScrollerListener {
  return getViewModelConfig().tableScrollerListenerFactory.createTableScrollerListener(
    scroller
  );
}

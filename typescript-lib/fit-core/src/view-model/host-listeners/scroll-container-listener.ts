import { ScrollContainer, ScrollElement } from '../model/scroll-container.js';
import { getViewModelConfig } from '../view-model-config.js';
import { FitEvent } from './custom-events.js';

export interface ScrollContainerListener {
  onScroll(event?: FitEvent): void;
}

export interface ScrollContainerListenerFactory {
  createScrollContainerListener(
    div: ScrollElement,
    scroller: ScrollContainer
  ): ScrollContainerListener;
}

export function createScrollContainerListener(
  div: ScrollElement,
  scroller: ScrollContainer
): ScrollContainerListener {
  return getViewModelConfig()
    .scrollContainerListenerFactory //
    .createScrollContainerListener(div, scroller);
}

import { ScrollContainer } from '../model/scroll-container.js';
import { getViewModelConfig } from '../view-model-config.js';
import { FitEvent, FitHtmlDivElement } from './html-mockups.js';

export interface ScrollContainerListener {
  onScroll(event?: FitEvent): void;
}

export interface ScrollContainerListenerFactory {
  createScrollContainerListener(
    div: FitHtmlDivElement,
    scrollContainer: ScrollContainer
  ): ScrollContainerListener;
}

export function createScrollContainerListener(
  div: FitHtmlDivElement,
  scrollContainer: ScrollContainer
): ScrollContainerListener {
  return getViewModelConfig()
    .scrollContainerListenerFactory //
    .createScrollContainerListener(div, scrollContainer);
}

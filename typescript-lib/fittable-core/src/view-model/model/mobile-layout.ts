import { CssStyle } from '../../model/style.js';
import { getViewModelConfig } from '../view-model-config.js';
import { CellSelectionPainter } from './cell-selection.js';
import { ScrollContainer } from './scroll-container.js';
import { TableViewer } from './table-viewer.js';

export interface MobileLayout {
  bodyOffset: CssStyle;
  pageHeaderOffset: CssStyle;
  rowHeaderOffset: CssStyle;
  colHeaderOffset: CssStyle;
  bodySelectionRectangles: CssStyle[];
  pageHeaderSelectionRectangles: CssStyle[];
  rowHeaderSelectionRectangles: CssStyle[];
  colHeaderSelectionRectangles: CssStyle[];
  destroy(): void;
}

export type MobileLayoutArgs = {
  tableViewer: TableViewer;
  tableScrollContainer: ScrollContainer;
  cellSelectionPainter?: CellSelectionPainter;
};

export interface MobileLayoutFactory {
  createMobileLayout(args: MobileLayoutArgs): MobileLayout;
}

export function createMobileLayout(args: MobileLayoutArgs): MobileLayout {
  return getViewModelConfig().mobileLayoutFactory.createMobileLayout(args);
}

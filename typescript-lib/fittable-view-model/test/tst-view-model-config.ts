
import {
  ViewModelConfig,
  ImageRegistryFactory,
  ImageRegistry,
} from 'fittable-core/view-model';

import { FitTableDesignerFactory } from "../dist/fit-table-designer.js";
import { FitViewModelFactory } from '../dist/model/fit-view-model.js';
import { FitScrollContainerFactory } from '../dist/model/scroll-container/fit-scroll-container.js';
import { FitTableViewerFactory } from '../dist/model/table-viewer/fit-table-viewer.js';
import { FitCellSelectionFactory } from '../dist/model/cell-selection/fit-cell-selection.js';
import { FitCellSelectionPainterFactory } from '../dist/model/cell-selection/fit-cell-selection-painter.js';
import { FitScrollContainerListenerFactory } from '../dist/host-listeners/fit-scroll-container-listener.js';
import { FitMobileLayoutFactory } from '../dist/model/mobile-layout/fit-mobile-layout.js';

class TstImageRegistryFactory implements ImageRegistryFactory {
  public createImageRegistry(): ImageRegistry<string> {
    throw new Error('Method not implemented.');
  }
}

export const TST_VIEW_MODEL_CONFIG: ViewModelConfig = {
  rowHeights: 21,
  colWidths: 100,
  fontSize: 12,
  colorPalette: [],
  fontFamily: [],
  tableDesignerFactory: new FitTableDesignerFactory(),
  viewModelFactory: new FitViewModelFactory(),
  imageRegistryFactory: new TstImageRegistryFactory(),
  scrollContainerFactory: new FitScrollContainerFactory(),
  mobileLayoutFactory: new FitMobileLayoutFactory(),
  tableViewerFactory: new FitTableViewerFactory(),
  cellSelectionFactory: new FitCellSelectionFactory(),
  cellSelectionPainterFactory: new FitCellSelectionPainterFactory(),
  scrollContainerListenerFactory: new FitScrollContainerListenerFactory(),
};

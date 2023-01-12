import {
  ViewModelConfig,
  ImageRegistryFactory,
  ImageRegistry,
} from 'fit-core/view-model/index.js';

import { FitViewModelFactory } from '../../dist/model/fit-view-model.js';
import { FitLanguageDictionaryFactory } from '../../dist/model/language-dictionary/fit-language-dictionary.js';
import { FitTableScrollerFactory } from '../../dist/model/table-scroller/fit-table-scroller.js';
import { FitTableViewerFactory } from '../../dist/model/table-viewer/fit-table-viewer.js';
import { FitCellSelectionFactory } from '../../dist/model/cell-selection/fit-cell-selection.js';
import { FitCellSelectionPainterFactory } from '../../dist/model/cell-selection/fit-cell-selection-painter.js';
import { FitHostListenersFactory } from '../../dist/host-listeners/fit-host-listeners.js';
import { FitTableScrollerListenerFactory } from '../../dist/host-listeners/fit-table-scroller-listener.js';

class TstImageRegistryFactory implements ImageRegistryFactory {
  public createImageRegistry(): ImageRegistry {
    throw new Error('Method not implemented.');
  }
}

export const TST_VIEW_MODEL_CONFIG: ViewModelConfig = {
  rowHeight: 21,
  columnWidth: 100,
  rowHeaderColumnWidth: 40,
  columnHeaderRowHeight: 21,
  fontSize: 12,
  colorPalette: [],
  fontFamily: [],
  showRowHeader: true,
  showColumnHeader: true,
  viewModelFactory: new FitViewModelFactory(),
  languageDictionaryFactory: new FitLanguageDictionaryFactory(),
  imageRegistryFactory: new TstImageRegistryFactory(),
  tableScrollerFactory: new FitTableScrollerFactory(),
  tableViewerFactory: new FitTableViewerFactory(),
  cellSelectionFactory: new FitCellSelectionFactory(),
  cellSelectionPainterFactory: new FitCellSelectionPainterFactory(),
  hostListenersFactory: new FitHostListenersFactory(),
  tableScrollerListenerFactory: new FitTableScrollerListenerFactory(),
};

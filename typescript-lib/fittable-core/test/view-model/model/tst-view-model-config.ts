import { CellRange, Table } from '../../../dist/model/index.js';
import { OperationExecutor } from '../../../dist/operations/index.js';
import {
  ImageRegistryFactory,
  MobileLayoutFactory,
  ScrollContainerFactory,
  ScrollContainerListenerFactory,
  TableViewerFactory,
  ViewModelConfig,
  ViewModelFactory,
  ViewModel,
  ImageRegistry,
  ScrollContainer,
  ScrollContainerArgs,
  TableViewer,
  MobileLayout,
  MobileLayoutArgs,
  ScrollContainerListener,
  CellEditorListenerFactory,
  CellEditor,
  CellEditorListener,
  CellSelectionListenerFactory,
  CellSelection,
  CellSelectionListener,
  CellSelectionScroller,
  FitHtmlDivElement,
} from '../../../dist/view-model/index.js';

export class TstViewModelConfig implements ViewModelConfig {
  rowHeights = 0;
  colWidths = 0;
  fontSize = 0;
  viewModelFactory = new TstViewModelFactory();
  imageRegistryFactory = new TstImageRegistryFactory();
  scrollContainerFactory = new TstScrollContainerFactory();
  tableViewerFactory = new TstTableViewerFactory();
  mobileLayoutFactory = new TstMobileLayoutFactory();
  scrollContainerListenerFactory = new TstScrollContainerListenerFactory();
  cellEditorListenerFactory = new TstCellEditorListenerFactory();
  cellSelectionListenerFactory = new TstCellSelectionListenerFactory();
}

export class TstViewModelFactory implements ViewModelFactory {
  createViewModel(
    table: Table,
    operationExecutor?: OperationExecutor | undefined
  ): ViewModel {
    throw new Error('Method not implemented.');
  }
}

class TstImageRegistryFactory implements ImageRegistryFactory {
  createImageRegistry(): ImageRegistry<string> {
    throw new Error('Method not implemented.');
  }
}

class TstScrollContainerFactory implements ScrollContainerFactory {
  createScrollContainer(
    args?: ScrollContainerArgs | undefined
  ): ScrollContainer {
    throw new Error('Method not implemented.');
  }
}

class TstTableViewerFactory implements TableViewerFactory {
  createTableViewer(table: Table): TableViewer {
    throw new Error('Method not implemented.');
  }
}

class TstMobileLayoutFactory implements MobileLayoutFactory {
  createMobileLayout(args: MobileLayoutArgs): MobileLayout {
    throw new Error('Method not implemented.');
  }
}

class TstScrollContainerListenerFactory
  implements ScrollContainerListenerFactory
{
  createScrollContainerListener(
    div: FitHtmlDivElement,
    scrollContainer: ScrollContainer
  ): ScrollContainerListener {
    throw new Error('Method not implemented.');
  }
}

class TstCellEditorListenerFactory implements CellEditorListenerFactory {
  createCellEditorListener(
    cellEditor: CellEditor,
    selectedCellsFn: () => CellRange[]
  ): CellEditorListener {
    throw new Error('Method not implemented.');
  }
}

class TstCellSelectionListenerFactory implements CellSelectionListenerFactory {
  createCellSelectionListener(
    cellSelection: CellSelection,
    cellSelectionScroller?: CellSelectionScroller | undefined
  ): CellSelectionListener {
    throw new Error('Method not implemented.');
  }
}

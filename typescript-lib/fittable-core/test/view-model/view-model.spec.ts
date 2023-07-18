import {} from 'jasmine';

import {
  createCellEditor,
  createCellSelection,
  createCellSelectionPainter,
  createCellSelectionScroller,
  createColFilters,
  createContextMenu,
  createImageRegistry,
  createLanguageDictionary,
  createMobileLayout,
  createScrollContainer,
  createSettingsBar,
  createStatusbar,
  createTableViewer,
  createThemeSwitcher,
  createToolbar,
  createViewModel,
  registerViewModelConfig,
  unregisterViewModelConfig,
} from '../../dist/view-model/index.js';

import { TstTable } from '../model/table/tst-table.js';
import { TstOperationExecutor } from '../operations/model/tst-operation-executor.js';
import { TstTableViewer } from './model/tst-table-viewer.js';

import {
  throwsMethodNotImplemented,
  throwsMissingFactory,
} from './model/tst-functions.js';
import { TstViewModelConfig } from './model/tst-view-model-config.js';
import { TstScrollContainer } from './model/tst-scroll-container.js';
import { TstLanguageDictionary } from './model/tst-language-dictionary.js';
import { TstImageRegistry } from './model/tst-image-registry.js';
import { TstCellSelection } from './model/tst-cell-selection.js';

describe('view-model', () => {
  beforeAll(() => registerViewModelConfig(new TstViewModelConfig()));
  afterAll(() => unregisterViewModelConfig());

  it('view model factory', () => {
    const throwsError: boolean = throwsMethodNotImplemented(() =>
      createViewModel(new TstTable())
    );
    expect(throwsError).toBeTrue();
  });

  it('image registry factory', () => {
    const throwsError: boolean = throwsMethodNotImplemented(() =>
      createImageRegistry()
    );
    expect(throwsError).toBeTrue();
  });

  it('language dictionary factory', () => {
    const throwsError: boolean = throwsMethodNotImplemented(() =>
      createLanguageDictionary()
    );
    expect(throwsError).toBeTrue();
  });

  it('mobile layout factory', () => {
    const throwsError: boolean = throwsMethodNotImplemented(() =>
      createMobileLayout({
        tableViewer: new TstTableViewer(),
        tableScrollContainer: new TstScrollContainer(),
      })
    );
    expect(throwsError).toBeTrue();
  });

  it('scroll container factory', () => {
    const throwsError: boolean = throwsMethodNotImplemented(() =>
      createScrollContainer()
    );
    expect(throwsError).toBeTrue();
  });

  it('table viewer factory', () => {
    const throwsError: boolean = throwsMethodNotImplemented(() =>
      createTableViewer(new TstTable())
    );
    expect(throwsError).toBeTrue();
  });

  it('cell editor factory', () => {
    const throwsError: boolean = throwsMissingFactory(() =>
      createCellEditor(new TstOperationExecutor(), new TstTableViewer())
    );
    expect(throwsError).toBeTrue();
  });

  it('cell selection scroller factory', () => {
    const throwsError: boolean = throwsMissingFactory(() =>
      createCellSelectionScroller(
        new TstTableViewer(),
        new TstScrollContainer()
      )
    );
    expect(throwsError).toBeTrue();
  });

  it('cell selection factory', () => {
    const throwsError: boolean = throwsMissingFactory(() =>
      createCellSelection(new TstTableViewer())
    );
    expect(throwsError).toBeTrue();
  });

  it('cell selection painter factory', () => {
    const throwsError: boolean = throwsMissingFactory(() =>
      createCellSelectionPainter({
        tableViewer: new TstTableViewer(),
        tableScrollContainer: new TstScrollContainer(),
        cellSelection: new TstCellSelection(),
      })
    );
    expect(throwsError).toBeTrue();
  });

  it('col filters factory', () => {
    const throwsError: boolean = throwsMissingFactory(() =>
      createColFilters({
        operationExecutor: new TstOperationExecutor(),
        dictionary: new TstLanguageDictionary(),
        imageRegistry: new TstImageRegistry(),
      })
    );
    expect(throwsError).toBeTrue();
  });

  it('context menu factory', () => {
    const throwsError: boolean = throwsMissingFactory(() =>
      createContextMenu({
        operationExecutor: new TstOperationExecutor(),
        dictionary: new TstLanguageDictionary(),
        imageRegistry: new TstImageRegistry(),
        getSelectedCells: () => [],
      })
    );
    expect(throwsError).toBeTrue();
  });

  it('settings bar factory', () => {
    const throwsError: boolean = throwsMissingFactory(() =>
      createSettingsBar({
        dictionary: new TstLanguageDictionary(),
        imageRegistry: new TstImageRegistry(),
      })
    );
    expect(throwsError).toBeTrue();
  });

  it('statusbar factory', () => {
    const throwsError: boolean = throwsMissingFactory(() =>
      createStatusbar({
        dictionary: new TstLanguageDictionary(),
        tableViewer: new TstTableViewer(),
        tableScrollContainer: new TstScrollContainer(),
      })
    );
    expect(throwsError).toBeTrue();
  });

  it('theme switcher factory', () => {
    const throwsError: boolean = throwsMissingFactory(() =>
      createThemeSwitcher(new TstImageRegistry())
    );
    expect(throwsError).toBeTrue();
  });

  it('toolbar factory', () => {
    const throwsError: boolean = throwsMissingFactory(() =>
      createToolbar({
        operationExecutor: new TstOperationExecutor(),
        dictionary: new TstLanguageDictionary(),
        imageRegistry: new TstImageRegistry(),
        getSelectedCells: () => [],
      })
    );
    expect(throwsError).toBeTrue();
  });
});

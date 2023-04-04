import {} from 'jasmine';

import {
  createCellEditorListener,
  createCellSelectionListener,
  createInputControlListener,
  createScrollContainerListener,
  createWindowListener,
  registerViewModelConfig,
  unregisterViewModelConfig,
} from '../../dist/view-model/index.js';

import { TstViewModelConfig } from './model/tst-view-model-config.js';
import { TstInputControl, TstWindow } from './model/tst-controls.js';
import {
  TstScrollContainer,
  TstScrollElement,
} from './model/tst-scroll-container.js';
import { TstCellEditor } from './model/tst-cell-editor.js';
import { TstCellSelection } from './model/tst-cell-selection.js';
import {
  throwsMethodNotImplemented,
  throwsMissingFactory,
} from './model/tst-functions.js';

describe('host-listener', () => {
  beforeAll(() => registerViewModelConfig(new TstViewModelConfig()));
  afterAll(() => unregisterViewModelConfig());

  it('window listener factory', () => {
    const throwsError: boolean = throwsMissingFactory(() =>
      createWindowListener(new TstWindow())
    );
    expect(throwsError).toBeTrue();
  });

  it('input control listener factory', () => {
    const throwsError: boolean = throwsMissingFactory(() =>
      createInputControlListener(new TstInputControl())
    );
    expect(throwsError).toBeTrue();
  });

  it('scroll container listener factory', () => {
    const throwsError: boolean = throwsMethodNotImplemented(() =>
      createScrollContainerListener(
        new TstScrollElement(),
        new TstScrollContainer()
      )
    );
    expect(throwsError).toBeTrue();
  });

  it('cell editor listener factory', () => {
    const throwsError: boolean = throwsMethodNotImplemented(() =>
      createCellEditorListener(new TstCellEditor(), () => [])
    );
    expect(throwsError).toBeTrue();
  });

  it('cell selection listener factory', () => {
    const throwsError: boolean = throwsMethodNotImplemented(() =>
      createCellSelectionListener(new TstCellSelection())
    );
    expect(throwsError).toBeTrue();
  });
});

import {} from 'jasmine';

import {
  createInputControlListener,
  InputControlListener,
  registerViewModelConfig,
  unregisterViewModelConfig,
} from 'fit-core/view-model/index.js';

import { FitInputControl, FIT_VIEW_MODEL_CONFIG } from '../../dist/index.js';
import { TstHtmlInputElement, TstKeyboardEvent } from './tst-html-mockups.js';

describe('fit-input-control-listener.ts', () => {
  beforeAll(() => registerViewModelConfig(FIT_VIEW_MODEL_CONFIG));
  afterAll(() => unregisterViewModelConfig());

  it('click outside', () => {
    const inputControl: FitInputControl = new FitInputControl();
    const inputControlListener: InputControlListener =
      createInputControlListener(inputControl);
    inputControlListener.onGlobalMouseDown();

    expect(inputControl.hasFocus()).toBeFalse();
    expect(inputControl.hasTextCursor()).toBeFalse();
  });

  it('define input value', () => {
    const inputControl: FitInputControl = new FitInputControl().setFocus(true);
    const inputControlListener: InputControlListener =
      createInputControlListener(inputControl);
    inputControlListener.onMouseEnter();
    inputControlListener.onGlobalMouseDown();
    const event: TstKeyboardEvent = new TstKeyboardEvent();
    event.key = 'Enter';
    const htmlElement: TstHtmlInputElement = new TstHtmlInputElement();
    htmlElement.value = '1000';
    event.target = htmlElement;
    inputControlListener.onKeyDown(event);

    expect(inputControl.hasFocus()).toBeFalse();
    expect(inputControl.getValue() === 1000).toBeTruthy();
  });

  it('revert input value', () => {
    const inputControl: FitInputControl = new FitInputControl()
      .setFocus(true)
      .setValue(1000);
    const inputControlListener: InputControlListener =
      createInputControlListener(inputControl);
    inputControlListener.onMouseEnter();
    inputControlListener.onGlobalMouseDown();
    const event: TstKeyboardEvent = new TstKeyboardEvent();
    event.key = '1';
    event.target = new TstHtmlInputElement();
    inputControlListener.onKeyDown(event);
    inputControlListener.onMouseLeave();
    inputControlListener.onGlobalMouseDown();

    expect(inputControl.hasFocus()).toBeFalse();
    expect(inputControl.getValue() === 1000).toBeTruthy();
  });
});

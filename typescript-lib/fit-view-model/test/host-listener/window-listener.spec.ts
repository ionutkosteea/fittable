import {} from 'jasmine';

import {
  createWindowListener,
  registerViewModelConfig,
  unregisterViewModelConfig,
  Window,
  WindowListener,
} from 'fit-core/view-model/index.js';

import { FitWindow, FIT_VIEW_MODEL_CONFIG } from '../../dist/index.js';

import { TstMouseEvent } from './tst-html-mockups.js';

describe('fit-window-listener.ts', () => {
  beforeAll(() => registerViewModelConfig(FIT_VIEW_MODEL_CONFIG));
  afterAll(() => unregisterViewModelConfig());

  it('onShow()', () => {
    const window: Window = new FitWindow()
      .setWidth(() => 100)
      .setHeight(() => 200);
    const windowListener: WindowListener = createWindowListener(window);
    const mouseEvent: TstMouseEvent = new TstMouseEvent();
    mouseEvent.x = 10;
    mouseEvent.y = 20;
    windowListener.onShow(mouseEvent);

    expect(window.isVisible()).toBeTruthy();
    expect(window.getPosition().x === 10).toBeTruthy();
    expect(window.getPosition().y === 20).toBeTruthy();
  });

  it('onMouseDown()', () => {
    const window: Window = new FitWindow()
      .setVisible(true)
      .setPosition({ x: 10, y: 20 })
      .setWidth(() => 100)
      .setHeight(() => 200);
    const windowListener: WindowListener = createWindowListener(window);
    const mouseEvent: TstMouseEvent = new TstMouseEvent();
    mouseEvent.x = 20;
    mouseEvent.y = 30;
    windowListener.onMouseDown(mouseEvent);

    expect(window.isVisible()).toBeTruthy();
  });

  it('onGlobalMouseDown()', () => {
    const window: Window = new FitWindow()
      .setVisible(true)
      .setPosition({ x: 10, y: 20 })
      .setWidth(() => 100)
      .setHeight(() => 200);
    const windowListener: WindowListener = createWindowListener(window);
    const mouseEvent: TstMouseEvent = new TstMouseEvent();
    mouseEvent.x = 200;
    mouseEvent.y = 300;
    windowListener.onGlobalMouseDown(mouseEvent);

    expect(window.isVisible()).toBeFalsy();
  });
});

import {} from 'jasmine';

import {
  registerModelConfig,
  unregisterModelConfig,
} from 'fittable-core/model';
import {
  getViewModelConfig,
  registerViewModelConfig,
  unregisterViewModelConfig,
  ViewModelConfig,
} from 'fittable-core/view-model';
import { FIT_MODEL_CONFIG } from 'fittable-model';

import { VirtualScrollbar } from '../../../dist/model/scroll-container/fit-scrollbar.js';
import { TST_VIEW_MODEL_CONFIG } from '../../tst-view-model-config.js';
import { ScrollbarBuilder } from './scrollbar-builder.js';

let config: ViewModelConfig;

describe('Test Scrollbars', () => {
  beforeAll((): void => {
    registerModelConfig(FIT_MODEL_CONFIG);
    registerViewModelConfig(TST_VIEW_MODEL_CONFIG);
    config = getViewModelConfig();
  });
  afterAll(() => {
    unregisterModelConfig();
    unregisterViewModelConfig();
  });

  it('no scrollbar requried', () => {
    const scrollbar: VirtualScrollbar = new ScrollbarBuilder('vertical')
      .setNumberOfTableLines(2)
      .setViewport(3 * config.rowHeights)
      .build();
    expect(scrollbar.getOffset() === 0).toBeTruthy();
    expect(scrollbar.getFirstRenderableLine() === 0).toBeTruthy();
    expect(scrollbar.getLastRenderableLine() === 1).toBeTruthy();
  });

  it('initial scrollbar parameters', () => {
    const scrollbar: VirtualScrollbar = new ScrollbarBuilder('vertical')
      .setNumberOfTableLines(7)
      .setViewport(3 * config.rowHeights)
      .build();
    expect(scrollbar.getOffset() === 0).toBeTruthy();
    expect(scrollbar.getFirstRenderableLine() === 0).toBeTruthy();
    expect(scrollbar.getLastRenderableLine() === 3).toBeTruthy();
  });

  it('scroll to the second row', () => {
    const scrollbar: VirtualScrollbar = new ScrollbarBuilder('vertical')
      .setNumberOfTableLines(7)
      .setViewport(3 * config.rowHeights)
      .build()
      .renderModel(config.rowHeights);
    expect(scrollbar.getOffset() === 0).toBeTruthy();
    expect(scrollbar.getFirstRenderableLine() === 0).toBeTruthy();
    expect(scrollbar.getLastRenderableLine() === 4).toBeTruthy();
  });

  it('scroll to the third row', () => {
    const scrollbar: VirtualScrollbar = new ScrollbarBuilder('vertical')
      .setNumberOfTableLines(7)
      .setViewport(3 * config.rowHeights)
      .build()
      .renderModel(2 * config.rowHeights);
    expect(scrollbar.getOffset() === config.rowHeights).toBeTruthy();
    expect(scrollbar.getFirstRenderableLine() === 1).toBeTruthy();
    expect(scrollbar.getLastRenderableLine() === 5).toBeTruthy();
  });

  it('scroll to the middle of the second row', () => {
    const scrollbar: VirtualScrollbar = new ScrollbarBuilder('vertical')
      .setNumberOfTableLines(7)
      .setViewport(3 * config.rowHeights)
      .build()
      .renderModel(2 * config.rowHeights - config.rowHeights / 2);
    expect(scrollbar.getOffset() === 0).toBeTruthy();
    expect(scrollbar.getFirstRenderableLine() === 0).toBeTruthy();
    expect(scrollbar.getLastRenderableLine() === 4).toBeTruthy();
  });

  it('initial scrollbar parameters -> table with custom first row height', () => {
    const scrollbar: VirtualScrollbar = new ScrollbarBuilder('vertical')
      .setNumberOfTableLines(7)
      .setViewport(3 * config.rowHeights)
      .setTableLineDimension(0, 2 * config.rowHeights)
      .build();
    expect(scrollbar.getOffset() === 0).toBeTruthy();
    expect(scrollbar.getFirstRenderableLine() === 0).toBeTruthy();
    expect(scrollbar.getLastRenderableLine() === 3).toBeTruthy();
  });

  it('scroll to the second row -> table with custom first row height', () => {
    const scrollbar: VirtualScrollbar = new ScrollbarBuilder('vertical')
      .setNumberOfTableLines(7)
      .setViewport(3 * config.rowHeights)
      .setTableLineDimension(0, 2 * config.rowHeights)
      .build()
      .renderModel(2 * config.rowHeights);
    expect(scrollbar.getOffset() === 0).toBeTruthy();
    expect(scrollbar.getFirstRenderableLine() === 0).toBeTruthy();
    expect(scrollbar.getLastRenderableLine() === 4).toBeTruthy();
  });

  it('scroll to the third row -> table with custom first row height', () => {
    const scrollbar: VirtualScrollbar = new ScrollbarBuilder('vertical')
      .setNumberOfTableLines(7)
      .setViewport(3 * config.rowHeights)
      .setTableLineDimension(0, 2 * config.rowHeights)
      .build()
      .renderModel(3 * config.rowHeights);
    expect(scrollbar.getOffset() === 2 * config.rowHeights).toBeTruthy();
    expect(scrollbar.getFirstRenderableLine() === 1).toBeTruthy();
    expect(scrollbar.getLastRenderableLine() === 5).toBeTruthy();
  });

  it('initial scrollbar parameters -> table with custom second row height', () => {
    const scrollbar: VirtualScrollbar = new ScrollbarBuilder('vertical')
      .setNumberOfTableLines(7)
      .setViewport(3 * config.rowHeights)
      .setTableLineDimension(1, 2 * config.rowHeights)
      .build();
    expect(scrollbar.getOffset() === 0).toBeTruthy();
    expect(scrollbar.getFirstRenderableLine() === 0).toBeTruthy();
    expect(scrollbar.getLastRenderableLine() === 2).toBeTruthy();
  });

  it('scroll to the second row -> table with custom second row height', () => {
    const scrollbar: VirtualScrollbar = new ScrollbarBuilder('vertical')
      .setNumberOfTableLines(7)
      .setViewport(3 * config.rowHeights)
      .setTableLineDimension(1, 2 * config.rowHeights)
      .build()
      .renderModel(config.rowHeights);
    expect(scrollbar.getOffset() === 0).toBeTruthy();
    expect(scrollbar.getFirstRenderableLine() === 0).toBeTruthy();
    expect(scrollbar.getLastRenderableLine() === 4).toBeTruthy();
  });

  it('scroll to the third row -> table with custom second row height', () => {
    const scrollbar: VirtualScrollbar = new ScrollbarBuilder('vertical')
      .setNumberOfTableLines(7)
      .setViewport(3 * config.rowHeights)
      .setTableLineDimension(1, 2 * config.rowHeights)
      .build()
      .renderModel(3 * config.rowHeights);
    expect(scrollbar.getOffset() === config.rowHeights).toBeTruthy();
    expect(scrollbar.getFirstRenderableLine() === 1).toBeTruthy();
    expect(scrollbar.getLastRenderableLine() === 5).toBeTruthy();
  });

  it('initial scrollbar parameters -> table with custom third row height', () => {
    const scrollbar: VirtualScrollbar = new ScrollbarBuilder('vertical')
      .setNumberOfTableLines(7)
      .setViewport(3 * config.rowHeights)
      .setTableLineDimension(2, 2 * config.rowHeights)
      .build();
    expect(scrollbar.getOffset() === 0).toBeTruthy();
    expect(scrollbar.getFirstRenderableLine() === 0).toBeTruthy();
    expect(scrollbar.getLastRenderableLine() === 3).toBeTruthy();
  });

  it('scroll to the second row -> table with custom third row height', () => {
    const scrollbar: VirtualScrollbar = new ScrollbarBuilder('vertical')
      .setNumberOfTableLines(7)
      .setViewport(3 * config.rowHeights)
      .setTableLineDimension(2, 2 * config.rowHeights)
      .build()
      .renderModel(config.rowHeights);
    expect(scrollbar.getOffset() === 0).toBeTruthy();
    expect(scrollbar.getFirstRenderableLine() === 0).toBeTruthy();
    expect(scrollbar.getLastRenderableLine() === 3).toBeTruthy();
  });

  it('scroll to the third row -> table with custom third row height', () => {
    const scrollbar: VirtualScrollbar = new ScrollbarBuilder('vertical')
      .setNumberOfTableLines(7)
      .setViewport(3 * config.rowHeights)
      .setTableLineDimension(2, 2 * config.rowHeights)
      .build()
      .renderModel(3 * config.rowHeights);
    expect(scrollbar.getOffset() === config.rowHeights).toBeTruthy();
    expect(scrollbar.getFirstRenderableLine() === 1).toBeTruthy();
    expect(scrollbar.getLastRenderableLine() === 5).toBeTruthy();
  });

  it('scroll backwards, from second - to first row', () => {
    const scrollbar: VirtualScrollbar = new ScrollbarBuilder('vertical')
      .setNumberOfTableLines(7)
      .setViewport(3 * config.rowHeights)
      .build()
      .renderModel(config.rowHeights)
      .renderModel(0);
    expect(scrollbar.getOffset() === 0).toBeTruthy();
    expect(scrollbar.getFirstRenderableLine() === 0).toBeTruthy();
    expect(scrollbar.getLastRenderableLine() === 3).toBeTruthy();
  });

  it('scroll backwards, from third - to first row', () => {
    const scrollbar: VirtualScrollbar = new ScrollbarBuilder('vertical')
      .setNumberOfTableLines(7)
      .setViewport(3 * config.rowHeights)
      .build()
      .renderModel(2 * config.rowHeights)
      .renderModel(0);
    expect(scrollbar.getOffset() === 0).toBeTruthy();
    expect(scrollbar.getFirstRenderableLine() === 0).toBeTruthy();
    expect(scrollbar.getLastRenderableLine() === 3).toBeTruthy();
  });

  it('scroll backwards, from fourth - to first row', () => {
    const scrollbar: VirtualScrollbar = new ScrollbarBuilder('vertical')
      .setNumberOfTableLines(7)
      .setViewport(3 * config.rowHeights)
      .build()
      .renderModel(3 * config.rowHeights)
      .renderModel(0);
    expect(scrollbar.getOffset() === 0).toBeTruthy();
    expect(scrollbar.getFirstRenderableLine() === 0).toBeTruthy();
    expect(scrollbar.getLastRenderableLine() === 3).toBeTruthy();
  });

  it('scroll backwards, from fifth - to first row', () => {
    const scrollbar: VirtualScrollbar = new ScrollbarBuilder('vertical')
      .setNumberOfTableLines(7)
      .setViewport(3 * config.rowHeights)
      .build()
      .renderModel(4 * config.rowHeights)
      .renderModel(0);
    expect(scrollbar.getOffset() === 0).toBeTruthy();
    expect(scrollbar.getFirstRenderableLine() === 0).toBeTruthy();
    expect(scrollbar.getLastRenderableLine() === 3).toBeTruthy();
  });

  it('scroll backwards, from third - to second row', () => {
    const scrollbar: VirtualScrollbar = new ScrollbarBuilder('vertical')
      .setNumberOfTableLines(7)
      .setViewport(3 * config.rowHeights)
      .build()
      .renderModel(2 * config.rowHeights)
      .renderModel(config.rowHeights);
    expect(scrollbar.getOffset() === 0).toBeTruthy();
    expect(scrollbar.getFirstRenderableLine() === 0).toBeTruthy();
    expect(scrollbar.getLastRenderableLine() === 4).toBeTruthy();
  });

  it('scroll backwards, from fourth - to third row', () => {
    const scrollbar: VirtualScrollbar = new ScrollbarBuilder('vertical')
      .setNumberOfTableLines(7)
      .setViewport(3 * config.rowHeights)
      .build()
      .renderModel(3 * config.rowHeights)
      .renderModel(2 * config.rowHeights);
    expect(scrollbar.getOffset() === config.rowHeights).toBeTruthy();
    expect(scrollbar.getFirstRenderableLine() === 1).toBeTruthy();
    expect(scrollbar.getLastRenderableLine() === 5).toBeTruthy();
  });

  it('scroll backwards, from fifth - to fourth row', () => {
    const scrollbar: VirtualScrollbar = new ScrollbarBuilder('vertical')
      .setNumberOfTableLines(7)
      .setViewport(3 * config.rowHeights)
      .build()
      .renderModel(4 * config.rowHeights)
      .renderModel(3 * config.rowHeights);
    expect(scrollbar.getOffset() === 2 * config.rowHeights).toBeTruthy();
    expect(scrollbar.getFirstRenderableLine() === 2).toBeTruthy();
    expect(scrollbar.getLastRenderableLine() === 6).toBeTruthy();
  });

  it('no scrollbar requried -> table with column header', () => {
    const scrollbar: VirtualScrollbar = new ScrollbarBuilder('vertical')
      .setNumberOfTableLines(2)
      .setViewport(3 * config.rowHeights)
      .build();
    expect(scrollbar.getOffset() === 0).toBeTruthy();
    expect(scrollbar.getFirstRenderableLine() === 0).toBeTruthy();
    expect(scrollbar.getLastRenderableLine() === 1).toBeTruthy();
  });

  it('initial scrollbar parameters -> table with column header', () => {
    const scrollbar: VirtualScrollbar = new ScrollbarBuilder('vertical')
      .setNumberOfTableLines(7)
      .setViewport(3 * config.rowHeights)
      .build();
    expect(scrollbar.getOffset() === 0).toBeTruthy();
    expect(scrollbar.getFirstRenderableLine() === 0).toBeTruthy();
    expect(scrollbar.getLastRenderableLine() === 3).toBeTruthy();
  });

  it('scroll to the second row -> table with column header', () => {
    const scrollbar: VirtualScrollbar = new ScrollbarBuilder('vertical')
      .setNumberOfTableLines(7)
      .setViewport(3 * config.rowHeights)
      .build()
      .renderModel(config.rowHeights);
    expect(scrollbar.getOffset() === 0).toBeTruthy();
    expect(scrollbar.getFirstRenderableLine() === 0).toBeTruthy();
    expect(scrollbar.getLastRenderableLine() === 4).toBeTruthy();
  });

  it('scroll to the third row -> table with column header', () => {
    const scrollbar: VirtualScrollbar = new ScrollbarBuilder('vertical')
      .setNumberOfTableLines(7)
      .setViewport(3 * config.rowHeights)
      .build()
      .renderModel(2 * config.rowHeights);
    expect(scrollbar.getOffset() === config.rowHeights).toBeTruthy();
    expect(scrollbar.getFirstRenderableLine() === 1).toBeTruthy();
    expect(scrollbar.getLastRenderableLine() === 5).toBeTruthy();
  });
});

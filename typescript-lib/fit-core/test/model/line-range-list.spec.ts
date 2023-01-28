import {} from 'jasmine';

import {
  registerModelConfig,
  unregisterModelConfig,
  LineRangeList,
  createLineRange,
} from '../../dist/model/index.js';

import { TST_MODEL_CONFIG } from './table/tst-model-config.js';

describe('Test LineRangeList', () => {
  beforeAll(() => registerModelConfig(TST_MODEL_CONFIG));
  afterAll(() => unregisterModelConfig());

  it('add parent interval', () => {
    const rangeList: LineRangeList = new LineRangeList()
      .add(createLineRange(2)) //
      .add(createLineRange(1, 3));
    expect(rangeList.getRanges().length === 1).toBeTruthy();
    expect(rangeList.get(0).getFrom() === 1).toBeTruthy();
    expect(rangeList.get(0).getTo() === 3).toBeTruthy();
  });

  it('add child interval', () => {
    const rangeList: LineRangeList = new LineRangeList()
      .add(createLineRange(1, 3)) //
      .add(createLineRange(2));
    expect(rangeList.getRanges().length === 1).toBeTruthy();
    expect(rangeList.get(0).getFrom() === 1).toBeTruthy();
    expect(rangeList.get(0).getTo() === 3).toBeTruthy();
  });

  it('add intersection interval', () => {
    const rangeList: LineRangeList = new LineRangeList()
      .add(createLineRange(0, 2)) //
      .add(createLineRange(1, 3));
    expect(rangeList.getRanges().length === 1).toBeTruthy();
    expect(rangeList.get(0).getFrom() === 0).toBeTruthy();
    expect(rangeList.get(0).getTo() === 3).toBeTruthy();
  });

  it('add neighbor interval before', () => {
    const rangeList: LineRangeList = new LineRangeList()
      .add(createLineRange(3, 4)) //
      .add(createLineRange(0, 2));
    expect(rangeList.getRanges().length === 1).toBeTruthy();
    expect(rangeList.get(0).getFrom() === 0).toBeTruthy();
    expect(rangeList.get(0).getTo() === 4).toBeTruthy();
  });

  it('add neighbor interval after', () => {
    const rangeList: LineRangeList = new LineRangeList()
      .add(createLineRange(0, 2)) //
      .add(createLineRange(3, 4));
    expect(rangeList.getRanges().length === 1).toBeTruthy();
    expect(rangeList.get(0).getFrom() === 0).toBeTruthy();
    expect(rangeList.get(0).getTo() === 4).toBeTruthy();
  });

  it('add unrelated interval', () => {
    const rangeList: LineRangeList = new LineRangeList()
      .add(createLineRange(0, 2)) //
      .add(createLineRange(4, 6));
    expect(rangeList.getRanges().length === 2).toBeTruthy();
    expect(rangeList.get(0).getFrom() === 0).toBeTruthy();
    expect(rangeList.get(0).getTo() === 2).toBeTruthy();
    expect(rangeList.get(1).getFrom() === 4).toBeTruthy();
    expect(rangeList.get(1).getTo() === 6).toBeTruthy();
  });

  it('add existing interval', () => {
    const rangeList: LineRangeList = new LineRangeList()
      .add(createLineRange(2)) //
      .add(createLineRange(2));
    expect(rangeList.getRanges().length === 1).toBeTruthy();
    expect(rangeList.get(0).getFrom() === 2).toBeTruthy();
  });

  it('add overlapping interval', () => {
    const rangeList: LineRangeList = new LineRangeList()
      .add(createLineRange(1, 5)) //
      .add(createLineRange(2, 3));
    expect(rangeList.getRanges().length === 1).toBeTruthy();
    expect(rangeList.get(0).getFrom() === 1).toBeTruthy();
    expect(rangeList.get(0).getTo() === 5).toBeTruthy();
  });

  it('add multiple neighbours interval', () => {
    const rangeList: LineRangeList = new LineRangeList()
      .add(createLineRange(3)) //
      .add(createLineRange(1))
      .add(createLineRange(2));
    expect(rangeList.getRanges().length === 1).toBeTruthy();
    expect(rangeList.get(0).getFrom() === 1).toBeTruthy();
    expect(rangeList.get(0).getTo() === 3).toBeTruthy();
  });

  it('add dupplicates after one distinct value', () => {
    const rangeList: LineRangeList = new LineRangeList()
      .add(createLineRange(0)) //
      .add(createLineRange(2))
      .add(createLineRange(2));
    expect(rangeList.getRanges().length === 2).toBeTruthy();
    expect(rangeList.get(0).getFrom() === 0).toBeTruthy();
    expect(rangeList.get(1).getFrom() === 2).toBeTruthy();
  });
});

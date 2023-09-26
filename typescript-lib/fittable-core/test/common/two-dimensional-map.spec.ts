import {} from 'jasmine';

import { TwoDimensionalMap } from '../../dist/common/index.js';

describe('two-dimensional-map-spec.ts', () => {
  it('setValue -> getValue', () => {
    const map: TwoDimensionalMap<number> = new TwoDimensionalMap<number>() //
      .setValue(0, 0, 100);
    expect(map.getValue(0, 0) === 100).toBeTruthy();
  });

  it('getValue -> deleteValue', () => {
    const map: TwoDimensionalMap<number> = new TwoDimensionalMap<number>() //
      .setValue(0, 0, 100);
    expect(map.hasValue(0, 0)).toBeTrue();
    map.deleteValue(0, 0);
    expect(map.hasValue(0, 0)).toBeFalse();
  });

  it('deleteRow', () => {
    const map: TwoDimensionalMap<number> = new TwoDimensionalMap<number>()
      .setValue(0, 0, 100)
      .setValue(0, 1, 200)
      .deleteRow(0);
    expect(map.hasValue(0, 0)).toBeFalse();
    expect(map.hasValue(0, 1)).toBeFalse();
  });

  it('deleteCol', () => {
    const map: TwoDimensionalMap<number> = new TwoDimensionalMap<number>()
      .setValue(0, 0, 100)
      .setValue(1, 0, 200)
      .deleteCol(0);
    expect(map.hasValue(0, 0)).toBeFalse();
    expect(map.hasValue(1, 0)).toBeFalse();
  });

  it('clearAll', () => {
    const map: TwoDimensionalMap<number> = new TwoDimensionalMap<number>()
      .setValue(0, 0, 100)
      .clearAll();
    expect(map.getValue(0, 0)).toBeUndefined();
  });

  it('getRowValues', () => {
    const map: TwoDimensionalMap<number> = new TwoDimensionalMap<number>()
      .setValue(0, 0, 100)
      .setValue(0, 1, 200);
    expect((map.getRowValues(0) as number[])[0] === 100).toBeTruthy();
    expect((map.getRowValues(0) as number[])[1] === 200).toBeTruthy();
  });
});

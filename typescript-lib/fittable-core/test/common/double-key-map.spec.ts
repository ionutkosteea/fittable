import {} from 'jasmine';

import { DoubleKeyMap } from '../../dist/common/index.js';

describe('Test DoubleKeyMap', () => {
  it('set -> get', () => {
    const map: DoubleKeyMap<number> = new DoubleKeyMap();
    map.set(0, 0, 100);
    expect(map.get(0, 0) === 100).toBeTruthy();
  });

  it('get -> delete', () => {
    const map: DoubleKeyMap<number> = new DoubleKeyMap();
    map.set(0, 0, 100);
    map.delete(0, 0);
    expect(map.get(0, 0) === undefined).toBeTruthy();
  });

  it('clear', () => {
    const map: DoubleKeyMap<number> = new DoubleKeyMap();
    map.set(0, 0, 100);
    map.clear();
    expect(map.get(0, 0) === undefined).toBeTruthy();
  });

  it('getAll', () => {
    const map: DoubleKeyMap<number> = new DoubleKeyMap();
    map.set(0, 0, 100);
    map.set(0, 1, 200);
    expect((map.getAll(0) as number[])[0] === 100).toBeTruthy();
    expect((map.getAll(0) as number[])[1] === 200).toBeTruthy();
  });
});

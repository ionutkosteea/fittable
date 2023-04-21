import {} from 'jasmine';

import { RangeIterator } from '../../dist/common/index.js';

describe('Test RangeIterator', () => {
  it('two element range', () => {
    const iterator: RangeIterator = new RangeIterator(0, 2);
    const testArray: number[] = [];
    for (const iteratorItem of iterator) {
      testArray.push(iteratorItem);
    }
    expect(testArray.length === 2).toBeTruthy();
    expect(testArray[0] === 0).toBeTruthy();
    expect(testArray[1] === 1).toBeTruthy();
  });

  it('zero element range', () => {
    const iterator: RangeIterator = new RangeIterator(0, 0);
    const testArray: number[] = [];
    for (const iteratorItem of iterator) {
      testArray.push(iteratorItem);
    }
    expect(testArray.length === 0).toBeTruthy();
  });
});

import {} from 'jasmine';

import {
  incrementNumber,
  incrementLetter,
  implementsTKeys,
} from '../../dist/common/index.js';

describe('Test Core-Functions', () => {
  it('incrementNumber', () => {
    const testNumber = incrementNumber(0);
    expect(testNumber === 1).toBeTruthy();
  });

  it('incrementLetter', () => {
    const testLetter = incrementLetter(1);
    expect(testLetter === 'B').toBeTruthy();
  });

  it('implementTKeys for undefined object', () => {
    const result: boolean = implementsTKeys<String>(undefined, []);
    expect(result).toBeFalsy();
  });

  it('implementTKeys for defined object', () => {
    const testObj: String = new String();
    const result: boolean = implementsTKeys<String>(testObj, ['split']);
    expect(result).toBeTruthy();
  });
});

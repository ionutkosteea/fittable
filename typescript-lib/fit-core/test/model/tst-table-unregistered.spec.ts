import {} from 'jasmine';
import {
  createCellCoord,
  createTable,
  createLineRange,
  createStyle,
} from '../../dist/model/index.js';

type FunctionType = (...args: any[]) => any;

function throwsError(fnct: FunctionType, ...args: any[]): boolean {
  let isError = false;
  try {
    fnct(args);
  } catch {
    isError = true;
  }
  return isError;
}

describe('Test create functions', () => {
  it('createTable', () => expect(throwsError(createTable, 0, 0)).toBeTruthy());
  it('createCellCoord', () =>
    expect(throwsError(createCellCoord, 0, 0)).toBeTruthy());
  it('createLineRange', () =>
    expect(throwsError(createLineRange, 0, 0)).toBeTruthy());
  it('createStyle', () => expect(throwsError(createStyle, 0)).toBeTruthy());
});

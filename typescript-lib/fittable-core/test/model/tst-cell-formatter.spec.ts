import {} from 'jasmine';

import {
  createCellBooleanFormatter,
  createCellDateFormatter,
  createCellNumberFormatter,
  registerModelConfig,
  unregisterModelConfig,
} from '../../dist/model/index.js';

import { TST_MODEL_CONFIG } from './table/tst-model-config.js';

describe('tst-cell-formatter.spec.ts', () => {
  beforeAll(() => registerModelConfig(TST_MODEL_CONFIG));
  afterAll(() => unregisterModelConfig());

  it('createCellNumberFormatter', () => {
    expect(() => createCellNumberFormatter()).toThrowError();
  });

  it('createCellDateFormatter', () => {
    expect(() => createCellDateFormatter()).toThrowError();
  });

  it('createCellBooleanFormatter', () => {
    expect(() => createCellBooleanFormatter()).toThrowError();
  });
});

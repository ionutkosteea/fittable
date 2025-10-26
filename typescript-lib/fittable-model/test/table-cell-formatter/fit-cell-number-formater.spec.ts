import { } from 'jasmine';

import {
  createDataType,
  createTable,
  registerModelConfig,
  unregisterModelConfig,
} from 'fittable-core/model';

import { FIT_MODEL_CONFIG, FitTable } from '../../dist/index.js';

describe('fit-cell-number-formatter.spec.ts', () => {
  beforeAll(() => registerModelConfig(FIT_MODEL_CONFIG));
  afterAll(() => unregisterModelConfig());

  it('123 + "" = 123', () => {
    const table: FitTable = createTable<FitTable>() //
      .setCellValue(0, 0, 123);
    expect(table.getFormatedCellValue(0, 0) === '123').toBeTruthy();
  });

  it('123.12 + # = 123', () => {
    const table: FitTable = createTable<FitTable>()
      .setCellValue(0, 0, 123.12)
      .setCellDataType(0, 0, createDataType('number', '#'));
    expect(table.getFormatedCellValue(0, 0) === '123').toBeTruthy();
  });

  it('1.1 + 0# = 01', () => {
    const table: FitTable = createTable<FitTable>()
      .setCellValue(0, 0, 1.1)
      .setCellDataType(0, 0, createDataType('number', '0#'));
    expect(table.getFormatedCellValue(0, 0) === '01').toBeTruthy();
  });

  it('123.12 + #.# = 123.1', () => {
    const table: FitTable = createTable<FitTable>()
      .setCellValue(0, 0, 123.12)
      .setCellDataType(0, 0, createDataType('number', '#.#'));
    expect(table.getFormatedCellValue(0, 0) === '123.1').toBeTruthy();
  });

  it('1 + #.0 = 1.0', () => {
    const table: FitTable = createTable<FitTable>()
      .setCellValue(0, 0, 1)
      .setCellDataType(0, 0, createDataType('number', '#.0'));
    expect(table.getFormatedCellValue(0, 0) === '1.0').toBeTruthy();
  });

  it('1 + #.#0 = 1.0', () => {
    const table: FitTable = createTable<FitTable>()
      .setCellValue(0, 0, 1)
      .setCellDataType(0, 0, createDataType('number', '#.#0'));
    expect(table.getFormatedCellValue(0, 0) === '1.0').toBeTruthy();
  });

  it('1.1 + #.#0 = 1.10', () => {
    const table: FitTable = createTable<FitTable>()
      .setCellValue(0, 0, 1.1)
      .setCellDataType(0, 0, createDataType('number', '#.#0'));
    expect(table.getFormatedCellValue(0, 0) === '1.10').toBeTruthy();
  });

  it('1000 + #,# = 1,000', () => {
    const table: FitTable = createTable<FitTable>()
      .setCellValue(0, 0, 1000)
      .setCellDataType(0, 0, createDataType('number', '#,#'));
    expect(table.getFormatedCellValue(0, 0) === '1,000').toBeTruthy();
  });

  it('1000 + #,#.0 = 1,000.0', () => {
    const table: FitTable = createTable<FitTable>()
      .setCellValue(0, 0, 1000)
      .setCellDataType(0, 0, createDataType('number', '#,#.0'));
    expect(table.getFormatedCellValue(0, 0) === '1,000.0').toBeTruthy();
  });

  it('1.234 + 0#.##0 = 01.234', () => {
    const table: FitTable = createTable<FitTable>()
      .setCellValue(0, 0, 1.234)
      .setCellDataType(0, 0, createDataType('number', '0#.##0'));
    expect(table.getFormatedCellValue(0, 0) === '01.234').toBeTruthy();
  });

  it('0.01 + #% = 1%', () => {
    const table: FitTable = createTable<FitTable>()
      .setCellValue(0, 0, 0.01)
      .setCellDataType(0, 0, createDataType('number', '#%'));
    expect(table.getFormatedCellValue(0, 0) === '1%').toBeTruthy();
  });

  it('0.01 + #.00% = 1.00%', () => {
    const table: FitTable = createTable<FitTable>()
      .setCellValue(0, 0, 0.01)
      .setCellDataType(0, 0, createDataType('number', '#.00%'));
    expect(table.getFormatedCellValue(0, 0) === '1.00%').toBeTruthy();
  });

  it('10 + #,#% = 1,000%', () => {
    const table: FitTable = createTable<FitTable>()
      .setCellValue(0, 0, 10)
      .setCellDataType(0, 0, createDataType('number', '#,#%'));
    expect(table.getFormatedCellValue(0, 0) === '1,000%').toBeTruthy();
  });

  it('10 + #,#.00 % = 1,000.00 %', () => {
    const table: FitTable = createTable<FitTable>()
      .setCellValue(0, 0, 10)
      .setCellDataType(0, 0, createDataType('number', '#,#.00 %'));
    expect(table.getFormatedCellValue(0, 0) === '1,000.00 %').toBeTruthy();
  });

  it('100 + RON # = RON 100', () => {
    const table: FitTable = createTable<FitTable>()
      .setCellValue(0, 0, 100)
      .setCellDataType(0, 0, createDataType('number', 'RON #'));
    expect(table.getFormatedCellValue(0, 0) === 'RON 100').toBeTruthy();
  });

  it('1000 + RON#,# = RON1,000', () => {
    const table: FitTable = createTable<FitTable>()
      .setCellValue(0, 0, 1000)
      .setCellDataType(0, 0, createDataType('number', 'RON#,#'));
    expect(table.getFormatedCellValue(0, 0) === 'RON1,000').toBeTruthy();
  });

  it('1 + $#.00 = $1.00', () => {
    const table: FitTable = createTable<FitTable>()
      .setCellValue(0, 0, 1)
      .setCellDataType(0, 0, createDataType('number', '$#.00'));
    expect(table.getFormatedCellValue(0, 0) === '$1.00').toBeTruthy();
  });

  it('1000.123 + #,#.# $ = 1,000.1 $', () => {
    const table: FitTable = createTable<FitTable>()
      .setCellValue(0, 0, 1000.123)
      .setCellDataType(0, 0, createDataType('number', '#,#.# $'));
    expect(table.getFormatedCellValue(0, 0) === '1,000.1 $').toBeTruthy();
  });

  it('1 + $#% = #InvalidFormat', () => {
    const table: FitTable = createTable<FitTable>()
      .setCellValue(0, 0, 1)
      .setCellDataType(0, 0, createDataType('number', '$#%'));
    expect(table.getFormatedCellValue(0, 0) === '#InvalidFormat').toBeTruthy();
  });

  it('"text-value" + #.00 = #InvalidFormat', () => {
    const table: FitTable = createTable<FitTable>()
      .setCellValue(0, 0, 'text value')
      .setCellDataType(0, 0, createDataType('number', '#.00'));
    expect(table.getFormatedCellValue(0, 0) === '#InvalidFormat').toBeTruthy();
  });

  it('en-EN -> de-DE', () => {
    const table: FitTable = createTable<FitTable>()
      .setCellValue(0, 0, 1000)
      .setCellDataType(0, 0, createDataType('number', '#,#.00'));
    table.setLocale('de-DE'); // translate formats
    expect(table.getCellDataType(0, 0)?.getFormat() === '#.#,00').toBeTruthy();
    expect(table.getFormatedCellValue(0, 0) === '1.000,00').toBeTruthy();
  });

  it('de-DE: 1000.123 + undefined = 1000,123', () => {
    const table: FitTable = createTable<FitTable>()
      .setLocale('de-DE')
      .setCellValue(0, 0, 1000.123);
    expect(table.getFormatedCellValue(0, 0) === '1000,123').toBeTruthy();
  });

  it('de-DE: 1000.123 + #,00 = 1000,12', () => {
    const table: FitTable = createTable<FitTable>()
      .setLocale('de-DE')
      .setCellValue(0, 0, 1000.123)
      .setCellDataType(0, 0, createDataType('number', '#,00'));
    expect(table.getFormatedCellValue(0, 0) === '1000,12').toBeTruthy();
  });

  it('de-DE: 1000.123 + #.# = 1.000', () => {
    const table: FitTable = createTable<FitTable>()
      .setLocale('de-DE')
      .setCellValue(0, 0, 1000.123)
      .setCellDataType(0, 0, createDataType('number', '#.#'));
    expect(table.getFormatedCellValue(0, 0) === '1.000').toBeTruthy();
  });

  it('de-DE: 1000.123 + #.#,00 = 1.000,12', () => {
    const table: FitTable = createTable<FitTable>()
      .setLocale('de-DE')
      .setCellValue(0, 0, 1000.123)
      .setCellDataType(0, 0, createDataType('number', '#.#,00'));
    expect(table.getFormatedCellValue(0, 0) === '1.000,12').toBeTruthy();
  });
});

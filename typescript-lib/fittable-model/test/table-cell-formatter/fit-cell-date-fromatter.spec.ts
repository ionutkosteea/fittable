import { } from 'jasmine';

import {
  createDataType,
  createTable,
  registerModelConfig,
  unregisterModelConfig,
} from 'fittable-core/model';
import { FIT_MODEL_CONFIG, FitTable, FitDataType } from '../../dist/index.js';

describe('fit-cell-date-formatter.spec.ts', () => {
  beforeAll(() => registerModelConfig(FIT_MODEL_CONFIG));
  afterAll(() => unregisterModelConfig());

  it('2023-01-31 + d.M.y = 31.1.23', () => {
    const table: FitTable = createTable<FitTable>()
      .setCellValue(0, 0, '2023-01-31')
      .setCellDataType(0, 0, createDataType<FitDataType>('date-time', 'd.M.y'));
    expect(table.getCellFormattedValue(0, 0) === '31.1.23').toBeTruthy();
  });

  it('2023-01-31 + M-d-y = 1-31-23', () => {
    const table: FitTable = createTable<FitTable>()
      .setCellValue(0, 0, '2023-01-31')
      .setCellDataType(0, 0, createDataType<FitDataType>('date-time', 'M-d-y'));
    expect(table.getCellFormattedValue(0, 0) === '1-31-23').toBeTruthy();
  });

  it('2023-01-02 + y/M/d = 23/1/2', () => {
    const table: FitTable = createTable<FitTable>()
      .setCellValue(0, 0, '2023-01-02')
      .setCellDataType(0, 0, createDataType<FitDataType>('date-time', 'y/M/d'));
    expect(table.getCellFormattedValue(0, 0) === '23/1/2').toBeTruthy();
  });
  it('2023-2-1 + dd.MM.yyyy = 01.02.2023', () => {
    const table: FitTable = createTable<FitTable>()
      .setCellValue(0, 0, '2023-2-1')
      .setCellDataType(0, 0, createDataType<FitDataType>('date-time', 'dd.MM.yyyy'));
    expect(table.getCellFormattedValue(0, 0) === '01.02.2023').toBeTruthy();
  });

  it('2023-1-2 + MM-dd-yyy = 02-01-2023', () => {
    const table: FitTable = createTable<FitTable>()
      .setCellValue(0, 0, '2023-1-2')
      .setCellDataType(0, 0, createDataType<FitDataType>('date-time', 'MM-dd-yyy'));
    expect(table.getCellFormattedValue(0, 0) === '01-02-2023').toBeTruthy();
  });

  it('2023-02-01 + yyyy/MM/dd = 2023/02/01', () => {
    const table: FitTable = createTable<FitTable>()
      .setCellValue(0, 0, '2023-02-01')
      .setCellDataType(0, 0, createDataType<FitDataType>('date-time', 'yyyy/MM/dd'));
    expect(table.getCellFormattedValue(0, 0) === '2023/02/01').toBeTruthy();
  });

  it('01:02 + h:m = 1:2', () => {
    const table: FitTable = createTable<FitTable>()
      .setCellValue(0, 0, '01:02')
      .setCellDataType(0, 0, createDataType<FitDataType>('date-time', 'h:m'));
    expect(table.getCellFormattedValue(0, 0) === '1:2').toBeTruthy();
  });

  it('12:30:01 + h:m:s = 12:30:1', () => {
    const table: FitTable = createTable<FitTable>()
      .setCellValue(0, 0, '12:30:01')
      .setCellDataType(0, 0, createDataType<FitDataType>('date-time', 'h:m:s'));
    expect(table.getCellFormattedValue(0, 0) === '12:30:1').toBeTruthy();
  });

  it('2023-12-31 11:30:59 + d/M/y h:m = 31/12/23 11:30', () => {
    const table: FitTable = createTable<FitTable>()
      .setCellValue(0, 0, '2023-12-31 11:30:59')
      .setCellDataType(0, 0, createDataType<FitDataType>('date-time', 'd/M/y h:m'));
    expect(table.getCellFormattedValue(0, 0) === '31/12/23 11:30').toBeTruthy();
  });

  it('2023-12-31 11:30:59 + M-d-y h:m = 12-31-23 11:30', () => {
    const table: FitTable = createTable<FitTable>()
      .setCellValue(0, 0, '2023-12-31 11:30:59')
      .setCellDataType(0, 0, createDataType<FitDataType>('date-time', 'M-d-y h:m'));
    expect(table.getCellFormattedValue(0, 0) === '12-31-23 11:30').toBeTruthy();
  });

  it('2023-12-31 + M-d/y = #InvalidFormat', () => {
    const table: FitTable = createTable<FitTable>()
      .setCellValue(0, 0, '2023-12-31')
      .setCellDataType(0, 0, createDataType<FitDataType>('date-time', 'M-d/y'));
    expect(table.getCellFormattedValue(0, 0) === '#InvalidFormat').toBeTruthy();
  });

  it('2023-11-31 + M/d/y = #InvalidFormat', () => {
    const table: FitTable = createTable<FitTable>()
      .setCellValue(0, 0, '2023-11-31')
      .setCellDataType(0, 0, createDataType<FitDataType>('date-time', 'M/d/y'));
    expect(table.getCellFormattedValue(0, 0) === '#InvalidFormat').toBeTruthy();
  });

  it('2023-13-01 + M/d/y = #InvalidFormat', () => {
    const table: FitTable = createTable<FitTable>()
      .setCellValue(0, 0, '2023-13-01')
      .setCellDataType(0, 0, createDataType<FitDataType>('date-time', 'M/d/y'));
    expect(table.getCellFormattedValue(0, 0) === '#InvalidFormat').toBeTruthy();
  });

  it('25:30:59 + hh:mm:ss = #InvalidFormat', () => {
    const table: FitTable = createTable<FitTable>()
      .setCellValue(0, 0, '25:30:59')
      .setCellDataType(0, 0, createDataType<FitDataType>('date-time', 'hh:mm:ss'));
    expect(table.getCellFormattedValue(0, 0) === '#InvalidFormat').toBeTruthy();
  });

  it('24:30:60 + hh:mm:ss = #InvalidFormat', () => {
    const table: FitTable = createTable<FitTable>()
      .setCellValue(0, 0, '24:30:60')
      .setCellDataType(0, 0, createDataType<FitDataType>('date-time', 'hh:mm:ss'));
    expect(table.getCellFormattedValue(0, 0) === '#InvalidFormat').toBeTruthy();
  });

  it('2023-09-18 text + yyyy-MM-dd = #InvalidFormat', () => {
    const table: FitTable = createTable<FitTable>()
      .setCellValue(0, 0, '23:30 text')
      .setCellDataType(0, 0, createDataType<FitDataType>('date-time', 'yyyy-MM-dd'));
    expect(table.getCellFormattedValue(0, 0) === '#InvalidFormat').toBeTruthy();
  });
});

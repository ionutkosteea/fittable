import { } from 'jasmine';

import { createColFilterExecutor, createTable, registerModelConfig, Value, } from 'fittable-core/model';

import { FitTable, FitColFilterExecutor, FIT_MODEL_CONFIG } from '../../dist/index.js';

describe('fit-col-filter-executor.ts', () => {

  beforeAll(() => {
    registerModelConfig(FIT_MODEL_CONFIG);
  })

  it('run filter', () => {
    const table = createTable<FitTable>()
      .setCellValue(0, 0, 100)
      .setCellValue(1, 0, 200)
      .setCellValue(2, 0, 250);

    const filterExecutor = createColFilterExecutor<FitColFilterExecutor>(table)
      .addCondition(0, getFilterCondition)
      .run();
    expect(table === filterExecutor.getTable(0)).toBeTruthy();
    expect(filterExecutor.hasCondition(0)).toBeTruthy();

    const filteredTable = filterExecutor.getFilteredTable();
    expect(filteredTable).toBeDefined();
    expect(filteredTable!.getNumberOfRows() === 2).toBeTruthy();
    expect(filteredTable!.getCellValue(0, 0) === 200).toBeTruthy();
    expect(filteredTable!.getCellValue(1, 0) === 250).toBeTruthy();

    filterExecutor.clearConditions();
    expect(filterExecutor.hasCondition(0)).toBeFalsy();
  });
});

function getFilterCondition(
  rowId: number,
  colId: number,
  value?: Value
): boolean {
  return value ? value.toString().startsWith('2') : false;
}

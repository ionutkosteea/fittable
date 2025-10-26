import {} from 'jasmine';

import { Style } from 'fittable-core/model';

import { TableOperationExecutor } from './model/table-operation-executor.js';

describe('Style Operation Executor', () => {
  let executor: TableOperationExecutor;

  beforeEach(() => {
    executor = new TableOperationExecutor();
  });

  it('make undefined cell bold', () => {
    executor //
      .createTable(1, 1)
      .selectCell(0, 0)
      .runFontBold(true);

    expect(executor.getStyle('s0')).toBeDefined();
    expect(executor.getStyle('s0')?.get('font-weight') === 'bold').toBeTruthy();
    expect(executor.getCellStyleName(0, 0) === 's0').toBeTruthy();
  });

  it('make existent cell bold', () => {
    executor //
      .createTable(1, 1)
      .setCellValue(0, 0, 1000)
      .selectCell(0, 0)
      .runFontBold(true);

    expect(executor.getStyle('s0')).toBeDefined();
    expect(executor.getStyle('s0')?.get('font-weight') === 'bold').toBeTruthy();
    expect(executor.getCellStyleName(0, 0) === 's0').toBeTruthy();
  });

  it('make colored cell bold', () => {
    executor //
      .createTable(1, 1)
      .addStyle('s0', { color: 'blue' })
      .setCellStyleName(0, 0, 's0')
      .selectCell(0, 0)
      .runFontBold(true);

    const style: Style | undefined = executor.getStyle('s0');
    expect(style?.get('font-weight') === 'bold').toBeTruthy();
    expect(style?.get('color') === 'blue').toBeTruthy();
    expect(executor.getCellStyleName(0, 0) === 's0').toBeTruthy();
  });

  it('make bold cell normal', () => {
    executor //
      .createTable(1, 1)
      .addStyle('s0', { 'font-weight': 'bold' })
      .setCellStyleName(0, 0, 's0')
      .selectCell(0, 0)
      .runFontBold(false);

    expect(executor.getStyle('s0')).toBeFalsy();
    expect(executor.getCellStyleName(0, 0)).toBeFalsy();
  });

  it('make undefined cell normal', () => {
    executor //
      .createTable(1, 1)
      .selectCell(0, 0)
      .runFontBold(false);

    expect(executor.getStyle('s0')).toBeFalsy();
    expect(executor.getCellStyleName(0, 0)).toBeFalsy();
  });

  it('make existent cell normal', () => {
    executor //
      .createTable(1, 1)
      .setCellValue(0, 0, 1000)
      .selectCell(0, 0)
      .runFontBold(false);

    expect(executor.getStyle('s0')).toBeFalsy();
    expect(executor.getCellValue(0, 0) === 1000).toBeTruthy();
  });

  it('make two inexitent cells bold', () => {
    executor //
      .createTable(2, 1)
      .selectCell(0, 0)
      .selectCell(1, 0)
      .runFontBold(true);

    expect(executor.getStyle('s0')).toBeDefined();
    expect(executor.getCellStyleName(0, 0) === 's0').toBeTruthy();
    expect(executor.getCellStyleName(0, 0) === 's0').toBeTruthy();
  });

  it('make two bold cells normal', () => {
    executor //
      .createTable(2, 1)
      .addStyle('s0', { 'font-weight': 'bold' })
      .setCellStyleName(0, 0, 's0')
      .setCellStyleName(1, 0, 's0')
      .selectCell(0, 0)
      .selectCell(1, 0)
      .runFontBold(false);

    expect(executor.getStyle('s0')).toBeFalsy();
    expect(executor.getCellStyleName(0, 0)).toBeFalsy();
    expect(executor.getCellStyleName(0, 0)).toBeFalsy();
  });

  it('make two cells, one normal and one bold, bold', () => {
    executor //
      .createTable(2, 1)
      .addStyle('s0', { 'font-weight': 'bold' })
      .setCellStyleName(0, 0, 's0')
      .selectCell(0, 0)
      .selectCell(1, 0)
      .runFontBold(true);

    const style: Style | undefined = executor.getStyle('s0');
    expect(style?.get('font-weight') === 'bold').toBeTruthy();
    expect(executor.getCellStyleName(0, 0) === 's0').toBeTruthy();
    expect(executor.getCellStyleName(1, 0) === 's0').toBeTruthy();
  });

  it('make two cells, one undefined and one bold, normal', () => {
    executor //
      .createTable(2, 1)
      .addStyle('s0', { 'font-weight': 'bold' })
      .setCellStyleName(0, 0, 's0')
      .selectCell(0, 0)
      .selectCell(1, 0)
      .runFontBold(false);

    expect(executor.getNumberOfStyles() === 0).toBeTruthy();
    expect(executor.getCellStyleName(0, 0)).toBeFalsy();
    expect(executor.getCellStyleName(1, 0)).toBeFalsy();
  });

  it('make two cells, one undefined and one bold and colored, normal', () => {
    executor //
      .createTable(2, 1)
      .addStyle('s0', { 'font-weight': 'bold', color: 'blue' })
      .setCellStyleName(0, 0, 's0')
      .selectCell(0, 0)
      .selectCell(1, 0)
      .runFontBold(false);

    const style: Style | undefined = executor.getStyle('s0');
    expect(executor.getNumberOfStyles() === 1).toBeTruthy();
    expect(style?.get('color') === 'blue').toBeTruthy();
    expect(style?.get('font-weight')).toBeFalsy();
    expect(executor.getCellStyleName(0, 0) === 's0').toBeTruthy();
    expect(executor.getCellStyleName(1, 0)).toBeFalsy();
  });

  it('add cell with new style, beside cell with existing style', () => {
    executor //
      .createTable(2, 1)
      .addStyle('s0', { color: 'blue' })
      .setCellStyleName(0, 0, 's0')
      .selectCell(1, 0)
      .runFontBold(true);

    const style0: Style | undefined = executor.getStyle('s0');
    const style1: Style | undefined = executor.getStyle('s1');
    expect(executor.getNumberOfStyles() === 2).toBeTruthy();
    expect(style0?.get('color') === 'blue').toBeTruthy();
    expect(style0?.get('font-weight')).toBeFalsy();
    expect(style1?.get('font-weight') === 'bold').toBeTruthy();
    expect(style1?.get('color')).toBeFalsy();
    expect(executor.getCellStyleName(0, 0) === 's0').toBeTruthy();
    expect(executor.getCellStyleName(1, 0) === 's1').toBeTruthy();
  });

  it('make bold and colored cell normal', () => {
    executor //
      .createTable(2, 1)
      .addStyle('s0', { color: 'blue', 'font-weight': 'bold' })
      .setCellStyleName(0, 0, 's0')
      .setCellStyleName(1, 0, 's0')
      .selectCell(1, 0)
      .runFontBold(false);

    const style0: Style | undefined = executor.getStyle('s0');
    const style1: Style | undefined = executor.getStyle('s1');
    expect(executor.getNumberOfStyles() === 2).toBeTruthy();
    expect(style0?.get('color') === 'blue').toBeTruthy();
    expect(style0?.get('font-weight') === 'bold').toBeTruthy();
    expect(style1?.get('color') === 'blue').toBeTruthy();
    expect(style1?.get('font-weight')).toBeFalsy();
    expect(executor.getCellStyleName(0, 0) === 's0').toBeTruthy();
    expect(executor.getCellStyleName(1, 0) === 's1').toBeTruthy();
  });

  it('remove style', () => {
    executor //
      .createTable(1, 1)
      .addStyle('s0', { color: 'blue' })
      .setCellStyleName(0, 0, 's0')
      .selectCell(0, 0)
      .runRemoveCellStyles();

    expect(executor.getNumberOfStyles() === 0).toBeTruthy();
    expect(executor.getCellStyleName(0, 0)).toBeFalsy();
  });

  it('paint format', () => {
    executor
      .createTable(1, 2)
      .addStyle('s0', { color: 'blue' })
      .addStyle('s1', { 'font-weight': 'bold' })
      .setCellStyleName(0, 0, 's0')
      .setCellStyleName(0, 1, 's1')
      .selectCell(0, 1)
      .runPaintFormat('s0');

    expect(executor.getCellStyleName(0, 1) === 's0').toBeTruthy();
    expect(executor.getStyle('s1')).toBeUndefined();
  });
});

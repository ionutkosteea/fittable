import {} from 'jasmine';

import {
  createCellCoord,
  createCellCoord4Dto,
  createCellRange,
  createCellRange4Dto,
  createLineRange,
  createStyle,
  createTable,
  createTable4Dto,
  registerModelConfig,
  unregisterModelConfig,
} from 'fittable-core/model/index.js';

import {
  FitTable,
  FitCellCoord,
  FitCellRange,
  FitLineRange,
  FitStyle,
  FIT_MODEL_CONFIG,
  FitTableDto,
  FitMapDto,
  FitStyleDto,
  FitCellDto,
  FitMergedCellDto,
  FitCellRangeDto,
} from '../../dist/index.js';

describe('Test FitTable', () => {
  beforeAll(() => registerModelConfig(FIT_MODEL_CONFIG));
  afterAll(() => unregisterModelConfig());

  it('Create table via dto.', () => {
    const dto: FitTableDto = {
      numberOfRows: 10,
      numberOfCols: 5,
      styles: { s0: { color: 'blue' } },
      cols: { 0: { width: 300 } },
      rows: { 0: { height: 40 } },
      cells: {
        0: { 0: { value: 1000, styleName: 's0' }, 1: { value: 'text' } },
      },
      mergedCells: { 0: { 0: { colSpan: 2 } } },
    };
    const table: FitTable = createTable4Dto(dto);
    expect(table.getNumberOfRows() === 10).toBeTruthy();
    expect(table.getNumberOfCols() === 5).toBeTruthy();
    expect(table.getStyle('s0')?.get('color') === 'blue').toBeTruthy();
    expect(table.getColWidth(0) === 300).toBeTruthy();
    expect(table.getRowHeight(0) === 40).toBeTruthy();
    expect(table.getCellValue(0, 0) === 1000).toBeTruthy();
    expect(table.getCellStyleName(0, 0) === 's0').toBeTruthy();
    expect(table.getCellValue(0, 1) === 'text').toBeTruthy();
    expect(table.getCellStyleName(0, 1)).toBeFalsy();
    expect(table.getRowSpan(0, 0)).toBeFalsy();
    expect(table.getColSpan(0, 0) === 2).toBeTruthy();
  });

  it('Create table via API.', () => {
    const table: FitTable = createTable<FitTable>()
      .setNumberOfRows(10)
      .setNumberOfCols(5)
      .addStyle('s0', createStyle<FitStyle>().set('color', 'blue'))
      .setRowHeight(0, 42)
      .setColWidth(0, 50)
      .setCellValue(0, 0, 1000)
      .setCellStyleName(0, 0, 's0')
      .setCellValue(0, 1, 'text')
      .setColSpan(0, 0, 2)
      .clone();

    const dto: FitTableDto = table.getDto();
    expect(dto.numberOfRows === 10).toBeTruthy();
    expect(dto.numberOfCols === 5).toBeTruthy();
    const styles: FitMapDto<FitStyleDto> | undefined = dto.styles;
    expect(styles && styles['s0']?.color === 'blue').toBeTruthy();
    expect(dto.rows && dto.rows[0].height === 42).toBeTruthy();
    expect(dto.cols && dto.cols[0].width === 50).toBeTruthy();
    const cells: FitMapDto<FitCellDto> | undefined = dto.cells && dto.cells[0];
    expect(cells && cells[0]?.value === 1000).toBeTruthy();
    expect(cells && cells[0]?.styleName === 's0').toBeTruthy();
    expect(cells && cells[1]?.value === 'text').toBeTruthy();
    expect(cells && cells[1]?.styleName).toBeFalsy();
    const mergedCells: FitMapDto<FitMergedCellDto> | undefined =
      dto.mergedCells && dto.mergedCells[0];
    expect(mergedCells && mergedCells[0].rowSpan).toBeFalsy();
    expect(mergedCells && mergedCells[0].colSpan === 2).toBeTruthy();
  });

  it('Test remove methods', () => {
    const table: FitTable = new FitTable()
      .setNumberOfRows(2)
      .setNumberOfCols(2)
      .setCellValue(0, 0, '[0,0]')
      .setCellValue(0, 1, '[0,1]')
      .setCellValue(1, 0, '[1,0]')
      .setCellValue(1, 1, '[1,1]')
      .setRowHeight(0, 42)
      .setColWidth(1, 100);

    table.setCellValue(0, 0);
    expect(table.getCellValue(0, 0)).toBeFalsy();

    table.removeCol(1).removeColCells(1);
    expect(table.getCellValue(0, 1)).toBeFalsy();
    expect(table.getCellValue(1, 1)).toBeFalsy();
    expect(table.getColWidth(1)).toBeFalsy();

    table.removeRow(0).removeRowCells(0);
    expect(table.getRowHeight(0)).toBeFalsy();

    table.removeRow(1).removeRowCells(1);
    expect(table.getCellValue(1, 0)).toBeFalsy();
  });

  it('moveRow', () => {
    const table: FitTable = new FitTable()
      .setNumberOfRows(4)
      .setNumberOfCols(1)
      .setCellValue(0, 0, '[0,0]')
      .setCellValue(1, 0, '[1,0]')
      .setRowHeight(0, 42);

    table.moveRow(0, 2).moveRowCells(0, 2);
    expect(table.getCellValue(0, 0)).toBeFalsy();
    expect(table.getRowHeight(0)).toBeFalsy();
    expect(table.getCellValue(2, 0) === '[0,0]').toBeTruthy();
    expect(table.getRowHeight(2) === 42).toBeTruthy();

    table.moveRow(1, 2).moveRowCells(1, 2);
    expect(table.getCellValue(1, 0)).toBeFalsy();
    expect(table.getCellValue(3, 0) === '[1,0]').toBeTruthy();
  });

  it('moveCol', () => {
    const table: FitTable = new FitTable()
      .setNumberOfRows(1)
      .setNumberOfCols(4)
      .setCellValue(0, 0, '[0,0]')
      .setCellValue(0, 1, '[0,1]')
      .setColWidth(0, 100);

    table.moveCol(0, 2).moveColCells(0, 2);
    expect(table.getCellValue(0, 0)).toBeFalsy();
    expect(table.getCellValue(0, 2) === '[0,0]').toBeTruthy();
    expect(table.getColWidth(0)).toBeFalsy();
    expect(table.getColWidth(2) === 100).toBeTruthy();

    table.moveCol(1, 2).moveColCells(1, 2);
    expect(table.getCellValue(0, 1)).toBeFalsy();
    expect(table.getCellValue(0, 3) === '[0,1]').toBeTruthy();
  });

  it('getStyleNames', () => {
    const table: FitTable = new FitTable()
      .addStyle('s0', new FitStyle())
      .addStyle('s1', new FitStyle());
    expect(table.getStyleNames().length == 2).toBeTruthy();
    expect(table.getStyleNames()[0] === 's0').toBeTruthy();
    expect(table.getStyleNames()[1] === 's1').toBeTruthy();
  });

  it('removeStyle', () => {
    const table: FitTable = new FitTable()
      .addStyle('s0', new FitStyle())
      .removeStyle('s0');
    expect(table.getStyleNames().length === 0);
  });

  it('forEachCell', () => {
    const table: FitTable = new FitTable()
      .setNumberOfRows(2)
      .setNumberOfCols(2);
    let counter = 0;
    table.forEachCell(() => counter++);
    expect(counter === 4).toBeTruthy();
  });

  it('FitCellCoord', () => {
    const cellCoord: FitCellCoord = createCellCoord<FitCellCoord>(1, 2).clone();
    expect(cellCoord.equals(createCellCoord<FitCellCoord>(1, 2))).toBeTruthy();
  });

  it('FitCellRange', () => {
    const start: FitCellCoord = createCellCoord(1, 1);
    const end: FitCellCoord = createCellCoord(0, 0);
    const cellRange: FitCellRange = //
      createCellRange<FitCellRange>(start, end).clone();
    expect(cellRange.getFrom().getRowId() === 0).toBeTruthy();
    expect(cellRange.getFrom().getColId() === 0).toBeTruthy();
    expect(cellRange.getTo().getRowId() === 1).toBeTruthy();
    expect(cellRange.getTo().getColId() === 1).toBeTruthy();
    expect(cellRange.hasCell(0, 0)).toBeTruthy();
    expect(cellRange.hasCell(1, 0)).toBeTruthy();
    expect(cellRange.hasCell(0, 1)).toBeTruthy();
    expect(cellRange.hasCell(1, 1)).toBeTruthy();
    expect(cellRange.getNumberOfCells() === 4).toBeTruthy();
    expect(cellRange.getDto().from.rowId === 0).toBeTruthy();
    expect(cellRange.getDto().from.colId === 0).toBeTruthy();
    expect(cellRange.getDto().to?.rowId === 1).toBeTruthy();
    expect(cellRange.getDto().to?.colId === 1).toBeTruthy();
    const dto: FitCellRangeDto = {
      from: { rowId: 0, colId: 0 },
      to: { rowId: 1, colId: 1 },
    };
    const newCellRange = createCellRange4Dto<FitCellRange>(dto);
    expect(cellRange.equals(newCellRange)).toBeTruthy();
  });

  it('FitLineRange', () => {
    const lineRange: FitLineRange = createLineRange<FitLineRange>(0, 2).clone();
    expect(lineRange.getFrom() === 0).toBeTruthy();
    expect(lineRange.getTo() === 2).toBeTruthy();
    expect(lineRange.equals(createLineRange<FitLineRange>(0, 2))).toBeTruthy();
    expect(lineRange.contains(createLineRange(1))).toBeTruthy();
    expect(lineRange.getNumberOfLines() === 3).toBeTruthy();
    expect(lineRange.getDto().from === 0).toBeTruthy();
    expect(lineRange.getDto().to === 2).toBeTruthy();
  });
});

import {} from 'jasmine';

import {
  createCell,
  createCellCoord,
  createCellRange,
  createColumn,
  createLineRange,
  createMergedRegions,
  createRow,
  createStyle,
  createTable,
  createTable4Dto,
  registerModelConfig,
  unregisterModelConfig,
} from 'fit-core/model/index.js';

import {
  FitTable,
  FitCell,
  FitMergedRegions,
  FitMergedRegion,
  FitColumn,
  FitCellCoord,
  FitCellRange,
  FitLineRange,
  FitStyle,
  FIT_MODEL_CONFIG,
  FitRow,
  FitRowsDto,
  FitColumnsDto,
  FitCellRangeDto,
  FitStylesDto,
  FitCellsDto,
} from '../../dist/index.js';

describe('Test FitTable', () => {
  beforeAll(() => registerModelConfig(FIT_MODEL_CONFIG));
  afterAll(() => unregisterModelConfig());

  it('Create table via dto.', () => {
    const table: FitTable = createTable4Dto({
      numberOfRows: 10,
      numberOfColumns: 5,
      columnHeader: { numberOfRows: 1 },
      rowHeader: { numberOfColumns: 1 },
      styles: { s0: { color: 'blue' } },
      columns: { 0: { width: 300 } },
      rows: {
        0: {
          height: 40,
          cells: {
            0: {
              value: 1000,
              styleName: 's0',
            },
            1: { value: 'text' },
          },
        },
      },
      mergedRegions: [
        {
          from: { rowId: 0, colId: 0 },
          to: { rowId: 0, colId: 1 },
        },
      ],
    });

    expect(table.getNumberOfRows() === 10).toBeTruthy();
    expect(table.getNumberOfColumns() === 5).toBeTruthy();
    expect(table.getStyle('s0')?.get('color') === 'blue').toBeTruthy();
    expect(table.getColumn(0)?.getWidth() === 300).toBeTruthy();
    expect(table.getColumn(0)?.hasProperties()).toBeTruthy();
    expect(table.getRow(0)?.getHeight() === 40).toBeTruthy();
    expect(table.getRow(0)?.hasProperties()).toBeTruthy();
    expect(table.getRow(0)?.getNumberOfCells() === 2).toBeTruthy();
    expect(table.getCell(0, 0)?.hasProperties()).toBeTruthy();
    expect(table.getCell(0, 0)?.getValue() === 1000).toBeTruthy();
    expect(table.getCell(0, 0)?.getStyleName() === 's0').toBeTruthy();
    expect(table.getCell(0, 1)?.getValue() === 'text').toBeTruthy();
    expect(table.getCell(0, 1)?.getStyleName()).toBeFalsy();
    const mergedRegions: FitMergedRegions | undefined =
      table.getMergedRegions();
    mergedRegions?.forEachRegion((region: FitMergedRegion): void => {
      expect(region.getRowSpan() === 1).toBeTruthy();
      expect(region.getColSpan() === 2).toBeTruthy();
    });
  });

  it('Create table via API.', () => {
    const table: FitTable = createTable<FitTable>(10, 5)
      .addStyle('s0', createStyle<FitStyle>().set('color', 'blue'))
      .addRow(0, createRow<FitRow>().setHeight(42).clone())
      .addColumn(0, createColumn<FitColumn>().setWidth(50).clone())
      .addCell(
        0,
        0,
        createCell<FitCell>().setValue(1000).setStyleName('s0').clone()
      )
      .addCell(0, 1, createCell<FitCell>().setValue('text'))
      .setMergedRegions(
        createMergedRegions<FitMergedRegions>().addRegion(
          createCellCoord(0, 0),
          createCellCoord(0, 1)
        )
      )
      .clone();

    expect(table.getDto().numberOfRows === 10).toBeTruthy();
    expect(table.getDto().numberOfColumns === 5).toBeTruthy();
    const styles: FitStylesDto | undefined = table.getDto().styles;
    expect(styles && styles['s0']?.color === 'blue').toBeTruthy();
    const rows: FitRowsDto | undefined = table.getDto().rows;
    expect(rows && rows[0]?.height === 42).toBeTruthy();
    const columns: FitColumnsDto | undefined = table.getDto().columns;
    expect(columns && columns[0]?.width === 50).toBeTruthy();
    const cells: FitCellsDto | undefined = rows && rows[0].cells;
    expect(cells && cells[0]?.value === 1000).toBeTruthy();
    expect(cells && cells[0]?.styleName === 's0').toBeTruthy();
    expect(cells && cells[1]?.value === 'text').toBeTruthy();
    expect(cells && cells[1]?.styleName).toBeFalsy();
    const mergedRegions: FitCellRangeDto[] | undefined =
      table.getDto().mergedRegions;
    expect(mergedRegions && mergedRegions[0]?.from.rowId === 0).toBeTruthy();
    expect(mergedRegions && mergedRegions[0]?.from.colId === 0).toBeTruthy();
    expect(mergedRegions && mergedRegions[0]?.to?.rowId === 0).toBeTruthy();
    expect(mergedRegions && mergedRegions[0]?.to?.colId === 1).toBeTruthy();
  });

  it('Test remove methods', () => {
    const table: FitTable = new FitTable()
      .setNumberOfRows(2)
      .setNumberOfColumns(2)
      .addCell(0, 0, new FitCell())
      .addCell(0, 1, new FitCell())
      .addCell(1, 0, new FitCell())
      .addCell(1, 1, new FitCell());

    table.removeCell(0, 0);
    expect(table.getCell(0, 0)).toBeFalsy();

    table.removeColumn(1);
    expect(table.getCell(0, 1)).toBeFalsy();
    expect(table.getCell(1, 1)).toBeFalsy();
    expect(table.getColumn(1)).toBeFalsy();

    table.removeRow(0);
    expect(table.getRow(0)).toBeFalsy();

    table.removeRow(1);
    expect(table.getRow(1)).toBeFalsy();
  });

  it('moveRow', () => {
    const table: FitTable = new FitTable()
      .setNumberOfRows(4)
      .setNumberOfColumns(1)
      .addCell(0, 0, new FitCell())
      .addCell(1, 0, new FitCell());

    table.moveRow(0, 2);
    expect(table.getRow(0)).toBeFalsy();
    expect(table.getRow(2)).toBeTruthy();

    table.moveRow(1, 2);
    expect(table.getRow(1)).toBeFalsy();
    expect(table.getRow(3)).toBeTruthy();
  });

  it('moveColumn', () => {
    const table: FitTable = new FitTable()
      .setNumberOfRows(1)
      .setNumberOfColumns(4)
      .addColumn(0, new FitColumn())
      .addCell(0, 0, new FitCell())
      .addCell(0, 1, new FitCell());

    table.moveColumn(0, 2);
    expect(table.getCell(0, 0)).toBeFalsy();
    expect(table.getCell(0, 2)).toBeTruthy();
    expect(table.getColumn(0)).toBeFalsy();
    expect(table.getColumn(2)).toBeTruthy();

    table.moveColumn(1, 2);
    expect(table.getCell(0, 1)).toBeFalsy();
    expect(table.getCell(0, 3)).toBeTruthy();
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
      .setNumberOfColumns(2)
      .addCell(0, 0, new FitCell());
    let counter = 0;
    table.forEachCell(() => counter++);
    expect(counter === 1).toBeTruthy();
  });

  it('forEachCellCoord', () => {
    const table: FitTable = new FitTable()
      .setNumberOfRows(2)
      .setNumberOfColumns(2)
      .addCell(0, 0, new FitCell());
    let counter = 0;
    table.forEachCellCoord(() => counter++);
    expect(counter === 4).toBeTruthy();
  });

  it('FitCellCoord', () => {
    const cellCoord: FitCellCoord = createCellCoord<FitCellCoord>(1, 2).clone();
    expect(cellCoord.equals(createCellCoord<FitCellCoord>(1, 2))).toBeTruthy();
  });

  it('FitCellRange', () => {
    const cellRange: FitCellRange = createCellRange<FitCellRange>(
      createCellCoord(1, 1),
      createCellCoord(0, 0)
    ).clone();
    expect(cellRange.getFrom().getRowId() === 0).toBeTruthy();
    expect(cellRange.getFrom().getColId() === 0).toBeTruthy();
    expect(cellRange.getTo().getRowId() === 1).toBeTruthy();
    expect(cellRange.getTo().getColId() === 1).toBeTruthy();
    expect(cellRange.hasCell(0, 0)).toBeTruthy();
    expect(cellRange.hasCell(1, 0)).toBeTruthy();
    expect(cellRange.hasCell(0, 1)).toBeTruthy();
    expect(cellRange.hasCell(1, 1)).toBeTruthy();
    expect(cellRange.getNumberOfCells() === 4).toBeTruthy();
  });

  it('FitLineRange', () => {
    const lineRange: FitLineRange = createLineRange<FitLineRange>(0, 2).clone();
    expect(lineRange.equals(createLineRange<FitLineRange>(0, 2))).toBeTruthy();
    expect(lineRange.contains(createLineRange(1))).toBeTruthy();
    expect(lineRange.getNumberOfLines() === 3).toBeTruthy();
  });
});

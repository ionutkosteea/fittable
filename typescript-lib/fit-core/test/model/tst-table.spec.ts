import {} from 'jasmine';

import {
  createCellCoord,
  createCellCoord4Dto,
  createCellRange,
  createCellRange4Dto,
  createCellRangeList4Dto,
  CellRange,
  createDto4CellRangeList,
  createCell,
  createLineRange,
  createLineRange4Dto,
  LineRange,
  createLineRangeList4Dto,
  createDto4LineRangeList,
  CellCoord,
  registerModelConfig,
  Cell,
  createTable,
  unregisterModelConfig,
} from '../../dist/model/index.js';

import { TstCell } from './table/tst-cell.js';
import {
  TstTableDto,
  TstCellCoordDto,
  TstCellRangeDto,
  TstLineRangeDto,
} from './table/dto/tst-table-dto.js';
import { TstTable } from './table/tst-table.js';
import { tstModelConfig } from './table/tst-model-config.js';

describe('Test Table', () => {
  beforeAll(() => registerModelConfig(tstModelConfig));
  afterAll(() => unregisterModelConfig());

  it('create model via dto', () => {
    const dto: TstTableDto = {
      numberOfRows: 10,
      numberOfColumns: 5,
      rows: {
        1: {
          cells: { 0: { value: 'text' } },
        },
        3: { cells: { 2: { value: 1000, format: 'number' } } },
      },
    };

    const table: TstTable = new TstTable(dto).clone();
    expect(table.getNumberOfRows() === 10).toBeTruthy();
    expect(table.getNumberOfColumns() === 5).toBeTruthy();
    expect(table.getCell(1, 0)?.getValue() === 'text').toBeTruthy();
    expect(table.getCell(3, 2)?.getValue() === 1000).toBeTruthy();
    expect(table.getCell(3, 2)?.getFormat() === 'number').toBeTruthy();
  });

  it('create model via API', () => {
    const table: TstTable = createTable<TstTable>(10, 5)
      .addCell(1, 0, new TstCell().setValue('text').clone())
      .addCell(3, 2, new TstCell().setValue(1000).setFormat('number').clone());

    expect(table.getDto().numberOfRows === 10);
    expect(table.getDto().numberOfColumns === 5);
    expect(table.getDto().rows[1].cells[0].value === 'text');
    expect(table.getDto().rows[3].cells[2].value === 1000);
    expect(table.getDto().rows[3].cells[2].format === 'number');
  });

  it('createCellCoord', () => {
    const cellCoord: CellCoord = createCellCoord(1, 2);
    expect(cellCoord.getRowId() === 1).toBeTruthy();
    expect(cellCoord.getColId() === 2).toBeTruthy();
  });

  it('createCellCoord4Dto', () => {
    const cellCoordDto: TstCellCoordDto = { rowId: 1, colId: 2 };
    const cellCoord: CellCoord = createCellCoord4Dto(cellCoordDto);
    expect(cellCoord.getRowId() === 1).toBeTruthy();
    expect(cellCoord.getColId() === 2).toBeTruthy();
  });

  it('createCellRange', () => {
    const cellRange: CellRange = createCellRange(createCellCoord(1, 2));
    expect(cellRange.getFrom().getRowId() === 1).toBeTruthy();
    expect(cellRange.getFrom().getColId() === 2).toBeTruthy();
  });

  it('createCellRange4Dto', () => {
    const cellRangeDto: TstCellRangeDto = { from: { rowId: 1, colId: 2 } };
    const cellRange: CellRange = createCellRange4Dto(cellRangeDto);
    expect(cellRange.getFrom().getRowId() === 1).toBeTruthy();
    expect(cellRange.getFrom().getColId() === 2).toBeTruthy();
  });

  it('createCellRangeList4Dto', () => {
    const dtoList: TstCellRangeDto[] = [{ from: { rowId: 1, colId: 2 } }];
    const list: CellRange[] = createCellRangeList4Dto(dtoList);
    expect(list.length === 1).toBeTruthy();
    expect(list[0].getFrom().getRowId() === 1).toBeTruthy();
    expect(list[0].getFrom().getColId() === 2).toBeTruthy();
  });

  it('createDto4CellRangeList', () => {
    const list: CellRange[] = [createCellRange(createCellCoord(1, 2))];
    const dtoList: TstCellRangeDto[] = createDto4CellRangeList(
      list
    ) as TstCellRangeDto[];
    expect(dtoList.length === 1).toBeTruthy();
    expect(dtoList[0].from.rowId === 1).toBeTruthy();
    expect(dtoList[0].from.colId === 2).toBeTruthy();
  });

  it('createCell', () => {
    const cell: Cell = createCell().setValue(1000);
    expect(cell.getValue() === 1000).toBeTruthy();
  });

  it('createLineRange', () => {
    const lineRange: LineRange = createLineRange(1);
    expect(lineRange.getFrom() === 1).toBeTruthy();
    expect(lineRange.getTo() === 1).toBeTruthy();
  });

  it('createLineRange4Dto', () => {
    const lineRangeDto: TstLineRangeDto = { from: 1 };
    const lineRange: LineRange = createLineRange4Dto(lineRangeDto);
    expect(lineRange.getFrom() === 1).toBeTruthy();
  });

  it('createLineRangeList4Dto', () => {
    const dtoList: TstLineRangeDto[] = [{ from: 1 }];
    const list: LineRange[] = createLineRangeList4Dto(dtoList);
    expect(list.length === 1).toBeTruthy();
    expect(list[0].getFrom() === 1).toBeTruthy();
  });

  it('createDto4CellRangeList', () => {
    const list: LineRange[] = [createLineRange(1)];
    const dtoList: TstLineRangeDto[] = createDto4LineRangeList(
      list
    ) as TstLineRangeDto[];
    expect(dtoList.length === 1).toBeTruthy();
    expect(dtoList[0].from === 1).toBeTruthy();
  });
});

import {} from 'jasmine';

import {
  createCellCoord,
  createCellCoord4Dto,
  createCellRange,
  createCellRange4Dto,
  createCellRangeList4Dto,
  CellRange,
  createDto4CellRangeList,
  createLineRange,
  createLineRange4Dto,
  LineRange,
  createLineRangeList4Dto,
  createDto4LineRangeList,
  CellCoord,
  registerModelConfig,
  createTable,
  unregisterModelConfig,
  Table,
} from '../../dist/model/index.js';

import {
  TstCellCoordDto,
  TstCellRangeDto,
  TstLineRangeDto,
} from './table/dto/tst-table-dto.js';
import { TstTable } from './table/tst-table.js';
import { TST_MODEL_CONFIG } from './table/tst-model-config.js';

describe('Test Table', () => {
  beforeAll(() => registerModelConfig(TST_MODEL_CONFIG));
  afterAll(() => unregisterModelConfig());

  it('create model via dto', () => {
    const dto: string[][] = [
      ['A1', 'A2'],
      ['B1', 'B2'],
      ['C1', 'C2'],
    ];
    const table: Table = new TstTable(dto).clone();
    expect(table.getNumberOfRows() === 3).toBeTruthy();
    expect(table.getNumberOfCols() === 2).toBeTruthy();
    expect(table.getCellValue(0, 0) === 'A1').toBeTruthy();
    expect(table.getCellValue(0, 1) === 'A2').toBeTruthy();
    expect(table.getCellValue(1, 0) === 'B1').toBeTruthy();
    expect(table.getCellValue(1, 1) === 'B2').toBeTruthy();
    expect(table.getCellValue(2, 0) === 'C1').toBeTruthy();
    expect(table.getCellValue(2, 1) === 'C2').toBeTruthy();
  });

  it('create model via API', () => {
    const table: TstTable = createTable<TstTable>()
      .setNumberOfRows(5)
      .setNumberOfCols(3)
      .setCellValue(1, 0, 'text')
      .setCellValue(3, 3, 1000);

    expect(table.getDto().length === 5);
    expect(table.getDto()[1][0] === 'text');
    expect(table.getDto()[3][2] === 1000);
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

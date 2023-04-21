export interface TstCellCoordDto {
  rowId: number;
  colId: number;
}

export interface TstCellRangeDto {
  from: TstCellCoordDto;
  to?: TstCellCoordDto;
}

export interface TstLineRangeDto {
  from: number;
  to?: number;
}

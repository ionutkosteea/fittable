import {
  asTableStyles,
  CellCoord,
  CellRange,
  Style,
  Table,
} from 'fittable-core/model/index.js';

export function getFirstCellStyle(
  table: Table,
  selectedCells: CellRange[]
): Style | undefined {
  const firstRange: CellRange | undefined =
    selectedCells.length > 0 ? selectedCells[0] : undefined;
  if (!firstRange) return undefined;
  const cellCoord: CellCoord = firstRange.getFrom();
  const styleName: string =
    asTableStyles(table)?.getCellStyleName(
      cellCoord.getRowId(),
      cellCoord.getColId()
    ) ?? '';
  return asTableStyles(table)?.getStyle(styleName);
}

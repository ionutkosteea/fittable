import {
  asCellStyle,
  asTableStyles,
  Cell,
  CellCoord,
  CellRange,
  Style,
  Table,
} from 'fit-core/model/index.js';

export function getFirstCellStyle(
  table: Table,
  selectedCells: CellRange[]
): Style | undefined {
  const firstRange: CellRange | undefined =
    selectedCells.length > 0 ? selectedCells[0] : undefined;
  if (!firstRange) return undefined;
  const cellCoord: CellCoord = firstRange.getFrom();
  const cell: Cell | undefined = table.getCell(
    cellCoord.getRowId(),
    cellCoord.getColId()
  );
  const styleName: string = asCellStyle(cell)?.getStyleName() ?? '';
  return asTableStyles(table)?.getStyle(styleName);
}

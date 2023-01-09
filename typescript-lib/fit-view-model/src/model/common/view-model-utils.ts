import {
  asCellStyle,
  asTableStyles,
  Cell,
  CellCoord,
  CellRange,
  Style,
  Table,
} from 'fit-core/model/index.js';

import { FitControl } from './controls/fit-control.js';

export type ControlType =
  | 'push-button'
  | 'input'
  | 'combo'
  | 'pop-up-button'
  | 'color-picker'
  | 'border-pop-up-button'
  | 'menu-item'
  | 'label'
  | 'separator';

export function createSeparator(): FitControl {
  return new FitControl().setLabel(() => 'Separator').setType('separator');
}

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

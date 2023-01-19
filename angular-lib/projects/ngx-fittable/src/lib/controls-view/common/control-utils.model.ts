import { CssStyle, CellCoord, createCellCoord } from 'fit-core/model';
import { Window, Coord } from 'fit-core/view-model';

export type ControlType =
  | 'push-button'
  | 'input'
  | 'separator'
  | 'combo'
  | 'pop-up-button'
  | 'color-picker'
  | 'border-pop-up-button'
  | 'menu-item'
  | 'label';

export function createWindowStyle(window: Window): CssStyle {
  const display: string = window.isVisible() ? 'block' : 'none';
  const position: Coord = window.getPosition();
  const x: number = position.x;
  const y: number = position.y;
  const transform: string = 'translate3d(' + x + 'px,' + y + 'px,0px)';
  return { display, transform };
}

export function getCellCoord(htmlCell: HTMLElement): CellCoord {
  const rowId: string | undefined = getAttValue(htmlCell, 'rowId');
  const colId: string | undefined = getAttValue(htmlCell, 'colId');
  if (rowId && colId) return createCellCoord(Number(rowId), Number(colId));
  else
    throw new Error(
      'Missing attributes rowId and colId on element ' + htmlCell.tagName
    );
}

function getAttValue(
  element: HTMLElement,
  attName: string
): string | undefined {
  return (
    element.getAttribute(attName) ??
    element.parentElement?.getAttribute(attName) ??
    undefined
  );
}

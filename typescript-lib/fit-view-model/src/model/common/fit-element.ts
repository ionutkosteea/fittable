import { CellCoord, createCellCoord } from 'fit-core/model/index.js';

export type FitElement = {
  parentElement: FitElement | null;
  tagName: string;
  getAttribute(name: string): string | null;
};

export function getCellCoord(htmlCell: FitElement): CellCoord {
  const rowId: string | undefined = getAttValue(htmlCell, 'rowId');
  const colId: string | undefined = getAttValue(htmlCell, 'colId');
  if (rowId && colId) return createCellCoord(Number(rowId), Number(colId));
  else
    throw new Error(
      'Missing attributes rowId and colId on element ' + htmlCell.tagName
    );
}

function getAttValue(
  element: FitElement | null,
  attName: string
): string | undefined {
  if (!element) return undefined;
  const attValue: string | null = element.getAttribute(attName);
  if (attValue) return attValue;
  else return getAttValue(element.parentElement, attName);
}

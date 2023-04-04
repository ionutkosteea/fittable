import { CellCoord, createCellCoord } from 'fit-core/model/index.js';
import { FitHtmlElement } from 'fit-core/view-model/index.js';

export function getCellCoord(htmlCell: FitHtmlElement): CellCoord {
  const rowId: string | undefined = getAttValue(htmlCell, 'rowId');
  const colId: string | undefined = getAttValue(htmlCell, 'colId');
  if (rowId && colId) return createCellCoord(Number(rowId), Number(colId));
  else
    throw new Error(
      'Missing attributes rowId and colId on element ' + htmlCell.tagName
    );
}

function getAttValue(
  element: FitHtmlElement | null,
  attName: string
): string | undefined {
  if (!element) return undefined;
  const attValue: string | null = element.getAttribute(attName);
  if (attValue) return attValue;
  else return getAttValue(element.parentElement, attName);
}

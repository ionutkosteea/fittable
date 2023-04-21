import {
  Table,
  TableStyles,
  CellRange,
  Style,
  createStyle,
  CellRangeList,
} from 'fittable-core/model/index.js';

export function findUpdatableCellStyles(
  table: Table & TableStyles,
  selectedCells: CellRange[],
  newStyle?: Style
): Map<string | undefined, CellRangeList> {
  const updatableStyles: Map<string | undefined, CellRangeList> = new Map();
  for (const cellRange of selectedCells) {
    cellRange.forEachCell((rowId: number, colId: number): void => {
      const styleName: string | undefined = //
        table.getCellStyleName(rowId, colId);
      if (styleName) {
        const oldStyle: Style | undefined = table.getStyle(styleName);
        if (oldStyle && !oldStyle.contains(newStyle)) {
          setUpdatableStyles({ updatableStyles, rowId, colId, styleName });
        }
      } else if (newStyle) {
        setUpdatableStyles({ updatableStyles, rowId, colId, styleName });
      }
    });
  }
  return updatableStyles;
}

function setUpdatableStyles(args: {
  updatableStyles: Map<string | undefined, CellRangeList>;
  rowId: number;
  colId: number;
  styleName?: string;
}): void {
  if (args.updatableStyles.has(args.styleName)) {
    args.updatableStyles.get(args.styleName)?.addCell(args.rowId, args.colId);
  } else {
    args.updatableStyles.set(
      args.styleName,
      new CellRangeList().addCell(args.rowId, args.colId)
    );
  }
}

export function countAllCellStyleNames(
  table: Table & TableStyles
): Map<string, number> {
  const cellStyleNamesCounter: Map<string, number> = new Map();
  table.forEachCell((rowId: number, colId: number): void => {
    countCellStyleName(cellStyleNamesCounter, table, rowId, colId);
  });
  return cellStyleNamesCounter;
}

export function countSelectedCellStyleNames(
  table: Table & TableStyles,
  selectedCells: CellRange[]
): Map<string, number> {
  const cellStyleNamesCounter: Map<string, number> = new Map();
  for (const range of selectedCells) {
    range.forEachCell((rowId: number, colId: number): void => {
      countCellStyleName(cellStyleNamesCounter, table, rowId, colId);
    });
  }
  return cellStyleNamesCounter;
}

function countCellStyleName(
  cellStyleNamesCounter: Map<string, number>,
  table: Table & TableStyles,
  rowId: number,
  colId: number
): void {
  const styleName: string | undefined = table.getCellStyleName(rowId, colId);
  if (styleName) {
    if (cellStyleNamesCounter.has(styleName)) {
      const count: number = cellStyleNamesCounter.get(styleName) ?? 0;
      cellStyleNamesCounter.set(styleName, count + 1);
    } else {
      cellStyleNamesCounter.set(styleName, 1);
    }
  }
}

export function getMaxStyleNameUid(table: Table & TableStyles): number {
  let styleNameUid = -1;
  for (const styleName of table.getStyleNames()) {
    try {
      const uid = Number(styleName.substring(1, styleName.length));
      if (styleNameUid < uid) styleNameUid = uid;
    } catch {
      throw Error(
        'Style name text has to be composed by a letter followd by a number'
      );
    }
  }
  return styleNameUid;
}

export function createStyleName(styleNameUid: number): string {
  return 's' + styleNameUid;
}

export function styleByCss(cssStyle: string): Style {
  const style: Style = createStyle();
  const properties: string[] = cssStyle.split(';');
  for (const property of properties) {
    const nameAndValue: string[] = property.split(':');
    if (nameAndValue?.length === 2) {
      const name: string = nameAndValue[0].trim() as string;
      const value: string | number = nameAndValue[1].trim();
      style.set(name, value);
    }
  }
  return style;
}

import {
  Style,
  TableStyles,
  Table,
  CellRange,
  createCellRange4Dto,
  asTableStyles,
  asTableMergedRegions,
  TableMergedRegions,
  Value,
  TableDataTypes,
  asTableDataTypes,
  DataType,
  TableDataRefs,
  asTableDataRefs,
} from 'fittable-core/model';
import {
  TableChangeWritter,
  TableChangeWritterFactory,
  Args,
} from 'fittable-core/operations';

export type CellCopyChange = Args<'cell-copy'> & { cellRange: unknown };

export class CellCopyChangeWritter implements TableChangeWritter {
  private readonly tableStyles?: Table & TableStyles;
  private readonly tableMergedRegions?: Table & TableMergedRegions;
  private readonly tableDataTypes?: Table & TableDataTypes;
  private readonly tableDataRefs?: Table & TableDataRefs;

  constructor(
    private readonly table: Table,
    private readonly change: CellCopyChange
  ) {
    this.tableStyles = asTableStyles(table);
    this.tableMergedRegions = asTableMergedRegions(this.table);
    this.tableDataTypes = asTableDataTypes(this.table);
    this.tableDataRefs = asTableDataRefs(this.table);
  }

  public run(): void {
    const text: string = this.createCliboardText();
    const htmlText: Blob = new Blob([text], { type: 'text/html' });
    const data: ClipboardItem[] = [
      new ClipboardItem({ 'text/html': htmlText }),
    ];
    navigator.clipboard.write(data).then(
      (): void => {
        console.log('Copied to clipboard successfully!');
      },
      (error: unknown): void => {
        console.error('Unable to write to clipboard!', error);
      }
    );
  }

  private createCliboardText(): string {
    let text = '<table>';
    const cellRange: CellRange = createCellRange4Dto(this.change.cellRange);
    const fromRowId: number = cellRange.getFrom().getRowId();
    const fromColId: number = cellRange.getFrom().getColId();
    const toRowId: number = cellRange.getTo().getRowId();
    const toColId: number = cellRange.getTo().getColId();
    for (let i: number = fromRowId; i <= toRowId; i++) {
      text += '<tr>';
      for (let j: number = fromColId; j <= toColId; j++) {
        text += this.createHtmlCell(i, j);
      }
      text += '</tr>';
    }
    text += '</table>';
    return text;
  }

  private createHtmlCell(rowId: number, colId: number): string {
    if (this.isMergedHiddenCell(rowId, colId)) {
      return '';
    } else {
      let attributes = '';
      attributes += this.getMergedRegionsAtt(rowId, colId);
      attributes += this.getCssStyleAtt(rowId, colId);
      attributes += this.getCellDataTypeAtt(rowId, colId);
      attributes += this.getCellDataRefAtt(rowId, colId);
      const value: Value | undefined = this.table.getCellValue(rowId, colId);
      if (value === undefined) {
        return `<td${attributes}></td>`;
      } else {
        let text: string = '' + value;
        text = text.replaceAll('\n', '<br>');
        return `<td${attributes}>${text}</td>`;
      }
    }
  }

  private isMergedHiddenCell(rowId: number, colId: number): boolean {
    let isHiddenCell = false;
    if (this.tableMergedRegions) {
      this.tableMergedRegions.forEachMergedCell(
        (row: number, col: number): void => {
          if (isHiddenCell) return;
          if (row === rowId && col === colId) return;
          const rowSpan: number =
            this.tableMergedRegions?.getRowSpan(row, col) ?? 0;
          const colSpan: number =
            this.tableMergedRegions?.getColSpan(row, col) ?? 0;
          isHiddenCell =
            rowId >= row &&
            rowId < row + rowSpan &&
            colId >= col &&
            colId < col + colSpan;
        }
      );
    }
    return isHiddenCell;
  }

  private getMergedRegionsAtt(rowId: number, colId: number): string {
    const rowSpan: number =
      this.tableMergedRegions?.getRowSpan(rowId, colId) ?? 0;
    const colSpan: number =
      this.tableMergedRegions?.getColSpan(rowId, colId) ?? 0;
    const rowSpanAtt: string = rowSpan > 1 ? ` rowspan="${rowSpan}"` : '';
    const colSpanAtt: string = colSpan > 1 ? ` colspan="${colSpan}"` : '';
    return rowSpanAtt + colSpanAtt;
  }

  private getCellDataTypeAtt(rowId: number, colId: number): string {
    let result = '';
    const dataType: DataType | undefined =
      this.tableDataTypes?.getCellDataType(rowId, colId);
    if (dataType) {
      result += ` data-data-type-name="${dataType.getName()}"`;
      if (dataType.getFormat()) {
        result += ` data-data-type-format="${dataType.getFormat()}"`;
      }
    }
    return result;
  }

  private getCellDataRefAtt(rowId: number, colId: number): string {
    const dataRef: string | undefined = this.tableDataRefs?.getCellDataRef(rowId, colId);
    if (dataRef) return ` data-cell-data-ref="${dataRef.replaceAll("\"", "&quot;")}"`;
    return '';
  }

  private getCssStyleAtt(rowId: number, colId: number): string {
    if (!this.tableStyles) return '';
    const styleName: string | undefined =
      this.tableStyles.getCellStyleName(rowId, colId);
    const style: Style | undefined = styleName
      ? this.tableStyles.getStyle(styleName)
      : undefined;
    return style ? ` style="${style.toCssText()}"` : '';
  }
}

export class CellCopyChangeWritterFactory implements TableChangeWritterFactory {
  public createTableChangeWritter(
    table: Table,
    change: CellCopyChange
  ): TableChangeWritter {
    return new CellCopyChangeWritter(table, change);
  }
}

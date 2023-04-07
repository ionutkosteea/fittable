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
} from 'fit-core/model/index.js';
import {
  OperationStep,
  OperationStepFactory,
  OperationId,
} from 'fit-core/operations/index.js';

export type CellCopyOperationStepDto = OperationId<'cell-copy'> & {
  cellRange: unknown;
};

export class CellCopyOperationStep implements OperationStep {
  private readonly styledTable?: Table & TableStyles;
  private readonly mergedRegionsTable?: Table & TableMergedRegions;

  constructor(
    private readonly table: Table,
    private readonly stepDto: CellCopyOperationStepDto
  ) {
    this.styledTable = asTableStyles(table);
    this.mergedRegionsTable = asTableMergedRegions(this.table);
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
    const cellRange: CellRange = createCellRange4Dto(this.stepDto.cellRange);
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
      const rowSpan: number =
        this.mergedRegionsTable?.getRowSpan(rowId, colId) ?? 0;
      const colSpan: number =
        this.mergedRegionsTable?.getColSpan(rowId, colId) ?? 0;
      const rowSpanAtt: string = rowSpan > 1 ? 'rowspan="' + rowSpan + '"' : '';
      const colSpanAtt: string = colSpan > 1 ? 'colspan="' + colSpan + '"' : '';
      let attributes: string = rowSpanAtt + ' ' + colSpanAtt;
      const cssStyle: string = this.getCssStyle(rowId, colId);
      const value: Value | undefined = this.table.getCellValue(rowId, colId);
      if (cssStyle || value) {
        attributes += ' ' + this.getCssStyle(rowId, colId);
        let text: string = value ? '' + value : '';
        text = text.replaceAll('\n', '<br>');
        return '<td ' + attributes + '>' + text + '</td>';
      } else {
        return '<td ' + attributes + '></td>';
      }
    }
  }

  private isMergedHiddenCell(rowId: number, colId: number): boolean {
    let isHiddenCell = false;
    if (this.mergedRegionsTable) {
      this.mergedRegionsTable.forEachMergedCell(
        (row: number, col: number): void => {
          if (isHiddenCell) return;
          if (row === rowId && col === colId) return;
          const rowSpan: number =
            this.mergedRegionsTable?.getRowSpan(row, col) ?? 0;
          const colSpan: number =
            this.mergedRegionsTable?.getColSpan(row, col) ?? 0;
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

  private getCssStyle(rowId: number, colId: number): string {
    if (!this.styledTable) return '';
    const styleName: string | undefined = //
      this.styledTable.getCellStyleName(rowId, colId);
    const style: Style | undefined = styleName
      ? this.styledTable.getStyle(styleName)
      : undefined;
    return style ? ' style="' + style.toCssText() + '"' : '';
  }
}

export class CellCopyOperationStepFactory implements OperationStepFactory {
  public createStep(
    table: Table,
    stepDto: CellCopyOperationStepDto
  ): OperationStep {
    return new CellCopyOperationStep(table, stepDto);
  }
}

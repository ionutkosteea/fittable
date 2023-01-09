import {
  Style,
  Cell,
  TableStyles,
  Table,
  asCellStyle,
  CellRange,
  createCellRange4Dto,
  asTableStyles,
  MergedRegions,
  asTableMergedRegions,
  TableMergedRegions,
} from 'fit-core/model/index.js';
import {
  OperationStep,
  OperationStepFactory,
  Id,
} from 'fit-core/operations/index.js';

export type CellCopyOperationStepDto = Id<'cell-copy'> & {
  selectedCellRange: unknown;
};

export class CellCopyOperationStep implements OperationStep {
  private readonly styledTable?: TableStyles;
  private readonly mergedRegionsTable?: TableMergedRegions;

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
    var data = [new ClipboardItem({ 'text/html': htmlText })];
    navigator.clipboard.write(data).then(
      () => console.log('Copied to clipboard successfully!'),
      (error) => console.error('Unable to write to clipboard!', error)
    );
  }

  private createCliboardText(): string {
    let text = '<table>';
    const cellRange: CellRange = createCellRange4Dto(
      this.stepDto.selectedCellRange
    );
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
    const mergedRegions: MergedRegions | undefined =
      this.mergedRegionsTable?.getMergedRegions();
    const rowSpan: number = mergedRegions?.getRowSpan(rowId, colId) ?? 1;
    const colSpan: number = mergedRegions?.getColSpan(rowId, colId) ?? 1;
    if (rowSpan === 0 && colSpan === 0) {
      return '';
    } else {
      const rowSpanAtt: string = rowSpan > 1 ? 'rowspan="' + rowSpan + '"' : '';
      const colSpanAtt: string = colSpan > 1 ? 'colspan="' + colSpan + '"' : '';
      let attributes: string = rowSpanAtt + ' ' + colSpanAtt;
      const cell: Cell | undefined = this.table.getCell(rowId, colId);
      if (cell) {
        attributes += ' ' + this.getCssStyle(cell);
        let text: string = cell.getValue() ? '' + cell.getValue() : '';
        text = text.replaceAll('\n', '<br>');
        return '<td ' + attributes + '>' + text + '</td>';
      } else {
        return '<td ' + attributes + '></td>';
      }
    }
  }

  private getCssStyle(cell: Cell): string {
    if (!this.styledTable) return '';
    const styleName: string | undefined = asCellStyle(cell)?.getStyleName();
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

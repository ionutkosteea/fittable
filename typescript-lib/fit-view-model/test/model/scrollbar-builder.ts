import {
  Table,
  asTableRows,
  createRow,
  asTableColumns,
  createColumn,
  createTable,
  RowHeight,
  Line,
  ColumnWidth,
} from 'fit-core/model/index.js';
import { TableViewer, createTableViewer } from 'fit-core/view-model/index.js';

import {
  VirtualScroller,
  VerticalScrollbar,
  HorizontalScrollbar,
} from '../../dist/model/table-scroller/fit-scrollbar.js';

export type ScrollbarType = 'vertical' | 'horizontal';

export class ScrollbarBuilder {
  private viewport = 0;
  private numberOfTableLines = 0;
  private hasTableRowHeader = false;
  private hasTableColumnHeader = false;
  private tableLineDimensions: Map<number, number> = new Map();

  constructor(private readonly type: ScrollbarType = 'vertical') {}

  public setViewport(viewport = 0): this {
    this.viewport = viewport;
    return this;
  }

  public setTableRowHeader(hasHeader: boolean): this {
    this.hasTableRowHeader = hasHeader;
    return this;
  }

  public setTableColumnHeader(hasHeader: boolean): this {
    this.hasTableColumnHeader = hasHeader;
    return this;
  }

  public setNumberOfTableLines(numberOfLines = 0): this {
    this.numberOfTableLines = numberOfLines;
    return this;
  }

  public setTableLineDimension(lineId: number, dimension: number): this {
    this.tableLineDimensions.set(lineId, dimension);
    return this;
  }

  public build(): VirtualScroller {
    return this.createScrollbar();
  }

  private createTable(): Table {
    const table: Table = createTable(1, 1);
    if (this.type === 'vertical') {
      table.setNumberOfRows(this.numberOfTableLines);
      this.tableLineDimensions.forEach((dimension: number, lineId: number) => {
        const row: Line & RowHeight = createRow<Line & RowHeight>();
        row.setHeight(dimension);
        asTableRows(table)?.addRow(lineId, row);
      });
      if (this.hasTableColumnHeader) {
        //TODO
      }
    } else {
      table.setNumberOfColumns(this.numberOfTableLines);
      this.tableLineDimensions.forEach((dimension: number, lineId: number) => {
        const col: Line & ColumnWidth = createColumn<Line & ColumnWidth>();
        col.setWidth(dimension);
        asTableColumns(table)?.addColumn(lineId, col);
      });
      if (this.hasTableRowHeader) {
        //TODO
      }
    }
    return table;
  }

  private createScrollbar(): VirtualScroller {
    const table: Table = this.createTable();
    const tableCache: TableViewer = createTableViewer(table);
    const scrollbar: VirtualScroller =
      this.type === 'vertical'
        ? new VerticalScrollbar(tableCache)
        : new HorizontalScrollbar(tableCache);
    scrollbar.setViewport(this.viewport);
    return scrollbar;
  }
}

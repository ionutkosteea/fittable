import {
  FitTable,
  FitMergedRegions,
  FitCell,
  FitStyle,
  FitRowHeader,
  FitColumnHeader,
  FitCellCoord,
} from 'fit-model';

export class TableSupplier {
  public static get(): FitTable {
    return new TableSupplier().createTable();
  }

  private constructor() {}

  private createTable(): FitTable {
    const table: FitTable = new FitTable()
      .setNumberOfRows(200)
      .setNumberOfColumns(50)
      .setRowHeader(this.createRowHeader())
      .setColumnHeader(this.createColumnHeader())
      .addStyle('s0', this.createStyle0())
      .addStyle('s1', this.createStyle1())
      .setMergedRegions(this.createMergedRegions());
    table.forEachCellCoord((rowId: number, colId: number): void =>
      this.createAndAddCells(table, rowId, colId)
    );

    table.getRow(28)?.setHeight(200);
    return table;
  }

  private createRowHeader(): FitRowHeader {
    return new FitRowHeader().setNumberOfColumns(1);
  }

  private createColumnHeader(): FitColumnHeader {
    return new FitColumnHeader().setNumberOfRows(1);
  }

  private createStyle0(): FitStyle {
    return new FitStyle({
      'text-align': 'center',
      'place-items': 'center normal',
      color: '#6c5700',
      'background-color': '#ffe887',
      'font-weight': 'bold',
      'font-style': 'italic',
      'border-left': '1px solid #6c5700',
      'border-top': '1px solid #6c5700',
      'border-right': '1px solid #6c5700',
      'border-bottom': '1px solid #6c5700',
    });
  }

  private createStyle1(): FitStyle {
    return new FitStyle({
      'border-left': '2px solid red',
      'border-top': '2px solid red',
      'border-right': '2px solid red',
      'border-bottom': '2px solid red',
    });
  }

  private createMergedRegions(): FitMergedRegions {
    return new FitMergedRegions().addRegion(
      new FitCellCoord({ rowId: 60, colId: 1 }),
      new FitCellCoord({ rowId: 63, colId: 3 })
    );
  }

  private createAndAddCells(
    table: FitTable,
    rowId: number,
    colId: number
  ): void {
    const cell = new FitCell();
    if ((rowId === 0 && colId === 0) || (rowId === 1 && colId === 1)) {
      cell.setValue('first line\nsecond line\nthird line');
    } else if (rowId !== 0) {
      cell.setValue('[' + rowId + ',' + colId + ']');
    }
    if (rowId === 0 || rowId === 50 || colId === 0) {
      cell.setStyleName('s0');
    }
    if (rowId === 2 && colId === 2) {
      cell.setStyleName('s1');
    }
    if (rowId === 60 && colId === 1) {
      cell.setStyleName('s1');
    }
    table.addCell(rowId, colId, cell);

    // if (rowId < 100 && colId < 25 && rowId % 3 === 0 && colId % 3 === 0) {
    //   table
    //     .getMergedRegions()
    //     .addRegion(
    // new FitCellCoord({ rowId, colId }),
    // new FitCellCoord({ rowId: rowId+2, colId: colId+2 }),
    //     );
    // }
  }
}

import {
  CellCoord,
  CellRange,
  createCellRange,
  createCellCoord,
} from 'fittable-core/model/index.js';
import { NeighborCells, TableViewer } from 'fittable-core/view-model/index.js';

export class FitNeighborCells implements NeighborCells {
  private tableViewer!: TableViewer;
  private cell!: CellCoord;

  public setTableViewer(tableViewer: TableViewer): this {
    this.tableViewer = tableViewer;
    return this;
  }

  public setCell(cell: CellCoord): this {
    this.cell = cell;
    return this;
  }

  public getLeftCell(): CellCoord {
    let leftCell: CellCoord = this.cell.clone();
    if (this.cell.getColId() > 0) {
      leftCell.setColId(leftCell.getColId() - 1);
      const region: CellRange | undefined = this.getMergedRegion(
        this.tableViewer,
        leftCell.getRowId(),
        leftCell.getColId()
      );
      if (region) leftCell = region.getFrom().clone();
    }
    return leftCell;
  }

  public getTopCell(): CellCoord {
    let topCell: CellCoord = this.cell.clone();
    if (this.cell.getRowId() > 0) {
      topCell.setRowId(topCell.getRowId() - 1);
      const region: CellRange | undefined = this.getMergedRegion(
        this.tableViewer,
        topCell.getRowId(),
        topCell.getColId()
      );
      if (region) topCell = region.getFrom().clone();
    }
    return topCell;
  }

  public getRightCell(): CellCoord {
    let rightCell: CellCoord = this.cell.clone();
    if (this.cell.getColId() < this.tableViewer.getNumberOfCols() - 1) {
      let region: CellRange | undefined = this.getMergedRegion(
        this.tableViewer,
        this.cell.getRowId(),
        this.cell.getColId()
      );
      if (region) {
        rightCell.setColId(region.getTo().getColId() + 1);
      } else {
        region = this.getMergedRegion(
          this.tableViewer,
          this.cell.getRowId(),
          this.cell.getColId() + 1
        );
        if (region) rightCell = region.getFrom().clone();
        else rightCell.setColId(rightCell.getColId() + 1);
      }
    }
    return rightCell;
  }

  public getBottomCell(): CellCoord {
    let bottomCell: CellCoord = this.cell.clone();
    if (this.cell.getRowId() < this.tableViewer.getNumberOfRows() - 1) {
      let region: CellRange | undefined = this.getMergedRegion(
        this.tableViewer,
        this.cell.getRowId(),
        this.cell.getColId()
      );
      if (region) {
        bottomCell.setRowId(region.getTo().getRowId() + 1);
      } else {
        region = this.getMergedRegion(
          this.tableViewer,
          this.cell.getRowId() + 1,
          this.cell.getColId()
        );
        if (region) bottomCell = region.getFrom().clone();
        else bottomCell.setRowId(bottomCell.getRowId() + 1);
      }
    }
    return bottomCell;
  }

  private getMergedRegion(
    tableViewer: TableViewer,
    rowId: number,
    colId: number
  ): CellRange | undefined {
    let region: CellRange | undefined = undefined;
    tableViewer.forEachMergedCell((row: number, col: number): void => {
      if (region) return;
      const rowSpan: number = tableViewer.getRowSpan(row, col) ?? 0;
      const colSpan: number = tableViewer.getColSpan(row, col) ?? 0;
      const toRow: number = rowSpan ? row + rowSpan - 1 : row;
      const toCol: number = colSpan ? col + colSpan - 1 : col;
      if (rowId >= row && rowId <= toRow && colId >= col && colId <= toCol) {
        region = createCellRange(
          createCellCoord(row, col),
          createCellCoord(toRow, toCol)
        );
      }
    });
    return region;
  }
}

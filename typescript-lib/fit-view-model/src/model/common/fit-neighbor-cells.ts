import {
  CellCoord,
  MergedRegion,
  asTableMergedRegions,
  Table,
} from 'fit-core/model/index.js';
import { NeighborCells } from 'fit-core/view-model/index.js';

export class FitNeighborCells implements NeighborCells {
  private table!: Table;
  private cell!: CellCoord;

  public setTable(table: Table): this {
    this.table = table;
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
      const region: MergedRegion | undefined = this.getMergedRegion(
        this.table,
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
      const region: MergedRegion | undefined = this.getMergedRegion(
        this.table,
        topCell.getRowId(),
        topCell.getColId()
      );
      if (region) topCell = region.getFrom().clone();
    }
    return topCell;
  }

  public getRightCell(): CellCoord {
    let rightCell: CellCoord = this.cell.clone();
    if (this.cell.getColId() < this.table.getNumberOfColumns() - 1) {
      let region: MergedRegion | undefined = this.getMergedRegion(
        this.table,
        this.cell.getRowId(),
        this.cell.getColId()
      );
      if (region) {
        rightCell.setColId(rightCell.getColId() + region.getColSpan());
      } else {
        region = this.getMergedRegion(
          this.table,
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
    if (this.cell.getRowId() < this.table.getNumberOfRows() - 1) {
      let region: MergedRegion | undefined = this.getMergedRegion(
        this.table,
        this.cell.getRowId(),
        this.cell.getColId()
      );
      if (region) {
        bottomCell.setRowId(bottomCell.getRowId() + region.getRowSpan());
      } else {
        region = this.getMergedRegion(
          this.table,
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
    table: Table,
    rowId: number,
    colId: number
  ): MergedRegion | undefined {
    return asTableMergedRegions(table)
      ?.getMergedRegions()
      ?.getRegion(rowId, colId);
  }
}

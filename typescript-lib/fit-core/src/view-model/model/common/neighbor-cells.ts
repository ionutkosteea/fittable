import { Table } from '../../../model/table.js';
import { CellCoord } from '../../../model/cell-coord.js';

export interface NeighborCells {
  setTable(table: Table): this;
  setCell(cell: CellCoord): this;
  getLeftCell(): CellCoord;
  getTopCell(): CellCoord;
  getRightCell(): CellCoord;
  getBottomCell(): CellCoord;
}

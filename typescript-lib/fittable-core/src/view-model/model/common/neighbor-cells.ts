import { CellCoord } from '../../../model/cell-coord.js';
import { TableViewer } from '../table-viewer.js';

export interface NeighborCells {
  setTableViewer(tableViewer: TableViewer): this;
  setCell(cell: CellCoord): this;
  getLeftCell(): CellCoord;
  getTopCell(): CellCoord;
  getRightCell(): CellCoord;
  getBottomCell(): CellCoord;
}

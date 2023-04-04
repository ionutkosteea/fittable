import { Observable } from 'rxjs';

import { CellCoord } from '../../../dist/model/cell-coord.js';
import {
  CellEditor,
  InputControl,
  NeighborCells,
  Rectangle,
} from '../../../dist/view-model/index.js';

export class TstCellEditor implements CellEditor {
  isVisible(): boolean {
    throw new Error('Method not implemented.');
  }
  setVisible(visible: boolean): this {
    throw new Error('Method not implemented.');
  }
  onAfterSetVisible$(): Observable<boolean> {
    throw new Error('Method not implemented.');
  }
  getCell(): CellCoord {
    throw new Error('Method not implemented.');
  }
  setCell(cellCoord: CellCoord): this {
    throw new Error('Method not implemented.');
  }
  onAfterSetCell$(): Observable<CellCoord> {
    throw new Error('Method not implemented.');
  }
  hasPointerEvents(): boolean {
    throw new Error('Method not implemented.');
  }
  setPointerEvents(events: boolean): this {
    throw new Error('Method not implemented.');
  }
  onAfterSetPointerEvents$(): Observable<boolean> {
    throw new Error('Method not implemented.');
  }
  getCellControl(): InputControl {
    throw new Error('Method not implemented.');
  }
  getCellRectangle(): Rectangle | undefined {
    throw new Error('Method not implemented.');
  }
  getNeighborCells(): NeighborCells {
    throw new Error('Method not implemented.');
  }
  hasFocus(): boolean {
    throw new Error('Method not implemented.');
  }
  setFocus(focus: boolean, ignoreTrigger?: boolean | undefined): this {
    throw new Error('Method not implemented.');
  }
  onAfterSetFocus$(): Observable<boolean> {
    throw new Error('Method not implemented.');
  }
}

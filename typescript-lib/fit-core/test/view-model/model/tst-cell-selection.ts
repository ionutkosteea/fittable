import { Observable } from 'rxjs';

import { CellCoord, CellRange } from '../../../dist/model/index.js';
import {
  CellSelection,
  CellSelectionRanges,
  NeighborCells,
} from '../../../dist/view-model/index.js';

export class TstCellSelection implements CellSelection {
  rowHeader?: CellSelectionRanges | undefined;
  colHeader?: CellSelectionRanges | undefined;
  pageHeader?: CellSelectionRanges | undefined;
  body = new TstCellSelectionRanges();
  clear(): this {
    throw new Error('Method not implemented.');
  }
  destroy(): void {
    throw new Error('Method not implemented.');
  }
}

export class TstCellSelectionRanges implements CellSelectionRanges {
  name = 'Body';
  createRange(): this {
    throw new Error('Method not implemented.');
  }
  addRange(firstCell: CellCoord, lastCell?: CellCoord | undefined): this {
    throw new Error('Method not implemented.');
  }
  getRanges(): CellRange[] {
    throw new Error('Method not implemented.');
  }
  removeRanges(): this {
    throw new Error('Method not implemented.');
  }
  removePreviousRanges(): this {
    throw new Error('Method not implemented.');
  }
  addCell(cellCoord: CellCoord): this {
    throw new Error('Method not implemented.');
  }
  onAfterAddCell$(): Observable<CellCoord> {
    throw new Error('Method not implemented.');
  }
  hasCell(cellCoord: CellCoord): boolean {
    throw new Error('Method not implemented.');
  }
  getFirstCell(): CellCoord | undefined {
    throw new Error('Method not implemented.');
  }
  getLastCell(): CellCoord | undefined {
    throw new Error('Method not implemented.');
  }
  getNeighborCells(): NeighborCells {
    throw new Error('Method not implemented.');
  }
  end(): this {
    throw new Error('Method not implemented.');
  }
  onEnd$(): Observable<CellRange[]> {
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

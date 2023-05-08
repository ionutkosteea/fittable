import { CellCoord } from 'fittable-core/model';
import {
  CellSelection,
  CellSelectionListener,
  CellSelectionListenerFactory,
  CellSelectionRanges,
  CellSelectionScroller,
  FitKeyboardEvent,
  FitMouseEvent,
  NeighborCells,
  ScrollDirection,
  FitHtmlElement,
} from 'fittable-core/view-model';

import { getCellCoord } from '../model/common/fit-html-attributes.js';

type ActionKey = 'Enter' | 'ArrowLeft' | 'ArrowUp' | 'ArrowRight' | 'ArrowDown';

export class FitCellSelectionListener implements CellSelectionListener {
  private selectionRanges: CellSelectionRanges;
  private selectedCell?: CellCoord;
  private isMouseDown = false;
  private isMouseEnter = false;

  constructor(
    private readonly cellSelection: CellSelection,
    private readonly cellSelectionScroller?: CellSelectionScroller
  ) {
    this.selectionRanges = cellSelection.body;
  }

  public setCellSelectionRanges(ranges: CellSelectionRanges): this {
    this.selectionRanges = ranges;
    return this;
  }

  public onMouseDown(event: FitMouseEvent): void {
    event.preventDefault();
    if (!this.selectionRanges.hasFocus()) {
      this.selectionRanges.setFocus(true);
      if (event.shiftKey) return;
    }
    const cellCoord: CellCoord = getCellCoord(event.target as FitHtmlElement);
    if (event.button !== 0 && this.selectionRanges.hasCell(cellCoord)) return;
    if (event.shiftKey) {
      this.selectionRanges.removePreviousRanges();
    } else {
      !event.metaKey && !event.ctrlKey && this.cellSelection.clear();
      this.selectionRanges.createRange();
    }
    this.selectionRanges.addCell(cellCoord);
    this.selectedCell = cellCoord;
    this.isMouseDown = true;
  }

  public onMouseMove(event: FitMouseEvent): void {
    event.preventDefault();
    if (!this.selectionRanges.hasFocus()) {
      this.isMouseDown && this.endSelection();
      return;
    }
    if (!this.isMouseDown) return;
    const cellCoord: CellCoord = getCellCoord(event.target as FitHtmlElement);
    if (cellCoord.equals(this.selectedCell)) return;
    this.selectionRanges.getRanges().length <= 0 &&
      this.selectionRanges.createRange();
    this.selectionRanges.addCell(cellCoord);
    this.selectedCell = cellCoord;
  }

  public onMouseEnter(): void {
    this.isMouseEnter = true;
  }

  public onMouseLeave(): void {
    this.isMouseEnter = false;
  }

  public onGlobalMouseDown(): void {
    !this.isMouseEnter &&
      this.selectionRanges.hasFocus() &&
      this.selectionRanges.setFocus(false);
  }

  public onGlobalMouseUp(event?: MouseEvent): void {
    if (this.selectionRanges.hasFocus()) {
      this.isMouseDown && this.endSelection();
    } else {
      event?.button !== 0 && this.isMouseDown && this.endSelection();
    }
  }

  public onGlobalKeyDown(event: FitKeyboardEvent): void {
    if (!this.selectionRanges.hasFocus()) return;
    if (event.ctrlKey || event.metaKey) return;
    this.selectNextCell(event);
  }

  private selectNextCell(event: FitKeyboardEvent): void {
    const activeCell: CellCoord | undefined = this.getActiveCell(event);
    if (!activeCell) return;
    const nextCell: CellCoord | undefined = this.getNextCell(event, activeCell);
    if (!nextCell) return;
    this.scrollIfLastVisibleLine(activeCell, event);
    if (!event.shiftKey) {
      this.cellSelection.clear();
      this.selectionRanges.createRange();
    }
    this.selectionRanges.addCell(nextCell);
    !event.shiftKey && this.endSelection();
  }

  private getActiveCell(event: FitKeyboardEvent): CellCoord | undefined {
    let cell: CellCoord | undefined = this.selectionRanges.getFirstCell();
    if (event.shiftKey) cell = this.selectionRanges.getLastCell() ?? cell;
    return cell;
  }

  private scrollIfLastVisibleLine(
    activeCell: CellCoord,
    event: FitKeyboardEvent
  ): void {
    let direction: ScrollDirection | undefined;
    const key: ActionKey = event.key as ActionKey;
    if (key === 'Enter' || key === 'ArrowDown') direction = 'Down';
    else if (key === 'ArrowRight') direction = 'Right';
    else if (key === 'ArrowUp') direction = 'Up';
    else if (key === 'ArrowLeft') direction = 'Left';
    if (!direction) return;
    event.preventDefault();
    this.cellSelectionScroller
      ?.setRowId(activeCell.getRowId())
      .setColId(activeCell.getColId())
      .setScrollDirection(direction)
      .scroll();
  }

  private getNextCell(
    event: FitKeyboardEvent,
    activeCell: CellCoord
  ): CellCoord | undefined {
    let nextCell: CellCoord | undefined;
    const key: ActionKey = event.key as ActionKey;
    const neighborCells: NeighborCells = this.selectionRanges
      .getNeighborCells()
      .setCell(activeCell);
    if (key === 'Enter' || key === 'ArrowDown') {
      nextCell = neighborCells.getBottomCell();
    } else if (key === 'ArrowRight') {
      nextCell = neighborCells.getRightCell();
    } else if (key === 'ArrowLeft') {
      nextCell = neighborCells.getLeftCell();
    } else if (key === 'ArrowUp') {
      nextCell = neighborCells.getTopCell();
    }
    return nextCell;
  }

  private endSelection(): void {
    this.selectionRanges.end();
    this.selectedCell = undefined;
    this.isMouseDown = false;
  }
}

export class FitCellSelectionListenerFactory
  implements CellSelectionListenerFactory
{
  public createCellSelectionListener(
    cellSelection: CellSelection,
    cellSelectionScroller: CellSelectionScroller
  ): CellSelectionListener {
    return new FitCellSelectionListener(cellSelection, cellSelectionScroller);
  }
}

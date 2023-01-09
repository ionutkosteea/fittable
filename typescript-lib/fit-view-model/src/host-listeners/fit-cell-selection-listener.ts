import { CellCoord } from 'fit-core/model/index.js';
import {
  CellSelection,
  CellSelectionRanges,
  CellSelectionListener,
  CellSelectionListenerFactory,
  CellSelectionScroller,
  ScrollDirection,
  NeighborCells,
  FitMouseEvent,
  FitKeyboardEvent,
} from 'fit-core/view-model/index.js';

type ActionKey = 'Enter' | 'ArrowLeft' | 'ArrowUp' | 'ArrowRight' | 'ArrowDown';

export class FitCellSelectionListener implements CellSelectionListener {
  private selectionRanges: CellSelectionRanges;
  private selectedCell?: CellCoord;
  private isCtrlKeyDown = false;
  private isShiftKeyDown = false;
  private isMouseDown = false;

  constructor(
    private readonly cellSelection: CellSelection,
    private readonly cellSelectionScroller?: CellSelectionScroller
  ) {
    this.selectionRanges = cellSelection.body;
    this.selectionRanges.setFocus(true);
  }

  public setCellSelectionRanges(ranges: CellSelectionRanges): this {
    this.selectionRanges = ranges;
    return this;
  }

  public onMouseDown(cellCoord: CellCoord, event?: FitMouseEvent): void {
    event?.preventDefault();
    if (!this.selectionRanges.hasFocus()) {
      this.selectionRanges.setFocus(true);
      if (this.isShiftKeyDown) return;
    }
    if (event?.button !== 0 && this.selectionRanges.hasCell(cellCoord)) return;
    if (this.isShiftKeyDown) {
      this.selectionRanges.removePreviousRanges();
    } else {
      !this.isCtrlKeyDown && this.cellSelection.clear();
      this.selectionRanges.createRange();
    }
    this.selectionRanges.addCell(cellCoord);
    this.selectedCell = cellCoord;
    this.isMouseDown = true;
  }

  public onMouseMove(cellCoord: CellCoord, event?: FitMouseEvent): void {
    event?.preventDefault();
    if (!this.isMouseDown) return;
    if (cellCoord.equals(this.selectedCell)) return;
    this.selectionRanges.addCell(cellCoord);
    this.selectedCell = cellCoord;
  }

  public onGlobalMouseUp(): void {
    if (!this.isMouseDown) return;
    this.endSelection();
    this.isMouseDown = false;
  }

  private endSelection(): void {
    this.selectionRanges.end();
    this.selectedCell = undefined;
  }

  public onGlobalKeyDown(event: FitKeyboardEvent): void {
    this.isCtrlKeyDown = event.metaKey;
    this.isShiftKeyDown = event.shiftKey;
    if (!this.selectionRanges.hasFocus()) return;
    if ((event.key as ActionKey) === 'Enter' && event.ctrlKey) return;
    this.selectNextCell(event);
  }

  private selectNextCell(event: FitKeyboardEvent): void {
    const activeCell: CellCoord | undefined = this.getActiveCell();
    if (!activeCell) return;
    const nextCell: CellCoord | undefined = this.getNextCell(event, activeCell);
    if (!nextCell) return;
    this.scrollIfLastVisibleLine(activeCell, event);
    if (!this.isShiftKeyDown) {
      this.cellSelection.clear();
      this.selectionRanges.createRange();
    }
    this.selectionRanges.addCell(nextCell);
    !this.isShiftKeyDown && this.endSelection();
  }

  private getActiveCell(): CellCoord | undefined {
    let cell: CellCoord | undefined = this.selectionRanges.getFirstCell();
    if (this.isShiftKeyDown) cell = this.selectionRanges.getLastCell() ?? cell;
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

  public onGlobalKeyUp(): void {
    this.isCtrlKeyDown = false;
    this.isShiftKeyDown = false;
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

import { FitOptionsControl } from '../common/controls/fit-options-control.js';
import { VirtualScrollbar } from '../scroll-container/fit-scrollbar.js';
import { FitColFiltersControlId } from './fit-col-filters.js';

const FIT_CHECK_BOX_HEIGHT = 20;

export class ColValueScrollbar extends VirtualScrollbar {
  constructor(
    private readonly popUpButton: FitOptionsControl<FitColFiltersControlId>
  ) {
    super();
  }

  protected getNumberOfLines(): number {
    const container: FitOptionsControl<string> = this.popUpButton
      .getWindow()
      .getControl('value-check-list') as FitOptionsControl<string>;
    return container.getWindow().getControlIds().length;
  }

  protected getDimension(): number {
    return FIT_CHECK_BOX_HEIGHT * this.getNumberOfLines();
  }

  protected getLineDimension(): number {
    return FIT_CHECK_BOX_HEIGHT;
  }

  protected getLinePosition(lineId: number): number {
    return this.getLineDimension() * lineId;
  }

  protected isHiddenLine(): boolean {
    return false;
  }
}

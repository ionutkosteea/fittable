import { FitPopupControl } from '../common/controls/fit-popup-control.js';
import { VirtualScrollbar } from '../scroll-container/fit-scrollbar.js';
import { FitColFiltersControlId } from './fit-col-filters.js';

const FIT_CHECK_BOX_HEIGHT = 20;

export class ColValueScrollbar extends VirtualScrollbar {
  constructor(
    private readonly popupButton: FitPopupControl<FitColFiltersControlId>
  ) {
    super();
  }

  protected getNumberOfLines(): number {
    const container: FitPopupControl<string> = this.popupButton
      .getWindow()
      .getControl('value-check-list') as FitPopupControl<string>;
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

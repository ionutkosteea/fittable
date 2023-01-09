import { Component, Input } from '@angular/core';

import { CssStyle } from 'fit-core/model';
import {
  ViewModel,
  Rectangle,
  HostListeners,
  CellSelectionRanges,
} from 'fit-core/view-model';

import { TableCommon } from '../common/table-common.model';

@Component({
  selector: 'fit-table-left-top-corner',
  templateUrl: './table-left-top-corner.component.html',
  styleUrls: [
    '../common/css/table-common.css',
    './table-left-top-corner.component.css',
  ],
})
export class TableLeftTopCornerComponent extends TableCommon {
  @Input() viewModel!: ViewModel;
  @Input() hostListeners!: HostListeners;

  public getContainerPosition(): CssStyle {
    const left: number = this.getScrollLeft();
    const top: number = this.getScrollTop();
    return { transform: 'translate3d(' + left + 'px,' + top + 'px,0px)' };
  }

  public readonly getCellSelectionRanges = ():
    | CellSelectionRanges
    | undefined => this.viewModel.cellSelection?.pageHeader;

  public getCellSelectionStyle(): CssStyle[] {
    const styles: CssStyle[] = [];
    this.viewModel.cellSelectionPainter?.pageHeader
      ?.getRectangles()
      .forEach((rect: Rectangle): void => {
        const left: number = rect.left + this.getScrollLeft();
        const top: number = rect.top + this.getScrollTop();
        styles.push({
          transform: 'translate3d(' + left + 'px,' + top + 'px,0px)',
          width: rect.width + 'px',
          height: rect.height + 'px',
        });
      });
    return styles;
  }
}

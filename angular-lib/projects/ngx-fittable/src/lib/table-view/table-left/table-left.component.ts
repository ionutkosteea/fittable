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
  selector: 'fit-table-left',
  templateUrl: './table-left.component.html',
  styleUrls: ['../common/css/table-common.css', './table-left.component.css'],
})
export class TableLeftComponent extends TableCommon {
  @Input() viewModel!: ViewModel;
  @Input() hostListeners!: HostListeners;

  public getContainerPosition(): CssStyle {
    const left: number = this.getScrollLeft();
    const top: number = this.getColumnHeaderHeight() + this.getOffsetY();
    return { transform: 'translate3d(' + left + 'px,' + top + 'px,0px)' };
  }

  public readonly getCellSelectionRanges = ():
    | CellSelectionRanges
    | undefined => this.viewModel.cellSelection?.rowHeader;

  public getCellSelectionStyle(): CssStyle[] {
    const styles: CssStyle[] = [];
    this.viewModel.cellSelectionPainter?.rowHeader
      ?.getRectangles()
      .forEach((rect: Rectangle): void => {
        const left: number = rect.left + this.getScrollLeft();
        styles.push({
          transform: 'translate3d(' + left + 'px,' + rect.top + 'px,0px)',
          width: rect.width + 'px',
          height: rect.height + 'px',
        });
      });
    return styles;
  }
}

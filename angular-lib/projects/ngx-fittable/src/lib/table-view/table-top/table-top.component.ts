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
  selector: 'fit-table-top',
  templateUrl: './table-top.component.html',
  styleUrls: ['../common/css/table-common.css', './table-top.component.css'],
})
export class TableTopComponent extends TableCommon {
  @Input() viewModel!: ViewModel;
  @Input() hostListeners!: HostListeners;

  public getContainerPosition(): CssStyle {
    const left: number = this.getRowHeaderWidth() + this.getOffsetX();
    const top: number = this.getScrollTop();
    return { transform: 'translate3d(' + left + 'px,' + top + 'px,0px)' };
  }

  public readonly getCellSelectionRanges = ():
    | CellSelectionRanges
    | undefined => this.viewModel.cellSelection?.columnHeader;

  public getCellSelectionStyle(): CssStyle[] {
    const styles: CssStyle[] = [];
    this.viewModel.cellSelectionPainter?.columnHeader
      ?.getRectangles()
      .forEach((rect: Rectangle): void => {
        const top: number = rect.top + this.getScrollTop();
        styles.push({
          transform: 'translate3d(' + rect.left + 'px,' + top + 'px,0px)',
          width: rect.width + 'px',
          height: rect.height + 'px',
        });
      });
    return styles;
  }
}

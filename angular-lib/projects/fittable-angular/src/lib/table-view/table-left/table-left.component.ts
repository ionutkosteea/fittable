import { Component, ElementRef, Input, ViewChild } from '@angular/core';

import { CssStyle } from 'fittable-core/model';
import {
  ViewModel,
  CellSelectionRanges,
  CellSelectionListener,
} from 'fittable-core/view-model';

import { TableCommon } from '../common/table-common.model';

@Component({
  selector: 'fit-table-left',
  templateUrl: './table-left.component.html',
  styleUrls: [
    '../common/scss/table.scss',
    '../common/scss/table-header.scss',
    './table-left.component.scss',
  ],
})
export class TableLeftComponent extends TableCommon {
  @Input({ required: true }) override viewModel!: ViewModel;
  @Input() cellSelectionListener?: CellSelectionListener;
  @ViewChild('scroller') scrollerRef?: ElementRef;

  getCellSelectionRanges(): CellSelectionRanges | undefined {
    return this.viewModel.cellSelection?.rowHeader;
  }

  getCellSelectionRectangles(): CssStyle[] {
    return this.viewModel.mobileLayout.rowHeaderSelectionRectangles;
  }
}

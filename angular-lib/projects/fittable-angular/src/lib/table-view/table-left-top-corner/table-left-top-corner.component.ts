import { Component, Input } from '@angular/core';

import { CssStyle } from 'fittable-core/model';
import {
  ViewModel,
  CellSelectionRanges,
  CellSelectionListener,
} from 'fittable-core/view-model';

import { TableCommon } from '../common/table-common.model';

@Component({
  selector: 'fit-table-left-top-corner',
  templateUrl: './table-left-top-corner.component.html',
  styleUrls: [
    '../common/scss/table.scss',
    '../common/scss/table-header.scss',
    './table-left-top-corner.component.scss',
  ],
})
export class TableLeftTopCornerComponent extends TableCommon {
  @Input({ required: true }) override viewModel!: ViewModel;
  @Input() cellSelectionListener?: CellSelectionListener;

  getCellSelectionRanges(): CellSelectionRanges | undefined {
    return this.viewModel.cellSelection?.pageHeader;
  }

  getCellSelectionRectangles(): CssStyle[] {
    return this.viewModel.mobileLayout.pageHeaderSelectionRectangles;
  }
}

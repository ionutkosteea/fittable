import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CssStyle } from 'fittable-core/model';
import {
  ViewModel,
  CellSelectionRanges,
  CellSelectionListener,
} from 'fittable-core/view-model';

import { TableCommon } from '../common/table-common.model';
import { CellSelectionDirective } from '../common/cell-selection.directive';

@Component({
  selector: 'fit-table-left-top-corner',
  standalone: true,
  imports: [CommonModule, CellSelectionDirective],
  templateUrl: './table-left-top-corner.component.html',
  styleUrls: [
    '../common/scss/table.scss',
    '../common/scss/table-header.scss',
    './table-left-top-corner.component.scss',
  ],
})
export class TableLeftTopCornerComponent extends TableCommon {
  viewModel = input.required<ViewModel>();
  cellSelectionListener = input<CellSelectionListener>();

  get cellSelectionRanges(): CellSelectionRanges | undefined {
    return this.viewModel().cellSelection?.pageHeader;
  }

  get cellSelectionRectangles(): CssStyle[] {
    return this.viewModel().mobileLayout.pageHeaderSelectionRectangles;
  }
}

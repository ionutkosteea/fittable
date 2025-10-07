import { Component, ElementRef, ViewChild, input } from '@angular/core';
import { NgStyle } from '@angular/common';

import { CssStyle } from 'fittable-core/model';
import {
  ViewModel,
  CellSelectionRanges,
  CellSelectionListener,
} from 'fittable-core/view-model';

import { TableCommon } from '../common/table-common.model';
import { CellSelectionDirective } from '../common/cell-selection.directive';

@Component({
  selector: 'fit-table-left',
  standalone: true,
  imports: [NgStyle, CellSelectionDirective],
  templateUrl: './table-left.component.html',
  styleUrls: [
    '../common/scss/table.scss',
    '../common/scss/table-header.scss',
    './table-left.component.scss',
  ],
})
export class TableLeftComponent extends TableCommon {
  override viewModel = input.required<ViewModel>();
  cellSelectionListener = input<CellSelectionListener>();

  @ViewChild('scroller') scrollerRef?: ElementRef;

  get cellSelectionRanges(): CellSelectionRanges | undefined {
    return this.viewModel().cellSelection?.rowHeader;
  }

  get cellSelectionRectangles(): CssStyle[] {
    return this.viewModel().mobileLayout.rowHeaderSelectionRectangles;
  }
}

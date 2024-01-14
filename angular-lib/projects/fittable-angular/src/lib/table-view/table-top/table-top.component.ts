import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { NgFor, NgIf, NgStyle } from '@angular/common';

import { CssStyle, getModelConfig } from 'fittable-core/model';
import {
  ViewModel,
  CellSelectionRanges,
  ColFilters,
  CellSelectionListener,
} from 'fittable-core/view-model';

import { TableCommon } from '../common/table-common.model';
import { CellSelectionDirective } from '../common/cell-selection.directive';
import {
  FilterPopupButtonComponent,
  FilterPopupWindowComponent,
} from '../../controls-view/filter-popup/filter-popup.component';

@Component({
  selector: 'fit-table-top',
  standalone: true,
  imports: [
    NgStyle,
    NgFor,
    NgIf,
    CellSelectionDirective,
    FilterPopupButtonComponent,
    FilterPopupWindowComponent,
  ],
  templateUrl: './table-top.component.html',
  styleUrls: [
    '../common/scss/table.scss',
    '../common/scss/table-header.scss',
    './table-top.component.scss',
  ],
})
export class TableTopComponent extends TableCommon {
  @Input({ required: true }) override viewModel!: ViewModel;
  @Input() cellSelectionListener?: CellSelectionListener;
  @ViewChild('scroller') scrollerRef?: ElementRef;

  getCellSelectionRanges(): CellSelectionRanges | undefined {
    return this.viewModel.cellSelection?.colHeader;
  }

  getCellSelectionRectangles(): CssStyle[] {
    return this.viewModel.mobileLayout.colHeaderSelectionRectangles;
  }

  hasColFilters(): boolean {
    return (
      getModelConfig().colFilterExecutorFactory !== undefined &&
      this.viewModel.colFilters !== undefined
    );
  }

  getColFilters(): ColFilters {
    if (this.viewModel.colFilters) return this.viewModel.colFilters;
    else throw new Error('Column filters are not defined!');
  }
}

import { Component, ElementRef, Input, ViewChild } from '@angular/core';

import { CssStyle, getModelConfig } from 'fittable-core/model';
import {
  ViewModel,
  CellSelectionRanges,
  ColFilters,
  CellSelectionListener,
} from 'fittable-core/view-model';

import { TableCommon } from '../common/table-common.model';

@Component({
  selector: 'fit-table-top',
  templateUrl: './table-top.component.html',
})
export class TableTopComponent extends TableCommon {
  @Input() override viewModel!: ViewModel;
  @Input() cellSelectionListener?: CellSelectionListener;
  @ViewChild('scroller') scrollerRef?: ElementRef;

  public readonly getCellSelectionRanges = ():
    | CellSelectionRanges
    | undefined => this.viewModel.cellSelection?.colHeader;

  public readonly getCellSelectionRectangles = (): CssStyle[] =>
    this.viewModel.mobileLayout.colHeaderSelectionRectangles;

  public readonly hasColFilters = (): boolean =>
    getModelConfig().colFilterExecutorFactory !== undefined &&
    this.viewModel.colFilters !== undefined;

  public readonly getColFilters = (): ColFilters => {
    if (this.viewModel.colFilters) return this.viewModel.colFilters;
    else throw new Error('Column filters are not defined!');
  };
}

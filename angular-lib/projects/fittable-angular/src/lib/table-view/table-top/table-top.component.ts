import { Component, Input } from '@angular/core';

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
  styleUrls: ['../common/css/table-common.css', './table-top.component.css'],
})
export class TableTopComponent extends TableCommon {
  @Input() override viewModel!: ViewModel;
  @Input() cellSelectionListener?: CellSelectionListener;

  public readonly getTableOffset = (): CssStyle =>
    this.viewModel.mobileLayout.colHeaderOffset;

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

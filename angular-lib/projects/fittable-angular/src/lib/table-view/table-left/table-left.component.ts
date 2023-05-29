import { Component, Input } from '@angular/core';

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
  styleUrls: ['../common/css/table-common.css', './table-left.component.css'],
})
export class TableLeftComponent extends TableCommon {
  @Input() override viewModel!: ViewModel;
  @Input() cellSelectionListener?: CellSelectionListener;

  public readonly getTableOffset = (): CssStyle =>
    this.viewModel.mobileLayout.rowHeaderOffset;

  public readonly getCellSelectionRanges = ():
    | CellSelectionRanges
    | undefined => this.viewModel.cellSelection?.rowHeader;

  public readonly getCellSelectionRectangles = (): CssStyle[] =>
    this.viewModel.mobileLayout.rowHeaderSelectionRectangles;
}

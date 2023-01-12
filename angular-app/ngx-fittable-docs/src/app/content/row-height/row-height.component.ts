import { Component, OnInit } from '@angular/core';

import { createRow, createTable } from 'fit-core/model';
import {
  createFittableViewer,
  FittableViewer,
  registerViewModelConfig,
} from 'fit-core/view-model';
import { FitRow, FitTable } from 'fit-model';
import { createFitViewModelConfig } from 'fit-view-model';
import { ContentTitle } from 'src/app/common/content-title.model';

@Component({
  selector: 'row-height',
  templateUrl: '../common/content-01.html',
  styleUrls: ['../common/content-01.css', '../common/common.css'],
})
export class RowHeightComponent implements OnInit {
  public readonly title: ContentTitle = 'Row height';
  public fit!: FittableViewer;

  public ngOnInit(): void {
    registerViewModelConfig(
      createFitViewModelConfig({
        rowHeight: 10, //default 21
      })
    );
    this.fit = createFittableViewer(
      createTable<FitTable>(5, 5).addRow(1, createRow<FitRow>().setHeight(42))
    );
  }
}

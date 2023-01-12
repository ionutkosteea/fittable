import { Component, OnInit } from '@angular/core';

import { createColumn, createTable } from 'fit-core/model';
import {
  createFittableViewer,
  FittableViewer,
  registerViewModelConfig,
} from 'fit-core/view-model';
import { FitColumn, FitTable } from 'fit-model';
import { createFitViewModelConfig } from 'fit-view-model';
import { ContentTitle } from 'src/app/common/content-title.model';

@Component({
  selector: 'column-width',
  templateUrl: '../common/content-01.html',
  styleUrls: ['../common/content-01.css', '../common/common.css'],
})
export class ColumnWidthtComponent implements OnInit {
  public readonly title: ContentTitle = 'Column width';
  public fit!: FittableViewer;

  public ngOnInit(): void {
    registerViewModelConfig(
      createFitViewModelConfig({
        columnWidth: 50, //default 100
      })
    );
    this.fit = createFittableViewer(
      createTable<FitTable>(5, 5) //
        .addColumn(1, createColumn<FitColumn>().setWidth(200))
    );
  }
}

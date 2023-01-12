import { Component, OnInit } from '@angular/core';

import { createRowHeader, createTable } from 'fit-core/model';
import {
  createFittableViewer,
  FittableViewer,
  registerViewModelConfig,
} from 'fit-core/view-model';
import { FitTable, FitRowHeader } from 'fit-model';
import { createFitViewModelConfig } from 'fit-view-model';
import { ContentTitle } from 'src/app/common/content-title.model';

@Component({
  selector: 'row-header',
  templateUrl: '../common/content-01.html',
  styleUrls: ['../common/content-01.css', '../common/common.css'],
})
export class RowHeaderComponent implements OnInit {
  public readonly title: ContentTitle = 'Row header';
  public fit!: FittableViewer;

  public ngOnInit(): void {
    registerViewModelConfig(
      createFitViewModelConfig({
        rowHeader: true,
        rowHeaderColumnWidth: 80, // default 40
      })
    );
    this.fit = createFittableViewer(
      createTable<FitTable>(5, 5).setRowHeader(createRowHeader<FitRowHeader>(1))
    );
  }
}

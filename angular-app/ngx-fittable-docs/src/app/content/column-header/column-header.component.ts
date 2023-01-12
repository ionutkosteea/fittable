import { Component, OnInit } from '@angular/core';

import { createColumnHeader, createTable } from 'fit-core/model';
import {
  createFittableViewer,
  FittableViewer,
  registerViewModelConfig,
} from 'fit-core/view-model';
import { FitTable, FitColumnHeader } from 'fit-model';
import { createFitViewModelConfig } from 'fit-view-model';
import { ContentTitle } from 'src/app/common/content-title.model';

@Component({
  selector: 'column-header',
  templateUrl: '../common/content-01.html',
  styleUrls: ['../common/content-01.css', '../common/common.css'],
})
export class ColumnHeaderComponent implements OnInit {
  public readonly title: ContentTitle = 'Column header';
  public fit!: FittableViewer;

  public ngOnInit(): void {
    registerViewModelConfig(
      createFitViewModelConfig({
        columnHeader: true,
        columnHeaderRowHeight: 42, // default 21
      })
    );
    this.fit = createFittableViewer(
      createTable<FitTable>(5, 5).setColumnHeader(
        createColumnHeader<FitColumnHeader>(1)
      )
    );
  }
}

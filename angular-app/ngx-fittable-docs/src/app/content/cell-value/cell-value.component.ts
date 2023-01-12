import { Component, OnInit } from '@angular/core';

import { createCell, createTable, Table } from 'fit-core/model';
import {
  createFittableViewer,
  FittableViewer,
  registerViewModelConfig,
} from 'fit-core/view-model';
import { FitCell, FitTable } from 'fit-model';
import { createFitViewModelConfig } from 'fit-view-model';
import { ContentTitle } from 'src/app/common/content-title.model';

@Component({
  selector: 'cell-value',
  templateUrl: '../common/content-01.html',
  styleUrls: ['../common/content-01.css', '../common/common.css'],
})
export class CellValueComponent implements OnInit {
  public readonly title: ContentTitle = 'Cell value';
  public fit!: FittableViewer;

  public ngOnInit(): void {
    registerViewModelConfig(
      createFitViewModelConfig({ cellEditor: true, toolbar: true })
    );
    const shortText = 'Short text';
    const longText = 'Long text spreads on multiple lines';
    const multipleLineText = 'Line1\nLine2\nLine3';
    this.fit = createFittableViewer(
      createTable<FitTable>(5, 5) //
        .addCell(1, 1, createCell<FitCell>().setValue(shortText))
        .addCell(2, 1, createCell<FitCell>().setValue(longText))
        .addCell(3, 1, createCell<FitCell>().setValue(multipleLineText))
    );
  }
}

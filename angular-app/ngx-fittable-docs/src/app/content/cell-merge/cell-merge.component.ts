import { Component, OnInit } from '@angular/core';

import {
  createCell,
  createCellCoord,
  createMergedRegions,
  createTable,
} from 'fit-core/model';
import {
  createFittableViewer,
  FittableViewer,
  registerViewModelConfig,
} from 'fit-core/view-model';
import { FitCell, FitMergedRegions, FitTable } from 'fit-model';
import { createFitViewModelConfig } from 'fit-view-model';
import { ContentTitle } from 'src/app/common/content-title.model';

@Component({
  selector: 'cell-merge',
  templateUrl: '../common/content-01.html',
  styleUrls: ['../common/content-01.css', '../common/common.css'],
})
export class CellMergeComponent implements OnInit {
  public readonly title: ContentTitle = 'Cell merge';
  public fit!: FittableViewer;

  public ngOnInit(): void {
    registerViewModelConfig(
      createFitViewModelConfig({ cellSelection: true, contextMenu: true })
    );
    this.fit = createFittableViewer(
      createTable<FitTable>(5, 5)
        .addCell(1, 1, createCell<FitCell>().setValue('Merged cell text'))
        .setMergedRegions(
          createMergedRegions<FitMergedRegions>() //
            .addRegion(createCellCoord(1, 1), createCellCoord(2, 2))
        )
    );
  }
}

import { Component, OnInit } from '@angular/core';

import { createCell, createStyle, createTable } from 'fit-core/model';
import {
  createFittableViewer,
  FittableViewer,
  registerViewModelConfig,
} from 'fit-core/view-model';
import { FitCell, FitStyle, FitTable } from 'fit-model';
import { createFitViewModelConfig } from 'fit-view-model';
import { ContentTitle } from 'src/app/common/content-title.model';

@Component({
  selector: 'cell-style',
  templateUrl: '../common/content-01.html',
  styleUrls: ['../common/content-01.css', '../common/common.css'],
})
export class CellStyleComponent implements OnInit {
  public readonly title: ContentTitle = 'Cell style';
  public fit!: FittableViewer;

  public ngOnInit(): void {
    registerViewModelConfig(
      createFitViewModelConfig({ cellSelection: true, toolbar: true })
    );
    this.fit = createFittableViewer(
      createTable<FitTable>(5, 5) //
        .addStyle(
          's01',
          createStyle<FitStyle>()
            .set('font-weight', 'bold')
            .set('font-style', 'italic')
            .set('text-decoration', 'underline')
            .set('font-family', 'Fantasy')
            .set('font-size.px', 16)
            .set('color', 'red')
            .set('background-color', 'lightyellow')
            .set('place-items', 'center normal')
            .set('text-align', 'center')
            .set('border-left', '1px solid red')
            .set('border-top', '1px solid green')
            .set('border-right', '1px solid blue')
            .set('border-bottom', '1px solid gray')
        )
        .addCell(
          1,
          1,
          createCell<FitCell>().setStyleName('s01').setValue('Styled text')
        )
    );
  }
}

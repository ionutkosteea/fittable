import { Component, OnInit } from '@angular/core';

import {
  createCell,
  createStyle,
  createTable,
  registerModelConfig,
} from 'fit-core/model';
import { registerOperationConfig } from 'fit-core/operations';
import {
  createFittableDesigner,
  FittableDesigner,
  registerViewModelConfig,
} from 'fit-core/view-model';
import { FitCell, FitStyle, FitTable, FIT_MODEL_CONFIG } from 'fit-model';
import { FIT_OPERATION_CONFIG } from 'fit-model-operations';
import { createFitViewModelConfig } from 'fit-view-model';

import { CodeSnippet } from '../common/code-snippet.model';
import { TopicTitle } from '../../common/topic-title.model';
import { SimpleTopic } from '../common/simple-topic.model';

@Component({
  selector: 'cell-style',
  templateUrl: '../common/simple-topic.html',
  styleUrls: ['../common/simple-topic.css', '../common/common.css'],
})
export class CellStyleComponent implements SimpleTopic, OnInit {
  public readonly title: TopicTitle = 'Cell style';
  public readonly htmlCode: CodeSnippet[] = [
    { image: 'fittable-component-html.jpg' },
  ];
  public readonly typescriptCode: CodeSnippet[] = [
    { image: 'cell-style-ts.jpg' },
  ];
  public fit!: FittableDesigner;

  public ngOnInit(): void {
    // The register functions should be called, in most cases, from the Angular main module.
    registerModelConfig(FIT_MODEL_CONFIG);
    registerOperationConfig(FIT_OPERATION_CONFIG);
    registerViewModelConfig(
      createFitViewModelConfig({ cellSelection: true, toolbar: true })
    );

    this.fit = createFittableDesigner(
      createTable<FitTable>(5, 5)
        .addStyle(
          's01',
          createStyle<FitStyle>()
            .set('font-weight', 'bold')
            .set('font-style', 'italic')
            .set('text-decoration', 'underline')
            .set('font-family', 'sans-serif')
            .set('font-size.px', 16)
            .set('color', 'red')
            .set('background-color', 'lightyellow')
            .set('place-items', 'center normal')
            .set('text-align', 'center')
            .set('border-left', '2px solid red')
            .set('border-top', '2px solid green')
            .set('border-right', '2px solid blue')
            .set('border-bottom', '2px solid gray')
        )
        .addCell(
          1,
          1,
          createCell<FitCell>().setStyleName('s01').setValue('Styled text')
        )
    );
  }
}

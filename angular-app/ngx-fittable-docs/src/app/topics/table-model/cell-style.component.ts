import { Component, OnInit } from '@angular/core';

import {
  createStyle,
  createTable,
  registerModelConfig,
} from 'fittable-core/model';
import { registerOperationConfig } from 'fittable-core/operations';
import {
  createFittableDesigner,
  FittableDesigner,
  registerViewModelConfig,
} from 'fittable-core/view-model';
import { FitStyle, FitTable, FIT_MODEL_CONFIG } from 'fittable-model';
import { FIT_OPERATION_CONFIG } from 'fittable-model-operations';
import { createFitViewModelConfig } from 'fittable-view-model';

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
      createTable<FitTable>() // FitTable default: 5 rows, 5 cols
        .addStyle(
          's0',
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
        .setCellValue(0, 0, 'Styled text')
        .setCellStyleName(0, 0, 's0')
    );
  }
}

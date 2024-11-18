import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';

import { createTable4Dto, registerModelConfig } from 'fittable-core/model';
import { registerOperationConfig } from 'fittable-core/operations';
import {
  createTableDesigner,
  TableDesigner,
  registerViewModelConfig,
} from 'fittable-core/view-model';
import { FitTableDto, FIT_MODEL_CONFIG } from 'fittable-model';
import { FIT_OPERATION_CONFIG } from 'fittable-model-operations';
import { FIT_VIEW_MODEL_CONFIG } from 'fittable-view-model';

import { TopicTitle } from '../../common/topic-title.model';
import { CodeSnippet } from '../common/code-snippet.model';
import { ConsoleTopic } from './common/console-topic.model';

@Component({
  selector: 'table-dto',
  templateUrl: './common/console-topic.html',
  styleUrls: ['../common/common.css'],
})
export class TableDtoComponent extends ConsoleTopic implements OnInit {
  @ViewChild('console') console!: ElementRef;

  public readonly title: TopicTitle = 'Table DTO';
  public readonly htmlCode: CodeSnippet[] = [
    { image: 'fittable-component-html.jpg' },
  ];
  public readonly typescriptCode: CodeSnippet[] = [
    { image: 'table-dto-ts.jpg' },
  ];
  public override fitTableDto: FitTableDto = {
    numberOfRows: 50,
    numberOfCols: 10,
    cells: {
      1: {
        1: { value: '[1,1]' },
        2: { value: '[1,2]' },
        3: { value: '[1,3]' },
      },
      2: {
        1: { value: '[2,1]' },
        2: { value: '[2,2]' },
        3: { value: '[2,3]' },
      },
      3: {
        1: { value: '[3,1]' },
        2: { value: '[3,2]' },
        3: { value: '[3,3]' },
      },
    },
  };
  public fit!: TableDesigner;

  public ngOnInit(): void {
    registerModelConfig(FIT_MODEL_CONFIG);
    registerOperationConfig(FIT_OPERATION_CONFIG);
    registerViewModelConfig(FIT_VIEW_MODEL_CONFIG);

    this.fit = createTableDesigner(createTable4Dto(this.fitTableDto));
  }
}

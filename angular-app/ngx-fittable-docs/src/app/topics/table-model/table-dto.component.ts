import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';

import { createTable4Dto, registerModelConfig } from 'fit-core/model';
import { registerOperationConfig } from 'fit-core/operations';
import {
  createFittableDesigner,
  FittableDesigner,
  registerViewModelConfig,
} from 'fit-core/view-model';
import { FitTableDto, FIT_MODEL_CONFIG } from 'fit-model';
import { FIT_OPERATION_CONFIG } from 'fit-model-operations';
import { FIT_VIEW_MODEL_CONFIG } from 'fit-view-model';

import { TopicTitle } from '../../common/topic-title.model';
import { CodeSnippet } from '../common/code-snippet.model';
import { ConsoleTopic } from './common/console-topic.model';

let fitTableDto: FitTableDto = {
  numberOfRows: 50,
  numberOfColumns: 10,
  rows: {
    1: {
      cells: {
        1: { value: '[1,1]' },
        2: { value: '[1,2]' },
        3: { value: '[1,3]' },
      },
    },
    2: {
      cells: {
        1: { value: '[2,1]' },
        2: { value: '[2,2]' },
        3: { value: '[2,3]' },
      },
    },
    3: {
      cells: {
        1: { value: '[3,1]' },
        2: { value: '[3,2]' },
        3: { value: '[3,3]' },
      },
    },
  },
};

@Component({
  selector: 'table-dto',
  templateUrl: './common/console-topic.html',
  styleUrls: ['./common/console-topic.css', '../common/common.css'],
})
export class TableDtoComponent extends ConsoleTopic implements OnInit {
  @ViewChild('console') console!: ElementRef;

  public readonly title: TopicTitle = 'Table DTO';
  public readonly htmlCode: CodeSnippet[] = [
    { image: 'fittable-component-html.jpg' },
  ];
  public readonly typescriptCode: CodeSnippet[] = [
    { image: 'table-dto-ts-01.jpg' },
    { image: 'table-dto-ts-02.jpg' },
  ];
  public fitTableDto: FitTableDto = fitTableDto;
  public fit!: FittableDesigner;

  public ngOnInit(): void {
    // The register functions should be called, in most cases, from the Angular main module.
    registerModelConfig(FIT_MODEL_CONFIG);
    registerOperationConfig(FIT_OPERATION_CONFIG);
    registerViewModelConfig(FIT_VIEW_MODEL_CONFIG);

    this.fit = createFittableDesigner(createTable4Dto(fitTableDto));
  }
}

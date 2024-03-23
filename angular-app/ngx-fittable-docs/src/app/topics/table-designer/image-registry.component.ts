import { Component, OnDestroy, OnInit } from '@angular/core';

import { createTable, registerModelConfig } from 'fittable-core/model';
import { registerOperationConfig } from 'fittable-core/operations';
import {
  createFittableDesigner,
  FittableDesigner,
  getImageRegistry,
  registerViewModelConfig,
} from 'fittable-core/view-model';
import { FIT_MODEL_CONFIG } from 'fittable-model';
import { FIT_OPERATION_CONFIG } from 'fittable-model-operations';
import { createFitViewModelConfig, FitImageId } from 'fittable-view-model';

import { TopicTitle } from '../../common/topic-title.model';
import { CodeSnippet } from '../common/code-snippet.model';
import { Button, ConsoleTopic } from './common/console-topic.model';

@Component({
  selector: 'image-registry',
  templateUrl: './common/console-topic.html',
  styleUrls: ['../common/common.css'],
})
export class ImageRegistryComponent implements ConsoleTopic, OnInit, OnDestroy {
  public readonly title: TopicTitle = 'Image registry';
  public readonly htmlCode: CodeSnippet[] = [
    { image: 'fittable-component-html.jpg' },
  ];
  public readonly typescriptCode: CodeSnippet[] = [
    { image: 'image-registry-ts-01.jpg' },
    { image: 'image-registry-ts-02.jpg' },
    { image: 'image-registry-ts-03.jpg' },
  ];
  public readonly buttons: Button[] = [];
  public fit!: FittableDesigner;
  private defaultUndoIcon?: string;

  public ngOnInit(): void {
    // The register functions should be called, in most cases, from the Angular main module.
    registerModelConfig(FIT_MODEL_CONFIG);
    registerOperationConfig(FIT_OPERATION_CONFIG);
    registerViewModelConfig(
      createFitViewModelConfig({
        cellEditor: true,
        toolbar: true,
      }),
    );
    this.defaultUndoIcon = getImageRegistry<FitImageId>().getUrl('undo');
    getImageRegistry<FitImageId>().set('undo', this.getNewUndoIcon());

    this.fit = createFittableDesigner(createTable()); // FitTable default: 5 rows, 5 cols
  }

  private getNewUndoIcon(): string {
    return `<svg width="14" height="16" viewBox="0 0 14 16" fill="none"
xmlns="http://www.w3.org/2000/svg">
  <path
    d="M10.904 16C12.681 12.781 12.98 7.87 6 8.034V12L0 6L6 0V3.881C14.359 3.663 15.29 11.259 10.904 16Z"
    fill="#FF0000"/>
</svg>`;
  }

  public ngOnDestroy(): void {
    this.defaultUndoIcon &&
      getImageRegistry<FitImageId>().set('undo', this.defaultUndoIcon);
  }

  public getConsoleText(): string {
    return 'Undo icon: ' + getImageRegistry<FitImageId>().getUrl('undo');
  }
}

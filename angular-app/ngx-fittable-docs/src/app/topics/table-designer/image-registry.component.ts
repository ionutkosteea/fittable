import { Component, OnInit } from '@angular/core';

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
export class ImageRegistryComponent implements ConsoleTopic, OnInit {
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

  public ngOnInit(): void {
    // The register functions should be called, in most cases, from the Angular main module.
    registerModelConfig(FIT_MODEL_CONFIG);
    registerOperationConfig(FIT_OPERATION_CONFIG);
    registerViewModelConfig(
      createFitViewModelConfig({
        cellEditor: true,
        toolbar: true,
      })
    );

    this.fit = createFittableDesigner(createTable()); // FitTable default: 5 rows, 5 cols

    this.createChangeIconButton();
  }

  private createChangeIconButton(): void {
    let defaultUndoIcon: string | undefined;
    this.buttons.push({
      getLabel: (): string =>
        defaultUndoIcon ? 'Reset undo button icon' : 'Change undo button icon',
      run: (): void => {
        if (defaultUndoIcon) {
          getImageRegistry<FitImageId>().set('undo', defaultUndoIcon);
          defaultUndoIcon = undefined;
        } else {
          defaultUndoIcon = getImageRegistry<FitImageId>().getUrl('undo');
          const newUndoIcon = 'url(../../../assets/icons/undo-red.svg)';
          getImageRegistry<FitImageId>().set('undo', newUndoIcon);
        }
      },
    });
  }

  public getConsoleText(): string {
    return 'Undo icon: ' + getImageRegistry<FitImageId>().getUrl('undo');
  }
}

import { Component, OnInit } from '@angular/core';

import { createTable, registerModelConfig } from 'fit-core/model';
import { registerOperationConfig } from 'fit-core/operations';
import {
  createFittableDesigner,
  FittableDesigner,
  registerViewModelConfig,
} from 'fit-core/view-model';
import { FIT_MODEL_CONFIG } from 'fit-model';
import { FIT_OPERATION_CONFIG } from 'fit-model-operations';
import { createFitViewModelConfig, FitImageId } from 'fit-view-model';

import { TopicTitle } from '../../common/topic-title.model';
import { CodeSnippet } from '../common/code-snippet.model';
import { Button, ConsoleTopic } from './common/console-topic.model';

@Component({
  selector: 'image-registry',
  templateUrl: './common/console-topic.html',
  styleUrls: ['./common/console-topic.css', '../common/common.css'],
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

    this.fit = createFittableDesigner(createTable());

    this.createChangeIconButton();
  }

  private createChangeIconButton(): void {
    const undo: FitImageId = 'undo';
    let defaultUndoImage: string | undefined;
    this.buttons.push({
      getLabel: (): string =>
        defaultUndoImage ? 'Reset undo button icon' : 'Change undo button icon',
      run: (): void => {
        if (defaultUndoImage) {
          this.fit.viewModel.imageRegistry.setImage(undo, defaultUndoImage);
          defaultUndoImage = undefined;
        } else {
          defaultUndoImage = this.fit.viewModel.imageRegistry.getImageUrl(undo);
          const newUndoIcon = 'url(../../../assets/icons/undo-red.svg)';
          this.fit.viewModel.imageRegistry.setImage(undo, newUndoIcon);
        }
      },
    });
  }

  public getConsoleText(): string {
    const undo: FitImageId = 'undo';
    return 'Undo icon: ' + this.fit.viewModel.imageRegistry.getImageUrl(undo);
  }
}

import { Component, OnInit } from '@angular/core';

import { createTable, registerModelConfig } from 'fit-core/model';
import { registerOperationConfig } from 'fit-core/operations';
import {
  asOptionsControl,
  Container,
  Control,
  ControlMap,
  createFittableDesigner,
  FittableDesigner,
  OptionsControl,
  registerViewModelConfig,
  Window,
} from 'fit-core/view-model';
import { FIT_MODEL_CONFIG } from 'fit-model';
import { FIT_OPERATION_CONFIG } from 'fit-model-operations';
import {
  createFitViewModelConfig,
  FitControl,
  FitSettingsBarControlId,
} from 'fit-view-model';

import { CodeSnippet } from '../common/code-snippet.model';
import { TopicTitle } from '../../common/topic-title.model';
import { SimpleTopic } from '../common/simple-topic.model';

@Component({
  selector: 'settings-bar',
  templateUrl: '../common/simple-topic.html',
  styleUrls: ['../common/simple-topic.css', '../common/common.css'],
})
export class SettingsBarComponent implements SimpleTopic, OnInit {
  public readonly title: TopicTitle = 'Settings bar';
  public readonly htmlCode: CodeSnippet[] = [
    { image: 'fittable-component-html.jpg' },
  ];
  public readonly typescriptCode: CodeSnippet[] = [
    { image: 'settings-bar-ts-01.jpg' },
    { image: 'settings-bar-ts-02.jpg' },
  ];
  public fit!: FittableDesigner;

  public ngOnInit(): void {
    // The register functions should be called, in most cases, from the Angular main module.
    registerModelConfig(FIT_MODEL_CONFIG);
    registerOperationConfig(FIT_OPERATION_CONFIG);
    registerViewModelConfig(
      createFitViewModelConfig({ settingsBar: true, themeSwitcher: true })
    );

    this.fit = createFittableDesigner(createTable(5, 5));

    this.insertNewLanguageControl();
  }

  private insertNewLanguageControl(): void {
    const window: Window = this.getSettingsButtonWindow();
    const controlMap: ControlMap = {};
    const languageLabelId: FitSettingsBarControlId = 'language-label';
    for (const id of window.getControlIds()) {
      controlMap[id] = window.getControl(id);
      if (id === languageLabelId) {
        controlMap['fr-FR'] = new FitControl()
          // Usually labels should be accessed via the language dictionary.
          .setLabel((): string => 'French')
          .setRun((): void => alert('No function added!'));
      }
    }
    window.setControls(controlMap);
  }

  private getSettingsButtonWindow(): Window {
    const settingsButtonId: FitSettingsBarControlId = 'settings-button';
    const settingsBar: Container = this.fit.viewModel.settingsBar!;
    const control: Control = settingsBar.getControl(settingsButtonId);
    const options: OptionsControl | undefined = asOptionsControl(control);
    if (!options) throw new Error('Settings button has no pop-up menu.');
    return options.getWindow();
  }
}

import { Component, OnInit } from '@angular/core';

import { createTable, registerModelConfig, Table } from 'fittable-core/model';
import { registerOperationConfig } from 'fittable-core/operations';
import {
  createTableDesigner,
  TableDesigner,
  registerViewModelConfig,
  Theme,
  ThemeSwitcher,
} from 'fittable-core/view-model';
import { FIT_MODEL_CONFIG } from 'fittable-model';
import { FIT_OPERATION_CONFIG } from 'fittable-model-operations';
import {
  FitThemeName,
  FIT_VIEW_MODEL_CONFIG,
  FitCssColorVariables,
  FIT_CSS_COLOR_VARIABLES,
} from 'fittable-view-model';

import { TopicTitle } from '../../common/topic-title.model';
import { CodeSnippet } from '../common/code-snippet.model';
import { Button, ConsoleTopic } from './common/console-topic.model';

type CustomThemeName = FitThemeName | 'Lemon';

@Component({
  selector: 'theme-switcher',
  templateUrl: './common/console-topic.html',
  styleUrls: ['../common/common.css'],
})
export class ThemeSwitcherComponent implements ConsoleTopic, OnInit {
  public readonly title: TopicTitle = 'Theme switcher';
  public readonly htmlCode: CodeSnippet[] = [
    { image: 'fittable-component-html.jpg' },
  ];
  public readonly typescriptCode: CodeSnippet[] = [
    { image: 'theme-switcher-ts-01.jpg' },
    { image: 'theme-switcher-ts-02.jpg' },
    { image: 'theme-switcher-ts-03.jpg' },
    { image: 'theme-switcher-ts-04.jpg' },
  ];
  public readonly buttons: Button[] = [];
  public fit!: TableDesigner;

  public ngOnInit(): void {
    registerModelConfig(FIT_MODEL_CONFIG);
    registerOperationConfig(FIT_OPERATION_CONFIG);
    registerViewModelConfig(FIT_VIEW_MODEL_CONFIG);

    const table: Table = createTable(); // FitTable default: 5 rows, 5 cols
    table.forEachCell((rowId: number, colId: number): void => {
      table.setCellValue(rowId, colId, '[' + rowId + ',' + colId + ']');
    });
    this.fit = createTableDesigner(table);

    this.createCustomTheme();
    this.createButtons();
  }

  private createCustomTheme(): void {
    const cssVariables: FitCssColorVariables = { ...FIT_CSS_COLOR_VARIABLES };
    cssVariables['--toolbar-background-color'] = 'lightyellow';
    cssVariables['--context-menu-background-color'] = 'lightyellow';
    cssVariables['--statusbar-background-color'] = 'lightyellow';
    cssVariables['--table-header-background-color'] = 'lightyellow';
    cssVariables['--cell-selection-background-color'] =
      'rgba(255, 255, 227, 0.25)';
    const theme: Theme = { cssVariables };
    const themeName: CustomThemeName = 'Lemon';
    this.fit.viewModel.themeSwitcher
      ?.registerTheme(themeName, theme)
      .switch(themeName);
  }

  private createButtons(): void {
    this.fit.viewModel.themeSwitcher
      ?.getThemeNames()
      .forEach((themeName: string): void => {
        this.buttons.push({
          getLabel: (): string => themeName,
          run: (): void => {
            this.fit.viewModel.themeSwitcher?.switch(themeName);
          },
        });
      });
  }

  public getConsoleText(): string {
    const themeSwitcher: ThemeSwitcher | undefined =
      this.fit.viewModel.themeSwitcher;
    if (!themeSwitcher) throw new Error('Theme switcher is not defined.');
    const currentThemeName: string | undefined =
      themeSwitcher.getCurrentThemeName();
    if (!currentThemeName) throw new Error('Current theme is not defined.');
    return JSON.stringify(
      themeSwitcher.getTheme(currentThemeName)?.cssVariables,
      null,
      2,
    );
  }
}

import { Component, OnInit } from '@angular/core';

import {
  Cell,
  createCell,
  createTable,
  registerModelConfig,
  Table,
} from 'fit-core/model';
import { registerOperationConfig } from 'fit-core/operations';
import {
  createFittableDesigner,
  FittableDesigner,
  registerViewModelConfig,
  Theme,
  ThemeSwitcher,
} from 'fit-core/view-model';
import { FIT_MODEL_CONFIG } from 'fit-model';
import { FIT_OPERATION_CONFIG } from 'fit-model-operations';
import {
  FitThemeName,
  FIT_IMAGES,
  FIT_VIEW_MODEL_CONFIG,
  toSvgUrl,
} from 'fit-view-model';
import {
  FitCssColorVariables,
  FIT_CSS_COLOR_VARIABLES,
} from 'fit-view-model/model/common/css-variables';

import { TopicTitle } from '../../common/topic-title.model';
import { CodeSnippet } from '../common/code-snippet.model';
import { Button, ConsoleTopic } from './common/console-topic.model';

type CustomThemeName = FitThemeName | 'Lemon';

@Component({
  selector: 'theme-switcher',
  templateUrl: './common/console-topic.html',
  styleUrls: ['./common/console-topic.css', '../common/common.css'],
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
  public fit!: FittableDesigner;

  public ngOnInit(): void {
    // The register functions should be called, in most cases, from the Angular main module.
    registerModelConfig(FIT_MODEL_CONFIG);
    registerOperationConfig(FIT_OPERATION_CONFIG);
    registerViewModelConfig(FIT_VIEW_MODEL_CONFIG);

    const table: Table = createTable(5, 5);
    table.forEachCellCoord((rowId: number, colId: number): void => {
      const cell: Cell = createCell().setValue('[' + rowId + ',' + colId + ']');
      table.addCell(rowId, colId, cell);
    });
    this.fit = createFittableDesigner(table);

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
    const theme: Theme = { cssVariables, images: toSvgUrl(FIT_IMAGES) };
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
    const themeSwitcher: ThemeSwitcher = this.fit.viewModel.themeSwitcher!;
    const currentThemeName: string = themeSwitcher.getCurrentThemeName()!;
    return JSON.stringify(
      themeSwitcher.getTheme(currentThemeName)?.cssVariables,
      null,
      2
    );
  }
}

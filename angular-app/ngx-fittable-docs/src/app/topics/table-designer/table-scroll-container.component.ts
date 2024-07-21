import { Component, OnInit } from '@angular/core';

import { createTable, registerModelConfig, Table } from 'fittable-core/model';
import { registerOperationConfig } from 'fittable-core/operations';
import {
  createTableDesigner,
  TableDesigner,
  getViewModelConfig,
  registerViewModelConfig,
  Scrollbar,
  ScrollContainer,
  ViewModelConfig,
} from 'fittable-core/view-model';
import { FIT_MODEL_CONFIG } from 'fittable-model';
import { FIT_OPERATION_CONFIG } from 'fittable-model-operations';
import { createFitViewModelConfig } from 'fittable-view-model';

import { TopicTitle } from '../../common/topic-title.model';
import { CodeSnippet } from '../common/code-snippet.model';
import { Button, ConsoleTopic } from './common/console-topic.model';

@Component({
  selector: 'table-scroll-container',
  templateUrl: './common/console-topic.html',
  styleUrls: ['../common/common.css'],
})
export class TableScrollContainerComponent implements ConsoleTopic, OnInit {
  public readonly title: TopicTitle = 'Table scroll container';
  public readonly htmlCode: CodeSnippet[] = [
    { image: 'fittable-component-html.jpg' },
  ];
  public readonly typescriptCode: CodeSnippet[] = [
    { image: 'table-scroll-container-ts-01.jpg' },
    { image: 'table-scroll-container-ts-02.jpg' },
    { image: 'table-scroll-container-ts-03.jpg' },
    { image: 'table-scroll-container-ts-04.jpg' },
    { image: 'table-scroll-container-ts-05.jpg' },
    { image: 'table-scroll-container-ts-06.jpg' },
    { image: 'table-scroll-container-ts-07.jpg' },
    { image: 'table-scroll-container-ts-08.jpg' },
    { image: 'table-scroll-container-ts-09.jpg' },
    { image: 'table-scroll-container-ts-10.jpg' },
  ];
  public readonly buttons: Button[] = [];
  public fit!: TableDesigner;
  private virtualRowsButton?: Button;
  private virtualColsButton?: Button;
  private verticalScrollbar?: Scrollbar;
  private horizontalScrollbar?: Scrollbar;

  public ngOnInit(): void {
    registerModelConfig(FIT_MODEL_CONFIG);
    registerOperationConfig(FIT_OPERATION_CONFIG);
    registerViewModelConfig(
      createFitViewModelConfig({
        rowHeader: true,
        colHeader: true,
        cellSelection: true,
        statusbar: true,
      })
    );

    const table: Table = createTable()
      .setNumberOfRows(1000)
      .setNumberOfCols(1000);
    table.forEachCell((rowId: number, colId: number): void => {
      table.setCellValue(rowId, colId, '[' + rowId + ',' + colId + ']');
    });

    this.fit = createTableDesigner(table);

    const tableScrollContainer: ScrollContainer =
      this.fit.viewModel.tableScrollContainer;
    this.verticalScrollbar = tableScrollContainer.getVerticalScrollbar();
    this.horizontalScrollbar = tableScrollContainer.getHorizontalScrollbar();
    this.createButtons();
  }

  private createButtons(): void {
    this.virtualRowsButton = this.createVirtualRowsButton();
    this.buttons.push(this.virtualRowsButton);
    this.virtualColsButton = this.createVirtualColsButton();
    this.buttons.push(this.virtualColsButton);
    this.buttons.push(this.createScrollToTopButton());
  }

  private createVirtualRowsButton = (): Button => {
    return {
      getLabel: (): string => {
        return getViewModelConfig().disableVirtualRows
          ? 'Enable virtual rows'
          : 'Disable virtual rows';
      },
      run: (): void => {
        if (!this.virtualColsButton) throw new Error('Button is not defined.');
        const config: ViewModelConfig = getViewModelConfig();
        config.disableVirtualRows = !config.disableVirtualRows;
        const tableScrollContainer: ScrollContainer =
          this.fit.viewModel.tableScrollContainer;
        if (config.disableVirtualRows) {
          tableScrollContainer.setVerticalScrollbar();
          this.virtualColsButton.disabled = 'disabled';
        } else {
          tableScrollContainer.setVerticalScrollbar(this.verticalScrollbar);
          this.virtualColsButton.disabled = undefined;
        }
      },
    };
  };

  private createVirtualColsButton = (): Button => {
    return {
      getLabel: (): string => {
        return getViewModelConfig().disableVirtualCols
          ? 'Enable virtual columns'
          : 'Disable virtual columns';
      },
      run: (): void => {
        if (!this.virtualRowsButton) throw new Error('Button is not defined.');
        const config: ViewModelConfig = getViewModelConfig();
        config.disableVirtualCols = !config.disableVirtualCols;
        const tableScrollContainer: ScrollContainer =
          this.fit.viewModel.tableScrollContainer;
        if (config.disableVirtualCols) {
          tableScrollContainer.setHorizontalScrollbar();
          this.virtualRowsButton.disabled = 'disabled';
        } else {
          tableScrollContainer.setHorizontalScrollbar(this.horizontalScrollbar);
          this.virtualRowsButton.disabled = undefined;
        }
      },
    };
  };

  private createScrollToTopButton = (): Button => {
    return {
      getLabel: (): string => 'Scroll to top',
      run: (): void =>
        this.fit.viewModel.tableScrollContainer.getScroller().scroll(0, 0),
    };
  };

  public getConsoleText(): string {
    let consoleText = '';
    consoleText +=
      'Total number of rows: ' + this.fit.table.getNumberOfRows() + '\n';
    const firstRow: number = this.getFirstRenderableRow();
    const lastRow: number = this.getLastRenderableRow();
    consoleText += 'Rendered rows: [' + firstRow + ',' + lastRow + ']\n';
    consoleText +=
      'Total number of columns: ' + this.fit.table.getNumberOfCols() + '\n';
    const firstCol: number = this.getFirstRenderableCol();
    const lastCol: number = this.getLastRenderableCol();
    consoleText += 'Rendered columns: [' + firstCol + ',' + lastCol + ']\n';
    consoleText +=
      'Scroll left: ' +
      this.fit.viewModel.tableScrollContainer.getScroller().getLeft() +
      '\n';
    consoleText +=
      'Scroll top: ' +
      this.fit.viewModel.tableScrollContainer.getScroller().getTop() +
      '\n';
    return consoleText;
  }

  private getFirstRenderableCol(): number {
    return (
      this.fit.viewModel.tableScrollContainer
        .getHorizontalScrollbar()
        ?.getFirstRenderableLine() ?? 0
    );
  }

  private getLastRenderableCol(): number {
    const colId: number =
      this.fit.viewModel.tableScrollContainer
        .getHorizontalScrollbar()
        ?.getLastRenderableLine() ?? 0;
    const numberOfCols: number = this.fit.table.getNumberOfCols();
    return colId > 0 ? colId : numberOfCols > 0 ? numberOfCols - 1 : 0;
  }

  private getFirstRenderableRow(): number {
    return (
      this.fit.viewModel.tableScrollContainer
        .getVerticalScrollbar()
        ?.getFirstRenderableLine() ?? 0
    );
  }

  private getLastRenderableRow(): number {
    const rowId: number =
      this.fit.viewModel.tableScrollContainer
        .getVerticalScrollbar()
        ?.getLastRenderableLine() ?? 0;
    const numberOfRows: number = this.fit.table.getNumberOfRows();
    return rowId > 0 ? rowId : numberOfRows > 0 ? numberOfRows - 1 : 0;
  }
}

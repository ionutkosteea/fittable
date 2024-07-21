import { Subscription } from 'rxjs';
import { Component, OnDestroy, OnInit } from '@angular/core';

import {
  CellRange,
  createCellCoord,
  createTable,
  registerModelConfig,
  Table,
} from 'fittable-core/model';
import { registerOperationConfig } from 'fittable-core/operations';
import {
  createTableDesigner,
  TableDesigner,
  registerViewModelConfig,
} from 'fittable-core/view-model';
import { FIT_MODEL_CONFIG } from 'fittable-model';
import { FIT_OPERATION_CONFIG } from 'fittable-model-operations';
import { createFitViewModelConfig } from 'fittable-view-model';

import { TopicTitle } from '../../common/topic-title.model';
import { CodeSnippet } from '../common/code-snippet.model';
import { Button, ConsoleTopic } from './common/console-topic.model';

@Component({
  selector: 'cell-selection',
  templateUrl: './common/console-topic.html',
  styleUrls: ['../common/common.css'],
})
export class CellSelectionComponent implements ConsoleTopic, OnInit, OnDestroy {
  public readonly title: TopicTitle = 'Cell selection';
  public readonly htmlCode: CodeSnippet[] = [
    { image: 'fittable-component-html.jpg' },
  ];
  public readonly typescriptCode: CodeSnippet[] = [
    { image: 'cell-selection-ts-01.jpg' },
    { image: 'cell-selection-ts-02.jpg' },
    { image: 'cell-selection-ts-03.jpg' },
  ];
  public readonly buttons: Button[] = [];
  public fit!: TableDesigner;
  private consoleText = '';
  private subscription?: Subscription;

  public ngOnInit(): void {
    registerModelConfig(FIT_MODEL_CONFIG);
    registerOperationConfig(FIT_OPERATION_CONFIG);
    registerViewModelConfig(
      createFitViewModelConfig({
        rowHeader: true,
        colHeader: true,
        cellSelection: true,
      })
    );

    const table: Table = createTable(); // FitTable default: 5 rows, 5 cols
    table.forEachCell((rowId: number, colId: number): void => {
      table.setCellValue(rowId, colId, '[' + rowId + ',' + colId + ']');
    });

    this.fit = createTableDesigner(table);

    this.createCellSelectionButton();
    this.writeCellSelectionToConsole();
  }

  private createCellSelectionButton(): void {
    this.buttons.push({
      getLabel: (): string => 'Select cell ranges: A1:B2, B2:D4',
      run: (): void => {
        this.fit.viewModel.cellSelection?.body
          .removeRanges()
          .addRange(createCellCoord(0, 0), createCellCoord(1, 1))
          .addRange(createCellCoord(1, 1), createCellCoord(3, 3))
          .end();
      },
    });
  }

  private writeCellSelectionToConsole(): void {
    this.subscription = this.fit.viewModel.cellSelection?.body
      .onEnd$()
      .subscribe((cellRanges: CellRange[]): void => {
        this.consoleText = '';
        for (const cellRange of cellRanges) {
          this.consoleText +=
            JSON.stringify(cellRange.getDto(), null, 2) + ',\n';
        }
      });
  }

  public getConsoleText(): string {
    return this.consoleText;
  }

  public ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }
}

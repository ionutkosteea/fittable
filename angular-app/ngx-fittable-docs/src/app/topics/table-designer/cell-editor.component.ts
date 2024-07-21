import { Component, OnInit } from '@angular/core';

import {
  createCellCoord,
  createTable,
  registerModelConfig,
  Table,
  Value,
} from 'fittable-core/model';
import { registerOperationConfig } from 'fittable-core/operations';
import {
  CellEditor,
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
  selector: 'cell-editor',
  templateUrl: './common/console-topic.html',
  styleUrls: ['../common/common.css'],
})
export class CellEditorComponent implements ConsoleTopic, OnInit {
  public readonly title: TopicTitle = 'Cell editor';
  public readonly htmlCode: CodeSnippet[] = [
    { image: 'fittable-component-html.jpg' },
  ];
  public readonly typescriptCode: CodeSnippet[] = [
    { image: 'cell-editor-ts-01.jpg' },
    { image: 'cell-editor-ts-02.jpg' },
    { image: 'cell-editor-ts-03.jpg' },
  ];
  public readonly buttons: Button[] = [];
  public fit!: TableDesigner;

  public ngOnInit(): void {
    registerModelConfig(FIT_MODEL_CONFIG);
    registerOperationConfig(FIT_OPERATION_CONFIG);
    registerViewModelConfig(
      createFitViewModelConfig({
        rowHeader: true,
        colHeader: true,
        cellEditor: true,
      })
    );

    const table: Table = createTable(); // FitTable default: 5 rows, 5 cols
    table.forEachCell((rowId: number, colId: number): void => {
      table.setCellValue(rowId, colId, rowId * colId);
    });

    this.fit = createTableDesigner(table);

    this.createButtons();
  }

  private createButtons(): void {
    this.buttons.push(this.createGoToCellButton());
    this.buttons.push(this.createHideCellEditorButton());
  }

  private createGoToCellButton(): Button {
    return {
      getLabel: (): string => 'Go to cell A1',
      run: (): void => {
        this.fit.viewModel.cellEditor?.setCell(createCellCoord(0, 0));
      },
    };
  }

  public createHideCellEditorButton(): Button {
    return {
      getLabel: (): string => {
        return this.fit.viewModel.cellEditor?.isVisible()
          ? 'Hide cell editor'
          : 'Show cell editor';
      },
      run: (): void => {
        const cellEditor: CellEditor | undefined =
          this.fit.viewModel.cellEditor;
        if (cellEditor?.isVisible()) cellEditor.setVisible(false);
        else cellEditor?.setVisible(true);
      },
    };
  }

  public getConsoleText(): string {
    const cellEditor: CellEditor | undefined = this.fit.viewModel.cellEditor;
    const rowId: number = cellEditor?.getCell().getRowId() ?? 0;
    const colId: number = cellEditor?.getCell().getColId() ?? 0;
    const value: Value | undefined = cellEditor?.getCellControl().getValue();
    return '[' + rowId + ',' + colId + "] = '" + value + "'";
  }
}

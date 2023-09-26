import { Component, OnInit } from '@angular/core';

// TypeScript modules
import {
  CellRange,
  createStyle,
  createTable,
  registerModelConfig,
  Table,
} from 'fittable-core/model';
import { registerOperationConfig } from 'fittable-core/operations';
import {
  createFittableDesigner,
  FittableDesigner,
  registerViewModelConfig,
} from 'fittable-core/view-model';
import { FitStyle, FitTable, FIT_MODEL_CONFIG } from 'fittable-model';
import {
  FitOperationArgs,
  FIT_OPERATION_CONFIG,
} from 'fittable-model-operations';
import { FIT_VIEW_MODEL_CONFIG } from 'fittable-view-model';

import { TopicTitle } from '../../../common/topic-title.model';

@Component({
  selector: 'installation',
  templateUrl: './installation.component.html',
  styleUrls: ['../../common/common.css'],
})
export class InstallationComponent implements OnInit {
  public readonly title: TopicTitle = 'Installation';
  public fit!: FittableDesigner;

  public ngOnInit(): void {
    // Register functionalities
    registerModelConfig(FIT_MODEL_CONFIG);
    registerOperationConfig(FIT_OPERATION_CONFIG);
    registerViewModelConfig(FIT_VIEW_MODEL_CONFIG);

    // Build table model
    const table: Table = createTable<FitTable>()
      .setNumberOfRows(100)
      .setNumberOfCols(10)
      .setRowHeight(0, 42)
      .setColWidth(0, 50)
      .addStyle('s0', createStyle<FitStyle>().set('font-weight', 'bold'))
      .setCellStyleName(0, 0, 's0')
      .setRowSpan(0, 0, 2)
      .setColSpan(0, 0, 3)
      .setLocale('de-DE')
      .setCellValue(2, 1, 1000)
      .setCellDataType(2, 1, { name: 'string' })
      .setCellValue(3, 1, 1000.123)
      .setCellDataType(3, 1, { name: 'number', format: '#.#,00 €' })
      .setCellValue(4, 1, '2023-12-31')
      .setCellDataType(4, 1, { name: 'date-time', format: 'dd.MM.yyyy' })
      .setCellValue(5, 1, true)
      .setCellValue(6, 1, false)
      .setCellValue(7, 1, 'Some text here...');

    // Create table designer
    this.fit = createFittableDesigner(table);

    // Access view model
    const selectedCells: CellRange[] | undefined =
      this.fit.viewModel.cellSelection?.body.getRanges();

    // Run operations
    if (selectedCells) {
      const args: FitOperationArgs = {
        id: 'cell-value',
        selectedCells,
        value: 'operation text',
      };
      this.fit.operationExecutor?.run(args);
    }
  }
}

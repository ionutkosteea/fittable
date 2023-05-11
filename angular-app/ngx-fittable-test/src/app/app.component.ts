import { Component, OnInit } from '@angular/core';

import {
  CellRange,
  createStyle,
  createTable,
  Table,
} from 'fittable-core/model';
import {
  createFittableDesigner,
  FittableDesigner,
} from 'fittable-core/view-model';
import { FitStyle, FitTable } from 'fittable-model';
import { FitOperationArgs } from 'fittable-model-operations';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  public fit!: FittableDesigner;

  public ngOnInit(): void {
    // Build table model
    const table: Table = createTable<FitTable>()
      .setNumberOfRows(100)
      .setNumberOfCols(10)
      .setRowHeight(0, 42)
      .setColWidth(0, 50)
      .addStyle('s0', createStyle<FitStyle>().set('font-weight', 'bold'))
      .setCellStyleName(0, 0, 's0')
      .setCellValue(0, 0, 1000)
      .setRowSpan(0, 0, 2)
      .setColSpan(0, 0, 3);

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
        value: 100,
      };
      this.fit.operationExecutor?.run(args);
    }
  }
}

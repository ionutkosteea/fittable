import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import {
  createCellCoord,
  createCellRange,
  createDataType,
  createStyle,
  createTable,
  Table,
} from 'fittable-core/model';
import { TableChanges } from 'fittable-core/operations';
import {
  createTableDesigner,
  TableDesigner,
} from 'fittable-core/view-model';
import { FitStyle, FitTable } from 'fittable-model';
import { FitOperationArgs } from 'fittable-model-operations';
import { FitThemeName } from 'fittable-view-model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  public fit!: TableDesigner;
  private readonly destroyRef = inject(DestroyRef);

  public ngOnInit(): void {
    // Build table
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
      .setCellDataType(2, 1, createDataType('string'))
      .setCellValue(3, 1, 1000.123)
      .setCellDataType(3, 1, createDataType('number', '#.#,00 €'))
      .setCellValue(4, 1, '2023-12-31')
      .setCellDataType(4, 1, createDataType('date-time', 'dd.MM.yyyy'))
      .setCellValue(5, 1, true)
      .setCellValue(6, 1, false)
      .setCellValue(7, 1, 'Some text here...');

    // Load table
    // const tableDto: FitTableDto = {
    //   numberOfRows: 5,
    //   numberOfCols: 5,
    //   cells: { 0: { 0: { value: 1000 } } }
    // }
    // const table: FitTable = createTable4Dto(tableDto);

    // Create table designer
    this.fit = createTableDesigner(table);

    // Run operations
    if (this.fit.operationExecutor) {
      this.fit.operationExecutor.onAfterRun$()
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe((dto: TableChanges) => {
          //  Do something...
        });

      const args: FitOperationArgs = {
        id: 'cell-value',
        selectedCells: [createCellRange(createCellCoord(0, 0))],
        value: 'operation text',
      };
      this.fit.operationExecutor.run(args);
    }

    // Access view model
    const darkTheme: FitThemeName = 'Dark mode';
    this.fit.viewModel.themeSwitcher?.switch(darkTheme);
  }
}

# Fittable

## Introduction

  <p>
    Fittable is a flexible and easy-to-use software component optimized for handling large table structures with spreadsheet-like capabilities. Built using Angular and TypeScript, it offers a customizable table model, an interoperable operation execution mechanism and a dynamic user interface adaptable to model structure and changes.
  </p>
  <p>
    The main module of Fittable is developed in Angular, which presents an interactive view for the application. The view model and other essential modules are written in TypeScript, without any dependency on a GUI framework, providing server-side compatibility as well.
  </p>
  <p>
    Fittable's modules are highly adjustable, with a range of configurable options, allowing the customization of each functionality.
  </p>
  <p>
    Currently, the following features are available in Fittable:
  </p>

## Preview

<div align="center">
  <img src="https://github.com/ionutkosteea/fittable/blob/main/fittable-preview.jpg" alt="Preview" width="800" />
</div>

## Documentation

- [User Docs](https://fittable-499b2.web.app)

## Installation

```bash
npm install fittable-angular
```

## Angular component example

### tsconfig.json

```json
"compilerOptions": {
  "baseUrl": "./",
  "paths": {
    "fittable-core/common": ["./node_modules/fittable-core/dist/common"],
    "fittable-core/model": ["./node_modules/fittable-core/dist/model"],
    "fittable-core/operations": [
      "./node_modules/fittable-core/dist/operations"
    ],
    "fittable-core/view-model": [
      "./node_modules/fittable-core/dist/view-model"
    ],
    "fittable-model": ["./node_modules/fittable-model/dist"],
    "fittable-model-operations": [
      "./node_modules/fittable-model-operations/dist"
    ],
    "fittable-view-model": ["./node_modules/fittable-view-model/dist"]
  }
  // ...
}
```

### app.module.ts

```typescript
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { registerModelConfig } from 'fittable-core/model';
import { registerOperationConfig } from 'fittable-core/operations';
import { registerViewModelConfig } from 'fittable-core/view-model';
import { FIT_MODEL_CONFIG } from 'fittable-model';
import { FIT_OPERATION_CONFIG } from 'fittable-model-operations';
import { FIT_VIEW_MODEL_CONFIG } from 'fittable-view-model';
import { FittableModule } from 'fittable-angular';

import { AppComponent } from './app.component';

// Register functionalities
registerModelConfig(FIT_MODEL_CONFIG);
registerOperationConfig(FIT_OPERATION_CONFIG);
registerViewModelConfig(FIT_VIEW_MODEL_CONFIG);

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, FittableModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
```

### app.component.ts

```typescript
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
import { createTableDesigner, TableDesigner } from 'fittable-core/view-model';
import { FitStyle, FitTable, FitTableDto } from 'fittable-model';
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
      this.fit.operationExecutor
        .onAfterRun$()
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
```

### app.component.html

```html
<div class="fittable">
  <fittable [designer]="fit" />
</div>
```

### app.component.css

```css
.fittable {
  position: relative;
  width: 100%;
  height: 100%;
}
```

### styles.css

```css
html,
body {
  position: relative;
  width: 100%;
  height: 100%;
  margin: 0px;
  padding: 0px;
  overflow: hidden;
}
```

<p>The demo component can be found <a href="https://github.com/ionutkosteea/fittable/tree/main/angular-app/ngx-fittable-test">here</a>.<p>

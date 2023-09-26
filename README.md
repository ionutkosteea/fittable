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
```

### app.component.html

```html
<div class="fittable">
  <!-- Angular component -->
  <fittable [designer]="fit"></fittable>
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

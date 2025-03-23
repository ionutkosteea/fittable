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
    const dataDef = createDataDef<FitDataDef>('employees', [
      'NAME',
      'AGE',
      'SALARY',
      'BONUS_PERCENTAGE',
      'HIRE_DATE',
      'IS_ACTIVE',
    ])
      .setKeyFields('EMPLOYEE_ID')
      .setExpandRows(true);

    const data = createData<FitData>('employees', [
      [1, 'John Doe', 30, 50000, 0.1, '2021-01-01', true],
      [2, 'Jane Smith', 25, 45000, 0.15, '2020-06-15', true],
      [3, 'Alice Johnson', 28, 48000, 0.12, '2019-11-20', false],
      [4, 'Bob Brown', 35, 52000, 0.08, '2018-03-10', true],
      [5, 'Charlie Davis', 40, 55000, 0.2, '2017-07-25', true],
    ]);

    const table = createTable<FitTable>()
      .setNumberOfRows(2)
      .setNumberOfCols(6)
      .setRowHeight(0, 40)
      .setStyle(
        's0',
        createStyle<FitStyle>()
          .set('font-weight', 'bold')
          .set('text-align', 'center')
      )
      .setCellValue(0, 0, 'Name')
      .setCellStyleName(0, 0, 's0')
      .setCellValue(0, 1, 'Age')
      .setCellStyleName(0, 1, 's0')
      .setCellValue(0, 2, 'Salary')
      .setCellStyleName(0, 2, 's0')
      .setCellValue(0, 3, 'Bonus Percentage')
      .setCellStyleName(0, 3, 's0')
      .setCellValue(0, 4, 'Hire Date')
      .setCellStyleName(0, 4, 's0')
      .setCellValue(0, 5, 'Is Active')
      .setCellStyleName(0, 5, 's0')
      .setCellDataType(1, 2, createDataType<FitDataType>('number', '$#,#.00'))
      .setCellDataType(1, 3, createDataType<FitDataType>('number', '#%'))
      .setCellDataType(
        1,
        4,
        createDataType<FitDataType>('date-time', 'dd.MM.yyyy')
      )
      .setDataDef(1, 0, dataDef)
      .loadData(data);

    const tableDesigner = createTableDesigner(table);
    tableDesigner.operationExecutor
      ?.onAfterRun$()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((changes: TableChanges) => {
        const dataRefs: TableChangeDataRef[] = createTableChangeDataRefs(
          table,
          changes
        );
        for (const dataRef of dataRefs) {
          console.log(`Reference: ${dataRef.item}`);
          console.log(
            `Value: ${table.getCellValue(dataRef.rowId, dataRef.colId)}`
          );
          // Output:
          // Reference: {"dataDef":"employees","valueField":"NAME","keyFields":{"EMPLOYEE_ID":1}}
          // Value: John Doe
        }
      });
    const darkTheme: FitThemeName = 'Dark mode';
    tableDesigner.viewModel.themeSwitcher?.switch(darkTheme);

    this.fit = signal(tableDesigner);
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

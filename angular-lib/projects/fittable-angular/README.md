# Fittable

## Introduction

<p>
  Fittable is a flexible and easy-to-use software component optimized for handling large table structures with spreadsheet-like capabilities. Built using Angular and TypeScript, it offers a dynamic table model, a robust operation execution mechanism, and an adjustable user interface that can be easily customized to meet your specific needs.
</p>
<p>
  The main module of Fittable is developed in Angular, which presents a responsive and interactive view for the application. The view model and other essential modules are written in TypeScript without any dependency on a GUI framework, making it possible to use the component on the server-side as well.
</p>
<p>
  Fittable's modules are highly adaptable, with a range of configurable options that allow you to customize each functionality to match your application's requirements.
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

### tsconfig.json (for non-ECMAScript module dependants)

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

## API Overview

### HTML

```html
<div style="width:100%;height:300px;">
  <!-- Angular component -->
  <fittable [designer]="fit"></fittable>
</div>
```

### TypeScript

```typescript
import { Component, OnInit } from "@angular/core";

// TypeScript modules
import { CellRange, createStyle, createTable, registerModelConfig, Table } from "fittable-core/model";
import { registerOperationConfig } from "fittable-core/operations";
import { createFittableDesigner, FittableDesigner, registerViewModelConfig } from "fittable-core/view-model";
import { FitStyle, FitTable, FIT_MODEL_CONFIG } from "fittable-model";
import { FitOperationArgs, FIT_OPERATION_CONFIG } from "fittable-model-operations";
import { FIT_VIEW_MODEL_CONFIG } from "fittable-view-model";

@Component({
  selector: "sample",
  templateUrl: "./sample.component.html",
  styleUrls: [".sample/common.css"],
})
export class SampleComponent implements OnInit {
  public fit!: FittableDesigner;

  public ngOnInit(): void {
    // Register functionalities
    registerModelConfig(FIT_MODEL_CONFIG);
    registerOperationConfig(FIT_OPERATION_CONFIG);
    registerViewModelConfig(FIT_VIEW_MODEL_CONFIG);

    // Build table model
    const table: Table = createTable<FitTable>().setNumberOfRows(100).setNumberOfCols(10).setRowHeight(0, 42).setColWidth(0, 50).addStyle("s0", createStyle<FitStyle>().set("font-weight", "bold")).setCellStyleName(0, 0, "s0").setCellValue(0, 0, 1000).setRowSpan(0, 0, 2).setColSpan(0, 0, 3);

    // Create table designer
    this.fit = createFittableDesigner(table);

    // Access view model
    const selectedCells: CellRange[] | undefined = this.fit.viewModel.cellSelection?.body.getRanges();

    // Run operations
    if (selectedCells) {
      const args: FitOperationArgs = {
        id: "cell-value",
        selectedCells,
        value: 100,
      };
      this.fit.operationExecutor?.run(args);
    }
  }
}
```

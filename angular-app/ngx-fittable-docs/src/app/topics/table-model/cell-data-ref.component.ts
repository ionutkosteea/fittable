import { Component, DestroyRef, ElementRef, inject, OnInit, ViewChild } from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";

import { createStyle, createTable, registerModelConfig, createDataRef } from 'fittable-core/model';
import { BaseTableChanges, registerOperationConfig, TableChanges } from "fittable-core/operations";
import { createTableDesigner, registerViewModelConfig, TableDesigner } from 'fittable-core/view-model';
import { FIT_MODEL_CONFIG, FitStyle, FitTable } from "fittable-model";
import { FIT_OPERATION_CONFIG, createTableChangeDataRefs, TableChangeDataRef } from "fittable-model-operations";
import { FIT_VIEW_MODEL_CONFIG, FitToolbarControlId } from "fittable-view-model";

import { TopicTitle } from './../../common/topic-title.model';
import { CodeSnippet } from "../common/code-snippet.model";
import { ConsoleTopic } from "./common/console-topic.model";
@Component({
  selector: 'cell-data-refs',
  templateUrl: './common/console-topic.html',
  styleUrls: ['../common/common.css'],
})
export class CellDataRefComponent extends ConsoleTopic implements OnInit {
  @ViewChild('console') console!: ElementRef;

  public override readonly isConsoleDisabled = true;
  public readonly title: TopicTitle = 'Cell data reference';
  public readonly htmlCode: CodeSnippet[] = [
    { image: 'fittable-component-html.jpg' },
  ];
  public readonly typescriptCode: CodeSnippet[] = [
    { image: 'cell-data-ref-ts-01.jpg' },
    { image: 'cell-data-ref-ts-02.jpg' },
    { image: 'cell-data-ts-01.jpg' },
    { image: 'cell-data-ts-02.jpg' },
  ];
  private readonly destroyRef = inject(DestroyRef);
  private consoleText = '';
  public fit!: TableDesigner;

  ngOnInit(): void {
    registerModelConfig(FIT_MODEL_CONFIG);
    registerOperationConfig(FIT_OPERATION_CONFIG);
    registerViewModelConfig(FIT_VIEW_MODEL_CONFIG);

    this.fit = this.createTableDesigner();
    this.removeUnnecessaryToolbarControls();
    this.updateConsoleOnTableChanges();
  }

  public override getConsoleText(): string {
    return this.consoleText;
  }

  private createTableDesigner(): TableDesigner {
    const table: FitTable = createTable<FitTable>()
      .setStyle("s0", createStyle<FitStyle>().set("font-weight", "bold"))
      .setStyle("s1", createStyle<FitStyle>().set("background-color", "yellow"))
      .setColSpan(0, 0, 5)
      .setCellValue(0, 0,
        'Edit yellow cells & Switch to cell data references via toolbar button [x].')
      .setCellStyleName(0, 0, "s0")
      .setCellValue(1, 0, "Employee ID")
      .setCellValue(1, 1, "Name")
      .setCellValue(1, 2, "Age")
      .setCellValue(2, 0, 1)
      .setCellValue(2, 1, "John Doe")
      .setCellDataRef(2, 1, createDataRef("my_table", "NAME", { "EMPLOYEE_ID": 1 }))
      .setCellStyleName(2, 1, "s1")
      .setCellValue(2, 2, 29)
      .setCellDataRef(2, 2, createDataRef("my_table", "AGE", { "EMPLOYEE_ID": 1 }))
      .setCellStyleName(2, 2, "s1")
      .setCellValue(3, 0, 2)
      .setCellValue(3, 1, "Kim Doe")
      .setCellDataRef(3, 1, createDataRef("my_table", "NAME", { "EMPLOYEE_ID": 2 }))
      .setCellStyleName(3, 1, "s1")
      .setCellValue(3, 2, 25)
      .setCellDataRef(3, 2, createDataRef("my_table", "AGE", { "EMPLOYEE_ID": 2 }))
      .setCellStyleName(3, 2, "s1");

    return createTableDesigner(table);
  }

  private removeUnnecessaryToolbarControls(): void {
    const requiredControlIds: FitToolbarControlId[] = ['undo', 'redo', 'data-ref'];
    this.fit.viewModel.toolbar
      ?.getControlIds()
      .filter(id => !requiredControlIds.includes(id as FitToolbarControlId))
      .forEach(id => this.fit.viewModel.toolbar?.removeControl(id));
  }

  private updateConsoleOnTableChanges(): void {
    this.fit.operationExecutor?.onBeforeRun$()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((changes: TableChanges) => this.updateConsole(changes));
    this.fit.operationExecutor?.onBeforeUndo$()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((changes: TableChanges) => this.updateConsole(changes.undoChanges));
    this.fit.operationExecutor?.onBeforeRedo$()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((changes: TableChanges) => this.updateConsole(changes));
  }

  private updateConsole(changes?: BaseTableChanges): void {
    if (!changes) return;
    const table = this.fit.operationExecutor?.getTable() as FitTable;
    const dataRefs: TableChangeDataRef[] = createTableChangeDataRefs(table, changes);
    for (const dataRef of dataRefs) {
      this.consoleText += `Reference: ${dataRef.ref}\r\n`;
      this.consoleText += `Value: ${dataRef.value}\r\n`;
    }
    this.console.nativeElement.scrollTop = this.console.nativeElement.scrollHeight;
  }
}

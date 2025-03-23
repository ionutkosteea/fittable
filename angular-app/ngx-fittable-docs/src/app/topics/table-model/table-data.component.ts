import { Component, DestroyRef, ElementRef, inject, OnInit, ViewChild } from "@angular/core";
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { createData, createDataDef, createTable, registerModelConfig } from "fittable-core/model";
import { BaseTableChanges, registerOperationConfig, TableChanges } from "fittable-core/operations";
import { createTableDesigner, registerViewModelConfig, TableDesigner } from "fittable-core/view-model";
import { FIT_MODEL_CONFIG, FitTable, FitDataDef, FitData } from "fittable-model";
import { FIT_OPERATION_CONFIG, createTableChangeDataRefs, TableChangeDataRef } from "fittable-model-operations";
import { FIT_VIEW_MODEL_CONFIG, FitToolbarControlId } from "fittable-view-model";

import { TopicTitle } from "../../common/topic-title.model";
import { CodeSnippet } from "../common/code-snippet.model";
import { ConsoleTopic } from "./common/console-topic.model";

@Component({
  selector: 'table-data',
  templateUrl: './common/console-topic.html',
  styleUrls: ['../common/common.css'],
})
export class TableDataComponent extends ConsoleTopic implements OnInit {
  @ViewChild('console') console!: ElementRef;

  public override readonly isConsoleDisabled = true;
  readonly title: TopicTitle = 'Table data';
  readonly htmlCode: CodeSnippet[] = [
    { image: 'fittable-component-html.jpg' },
  ];
  readonly typescriptCode: CodeSnippet[] = [
    { image: 'table-data-ts-01.jpg' },
    { image: 'table-data-ts-02.jpg' },
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

  override getConsoleText(): string {
    return this.consoleText;
  }

  private createTableDesigner(): TableDesigner {
    const dataDef = createDataDef<FitDataDef>('my_table', ['NAME', 'AGE'])
      .setKeyFields('EMPLOYEE_ID');

    const data = createData<FitData>('my_table', [
      [1, 'John Doe', 30],
      [2, 'Jane Doe', 25],
      [3, 'Jack Doe', 35],
    ]);

    const table = createTable<FitTable>()
      .setCellValue(0, 0, 'Name')
      .setCellValue(0, 1, 'Age')
      .setDataDef(1, 0, dataDef)
      .loadData(data);

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

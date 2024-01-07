import { Subscription } from 'rxjs';

import { createTable, registerModelConfig } from 'fittable-core/model';
import {
  TableChanges,
  registerOperationConfig,
} from 'fittable-core/operations';
import {
  createFittableDesigner,
  FittableDesigner,
  registerViewModelConfig,
} from 'fittable-core/view-model';
import { FIT_MODEL_CONFIG } from 'fittable-model';
import { FIT_OPERATION_CONFIG } from 'fittable-model-operations';
import { createFitViewModelConfig } from 'fittable-view-model';

import { TopicTitle } from '../../../common/topic-title.model';
import { CodeSnippet } from '../../common/code-snippet.model';
import { Component, OnDestroy, OnInit } from '@angular/core';

@Component({
  template: '',
})
export abstract class ConsoleTopic implements OnInit, OnDestroy {
  public abstract title: TopicTitle;
  public abstract buttonText: string;
  public abstract runOperation(): void;

  public htmlCode: CodeSnippet[];
  public typescriptCode: CodeSnippet[];
  public fit!: FittableDesigner;
  public consoleText = '';
  protected readonly subscriptions: Set<Subscription | undefined> = new Set();

  constructor() {
    this.htmlCode = [{ image: 'fittable-component-html.jpg' }];
    this.typescriptCode = [
      { image: 'console-operation-ts-01.jpg' },
      { image: 'console-operation-ts-02.jpg' },
      { image: 'console-operation-ts-03.jpg' },
    ];
  }

  public ngOnInit(): void {
    // The register functions should be called, in most cases, from the Angular main module.
    registerModelConfig(FIT_MODEL_CONFIG);
    registerOperationConfig(FIT_OPERATION_CONFIG);
    registerViewModelConfig(
      createFitViewModelConfig({ rowHeader: true, colHeader: true })
    );

    this.fit = createFittableDesigner(createTable()); // FitTable default: 5 rows, 5 cols

    this.subscriptions.add(this.writeToConsoleAfterRun$());
    this.subscriptions.add(this.writeToConsoleAfterUndo$());
    this.subscriptions.add(this.writeToConsoleAfterRedo$());
  }

  protected writeToConsoleAfterRun$(): Subscription | undefined {
    return this.fit.operationExecutor
      ?.onAfterRun$()
      .subscribe((tableChanges: TableChanges): void => {
        this.consoleText = 'Operation id: ' + tableChanges.id + '\n';
        this.consoleText +=
          'Operation changes: ' + JSON.stringify(tableChanges.changes, null, 2);
      });
  }

  protected writeToConsoleAfterUndo$(): Subscription | undefined {
    return this.fit.operationExecutor
      ?.onAfterUndo$()
      .subscribe((tableChanges: TableChanges): void => {
        this.consoleText = 'Operation id: ' + tableChanges.id + '\n';
        this.consoleText +=
          'Operation changes: ' +
          JSON.stringify(tableChanges.undoChanges?.changes, null, 2);
      });
  }

  protected writeToConsoleAfterRedo$(): Subscription | undefined {
    return this.fit.operationExecutor
      ?.onAfterRedo$()
      .subscribe((tableChanges: TableChanges): void => {
        this.consoleText = 'Operation id: ' + tableChanges.id + '\n';
        this.consoleText +=
          'Operation changes: ' + JSON.stringify(tableChanges.changes, null, 2);
      });
  }

  public undo(): void {
    this.fit.operationExecutor?.undo();
  }

  public redo(): void {
    this.fit.operationExecutor?.redo();
  }

  public ngOnDestroy(): void {
    this.subscriptions.forEach((s?: Subscription): void => s?.unsubscribe());
  }
}

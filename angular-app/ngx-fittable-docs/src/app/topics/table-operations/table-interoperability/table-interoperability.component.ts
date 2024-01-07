import { Subscription } from 'rxjs';
import { Component, OnDestroy, OnInit } from '@angular/core';

import { createTable, registerModelConfig, Table } from 'fittable-core/model';
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
import {
  FitUIOperationProperties,
  FIT_VIEW_MODEL_CONFIG,
} from 'fittable-view-model';

import { TopicTitle } from '../../../common/topic-title.model';
import { CodeSnippet } from '../../common/code-snippet.model';

type OperationProperties = FitUIOperationProperties & {
  stopPropagation: boolean;
};

@Component({
  selector: 'table-interoperability',
  templateUrl: './table-interoperability.component.html',
  styleUrls: ['../../common/common.css'],
})
export class TableInteroperabilityComponent implements OnInit, OnDestroy {
  public readonly title: TopicTitle = 'Table interoperability';
  public readonly htmlCode: CodeSnippet[] = [
    { image: 'table-interoperability-html.jpg' },
  ];
  public readonly typescriptCode: CodeSnippet[] = [
    { image: 'table-interoperability-ts-01.jpg' },
    { image: 'table-interoperability-ts-02.jpg' },
  ];

  public fit1!: FittableDesigner;
  public fit2!: FittableDesigner;
  private readonly subscriptions: Set<Subscription | undefined> = new Set();

  public ngOnInit(): void {
    // The register functions should be called, in most cases, from the Angular main module.
    registerModelConfig(FIT_MODEL_CONFIG);
    registerOperationConfig(FIT_OPERATION_CONFIG);
    registerViewModelConfig(FIT_VIEW_MODEL_CONFIG);

    const table: Table = createTable() //
      .setNumberOfRows(50)
      .setNumberOfCols(10);
    this.fit1 = createFittableDesigner(table);
    this.fit2 = createFittableDesigner(table.clone());

    this.linkTables(this.fit1, this.fit2);
    this.linkTables(this.fit2, this.fit1);
  }

  private linkTables(fit1: FittableDesigner, fit2: FittableDesigner): void {
    this.subscriptions.add(this.afterRun$(fit1, fit2));
    this.subscriptions.add(this.afterUndo$(fit1, fit2));
    this.subscriptions.add(this.afterRedo$(fit1, fit2));
  }

  private afterRun$(
    fit1: FittableDesigner,
    fit2: FittableDesigner
  ): Subscription | undefined {
    return fit1.operationExecutor
      ?.onAfterRun$()
      .subscribe((tableChanges: TableChanges): void => {
        let properties: OperationProperties =
          tableChanges.properties as OperationProperties;
        if (properties.stopPropagation) return;
        properties = { stopPropagation: true, preventFocus: true };
        fit2.operationExecutor?.writeTableChanges({
          id: tableChanges.id,
          changes: tableChanges.changes,
          properties,
        });
      });
  }

  private afterUndo$(
    fit1: FittableDesigner,
    fit2: FittableDesigner
  ): Subscription | undefined {
    return fit1.operationExecutor
      ?.onAfterUndo$()
      .subscribe((tableChanges: TableChanges): void => {
        if (!tableChanges.undoChanges) return;
        const properties: OperationProperties = {
          ...tableChanges.properties,
        } as OperationProperties;
        properties.stopPropagation = true;
        properties.preventFocus = true;
        fit2.operationExecutor?.writeTableChanges({
          id: tableChanges.id,
          changes: tableChanges.undoChanges.changes,
          properties,
        });
      });
  }

  private afterRedo$(
    fit1: FittableDesigner,
    fit2: FittableDesigner
  ): Subscription | undefined {
    return fit1.operationExecutor
      ?.onAfterRedo$()
      .subscribe((tableChanges: TableChanges): void => {
        const properties: OperationProperties = {
          ...tableChanges.properties,
        } as OperationProperties;
        properties.stopPropagation = true;
        properties.preventFocus = true;
        fit2.operationExecutor?.writeTableChanges({
          id: tableChanges.id,
          changes: tableChanges.changes,
          properties,
        });
      });
  }

  public ngOnDestroy(): void {
    this.subscriptions.forEach((s?: Subscription): void => s?.unsubscribe());
  }
}

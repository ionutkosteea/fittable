import { Subscription } from 'rxjs';
import { Component, OnDestroy, OnInit } from '@angular/core';

import { createTable, registerModelConfig, Table } from 'fit-core/model';
import {
  OperationDto,
  OperationId,
  registerOperationConfig,
} from 'fit-core/operations';
import {
  createFittableDesigner,
  FittableDesigner,
  registerViewModelConfig,
} from 'fit-core/view-model';
import { FIT_MODEL_CONFIG } from 'fit-model';
import { FIT_OPERATION_CONFIG } from 'fit-model-operations';
import { FIT_VIEW_MODEL_CONFIG } from 'fit-view-model';

import { TopicTitle } from '../../../common/topic-title.model';
import { CodeSnippet } from '../../common/code-snippet.model';

@Component({
  selector: 'table-interoperability',
  templateUrl: './table-interoperability.component.html',
  styleUrls: [
    './table-interoperability.component.css',
    '../../common/common.css',
  ],
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
  private readonly subscriptions: Subscription[] = [];

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
    const afterRun$: Subscription = fit1
      .operationExecutor!.onAfterRun$()
      .subscribe((dto: OperationDto): void => {
        if (dto.properties && dto.properties['stopPropagation']) return;
        fit2.operationExecutor?.runOperationDto({
          id: dto.id,
          steps: dto.steps,
          preventFocus: true,
          properties: { stopPropagation: true },
        });
      });
    this.subscriptions.push(afterRun$);
    const afterUndo$: Subscription = fit1
      .operationExecutor!.onAfterUndo$()
      .subscribe((dto: OperationDto): void => {
        const steps: OperationId<string>[] | undefined =
          dto.undoOperation?.steps;
        steps &&
          fit2.operationExecutor?.runOperationDto({
            id: dto.id,
            steps,
            preventFocus: true,
          });
      });
    this.subscriptions.push(afterUndo$);
    const afterRedo$: Subscription = fit1
      .operationExecutor!.onAfterRedo$()
      .subscribe((dto: OperationDto): void => {
        fit2.operationExecutor?.runOperationDto({
          id: dto.id,
          steps: dto.steps,
          preventFocus: true,
        });
      });
    this.subscriptions.push(afterRedo$);
  }

  public ngOnDestroy(): void {
    this.subscriptions.forEach((s: Subscription): void => s.unsubscribe());
  }
}

import { Subscription } from 'rxjs';
import { Component, Input, OnInit, OnDestroy } from '@angular/core';

import { CssStyle, CellRange } from 'fittable-core/model';
import {
  ViewModel,
  CellEditorListener,
  createCellEditorListener,
  CellSelectionRanges,
  FitMouseEvent,
  createWindowListener,
  CellSelectionListener,
} from 'fittable-core/view-model';

import { TableCommon } from '../common/table-common.model';

@Component({
  selector: 'fit-table-center',
  templateUrl: './table-center.component.html',
  styleUrls: ['../common/css/table-common.css', './table-center.component.css'],
})
export class TableCenterComponent
  extends TableCommon
  implements OnInit, OnDestroy
{
  @Input() override viewModel!: ViewModel;
  @Input() cellSelectionListener?: CellSelectionListener;

  public cellEditorListener?: CellEditorListener;
  private readonly subscriptions: Set<Subscription | undefined> = new Set();

  public ngOnInit(): void {
    this.cellEditorListener = this.createCellEditorListener();
    this.subscriptions.add(this.openCellEditorContextMenu$());
  }

  private createCellEditorListener(): CellEditorListener | undefined {
    return (
      this.viewModel.cellEditor &&
      createCellEditorListener(
        this.viewModel.cellEditor,
        (): CellRange[] => this.viewModel.cellSelection?.body.getRanges() ?? []
      )
    );
  }

  private openCellEditorContextMenu$(): Subscription | undefined {
    return (
      this.viewModel.contextMenu &&
      this.cellEditorListener
        ?.onContextMenu$()
        .subscribe((event: FitMouseEvent): void => {
          this.viewModel.contextMenu &&
            createWindowListener(this.viewModel.contextMenu).onShow(event);
        })
    );
  }

  public readonly getTableOffset = (): CssStyle =>
    this.viewModel.mobileLayout.bodyOffset;

  public readonly getCellSelectionRanges = ():
    | CellSelectionRanges
    | undefined => this.viewModel.cellSelection?.body;

  public readonly getSelectedCells = (): CellRange[] =>
    this.viewModel.cellSelection?.body.getRanges() ?? [];

  public readonly getCellSelectionRectangles = (): CssStyle[] =>
    this.viewModel.mobileLayout.bodySelectionRectangles;

  public ngOnDestroy(): void {
    this.subscriptions.forEach((s: Subscription | undefined): void =>
      s?.unsubscribe()
    );
  }
}

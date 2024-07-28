import { Component, OnInit, ViewChild, input, signal } from '@angular/core';

import {
  CellSelectionListener,
  ViewModel,
  createCellSelectionListener,
} from 'fittable-core/view-model';

import { TableLeftTopCornerComponent } from './table-left-top-corner/table-left-top-corner.component';
import { TableTopComponent } from './table-top/table-top.component';
import { TableLeftComponent } from './table-left/table-left.component';
import { TableCenterComponent } from './table-center/table-center.component';

@Component({
  selector: 'fit-table',
  standalone: true,
  imports: [
    TableLeftTopCornerComponent,
    TableTopComponent,
    TableLeftComponent,
    TableCenterComponent,
  ],
  templateUrl: 'table.component.html',
  styleUrl: './table.component.scss',
})
export class TableComponent implements OnInit {
  viewModel = input.required<ViewModel>();

  @ViewChild('tableTopComponent') tableTopComponent?: TableTopComponent;
  @ViewChild('tableLeftComponent') tableLeftComponent?: TableLeftComponent;
  protected readonly cellSelectionListener = signal<CellSelectionListener | undefined>(undefined);

  ngOnInit(): void {
    this.cellSelectionListener.set(this.createCellSelectionListener());
  }

  onScroll(div: { scrollLeft: number; scrollTop: number }): void {
    this.tableTopComponent?.scrollerRef?.nativeElement
      .scrollTo(div.scrollLeft, 0);
    this.tableLeftComponent?.scrollerRef?.nativeElement
      .scrollTo(0, div.scrollTop);
  }

  private createCellSelectionListener(): CellSelectionListener | undefined {
    const wm: ViewModel = this.viewModel();
    return (
      wm.cellSelection &&
      createCellSelectionListener(wm.cellSelection, wm.cellSelectionScroller)
    );
  }
}

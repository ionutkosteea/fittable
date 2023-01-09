import { Directive, HostListener, Input, OnInit } from '@angular/core';

import { CellRange } from 'fit-core/model';
import { CellEditorListener, CellEditor } from 'fit-core/view-model';

import { getCellCoord } from '../common/control-utils.model';

@Directive({ selector: '[fitCellEditorOpen]' })
export class CellEditorOpenDirective implements OnInit {
  @Input() cellEditorListener?: CellEditorListener;
  @Input() cellEditor?: CellEditor;
  @Input() selectedCellsFn: () => CellRange[] = () => [];

  public ngOnInit(): void {
    this.cellEditorListener
      ?.setCellEditor(this.cellEditor!)
      .setSelectedCells(this.selectedCellsFn);
  }

  @HostListener('mousedown', ['$event', '$event.target']) onMouseDown(
    event: MouseEvent,
    htmlCell: HTMLElement
  ): void {
    this.cellEditorListener?.onShow(getCellCoord(htmlCell), event);
  }
}

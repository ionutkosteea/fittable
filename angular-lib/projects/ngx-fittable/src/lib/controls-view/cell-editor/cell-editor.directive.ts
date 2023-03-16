import { Directive, HostListener, Input, OnInit } from '@angular/core';

import { CellEditorListener } from 'fit-core/view-model';

@Directive({ selector: '[fitCellEditorOpen]' })
export class CellEditorOpenDirective {
  @Input() cellEditorListener?: CellEditorListener;

  @HostListener('mousedown', ['$event']) onMouseDown(event: MouseEvent): void {
    this.cellEditorListener?.onShow(event);
  }
}

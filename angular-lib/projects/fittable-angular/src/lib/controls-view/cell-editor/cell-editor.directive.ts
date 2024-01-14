import { Directive, HostListener, Input } from '@angular/core';

import { CellEditorListener } from 'fittable-core/view-model';

@Directive({ selector: '[fitCellEditorOpen]', standalone: true })
export class CellEditorOpenDirective {
  @Input() cellEditorListener?: CellEditorListener;

  @HostListener('mousedown', ['$event']) onMouseDown(event: MouseEvent): void {
    this.cellEditorListener?.onShow(event);
  }
}

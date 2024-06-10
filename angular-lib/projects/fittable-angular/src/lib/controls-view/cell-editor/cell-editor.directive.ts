import { Directive, HostListener, input } from '@angular/core';

import { CellEditorListener } from 'fittable-core/view-model';

@Directive({ selector: '[fitCellEditorOpen]', standalone: true })
export class CellEditorOpenDirective {
  cellEditorListener = input<CellEditorListener>();


  @HostListener('mousedown', ['$event']) onMouseDown(event: MouseEvent): void {
    this.cellEditorListener()?.onShow(event);
  }
}

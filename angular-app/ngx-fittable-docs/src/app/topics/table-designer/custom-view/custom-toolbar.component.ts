import { Component, Input } from '@angular/core';

import { Container, Control } from 'fittable-core/view-model';
import { FitToolbarControlId } from 'fittable-view-model';

@Component({
  selector: 'custom-toolbar',
  template: '<div class="toolbar" (click)="undo()">{{getUndoLabel()}}</div>',
  styles: [
    `
      .toolbar {
        border: 1px solid;
        padding: 4px;
        cursor: pointer;
      }
    `,
  ],
})
export class CustomToolbarComponent {
  @Input() model!: Container;

  public getUndoLabel(): string {
    return this.getUndoControl().getLabel();
  }

  public undo(): void {
    this.getUndoControl().run();
  }

  private getUndoControl(): Control {
    const undoControlId: FitToolbarControlId = 'undo';
    return this.model.getControl(undoControlId);
  }
}

import { Component, HostListener, Input, OnInit } from '@angular/core';

import { CssStyle } from 'fittable-core/model';
import {
  Control,
  Window,
  WindowListener,
  createWindowListener,
} from 'fittable-core/view-model';
import { createWindowStyle } from 'fittable-angular';
import { FitContextMenuControlId } from 'fittable-view-model';

@Component({
  selector: 'custom-context-menu',
  template:
    '<div class="menu" [ngStyle]="getDynamicStyle()" (click)="removeCells()">' +
    '{{getRemoveLabel()}}' +
    '</div>',
  styles: [
    `
      .menu {
        position: fixed;
        left: 0px;
        top: 0px;
        border: 1px solid;
        padding: 4px;
        background: white;
        cursor: pointer;
      }
    `,
  ],
})
export class CustomContextMenuComponent implements OnInit {
  @Input() model!: Window;
  private windowListener!: WindowListener;

  public ngOnInit() {
    this.windowListener = createWindowListener(this.model);
  }
  public getDynamicStyle(): CssStyle {
    // Handles menu visibility and position.
    return createWindowStyle(this.model);
  }
  public getRemoveLabel(): string {
    return this.getRemoveControl().getLabel();
  }
  public removeCells(): void {
    this.getRemoveControl().run();
    this.model.setVisible(false);
  }
  private getRemoveControl(): Control {
    const removeControlId: FitContextMenuControlId = 'remove';
    return this.model.getControl(removeControlId);
  }

  /**  Wrap window event listeners. */
  @HostListener('mousedown', ['$event']) onMouseDown(event: MouseEvent): void {
    this.windowListener.onMouseDown(event);
  }
  @HostListener('window:mousedown') onGlobalMouseDown(): void {
    this.windowListener.onGlobalMouseDown();
  }
}

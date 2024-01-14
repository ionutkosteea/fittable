import { Component, HostListener, Input, OnInit } from '@angular/core';

import { CssStyle } from 'fittable-core/model';
import {
  Window,
  WindowListener,
  createWindowListener,
} from 'fittable-core/view-model';

import { createWindowStyle } from '../common/style-functions.model';

@Component({
  selector: 'fit-popup-menu',
  template: `
    <div class="popup-menu" [ngStyle]="getWindowStyle()">
      <ng-content />
    </div>
  `,
  styleUrl: 'popup-menu.component.scss',
})
export class PopupMenuComponent implements OnInit {
  @Input({ required: true }) model!: Window;
  @Input() stopCloseMenu = false;
  private windowListener!: WindowListener;

  ngOnInit(): void {
    this.windowListener = createWindowListener(this.model);
  }

  @HostListener('mousedown', ['$event']) onMouseDown(event: MouseEvent): void {
    this.windowListener.onMouseDown(event);
  }

  @HostListener('window:mousedown') onGlobalMouseDown(): void {
    if (this.stopCloseMenu) return;
    this.windowListener.onGlobalMouseDown();
  }

  getWindowStyle(): CssStyle {
    return createWindowStyle(this.model);
  }
}

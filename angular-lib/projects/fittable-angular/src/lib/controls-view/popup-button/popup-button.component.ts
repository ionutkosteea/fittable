import { Component, input } from '@angular/core';
import { NgFor } from '@angular/common';

import { Control, PopupControl, Window } from 'fittable-core/view-model';

import { ButtonComponent } from '../button/button.component';
import { PopupMenuComponent } from '../popup-menu/popup-menu.component';

@Component({
  selector: 'fit-popup-button',
  standalone: true,
  imports: [NgFor, ButtonComponent, PopupMenuComponent],
  templateUrl: './popup-button.component.html',
  styleUrls: ['./popup-button.component.scss'],
})
export class PopupButtonComponent {
  model = input.required<PopupControl>();

  get window(): Window {
    return this.model().getWindow();
  }

  get controlIds(): string[] {
    return this.window.getControlIds();
  }

  getControl(id: string): Control {
    return this.window.getControl(id);
  }
}

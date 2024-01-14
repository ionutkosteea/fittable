import { Component, Input } from '@angular/core';
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
  @Input({ required: true }) model!: PopupControl;

  getWindow(): Window {
    return this.model.getWindow();
  }

  getControlIds(): string[] {
    return this.getWindow().getControlIds();
  }

  getControl(id: string): Control {
    return this.getWindow().getControl(id);
  }
}

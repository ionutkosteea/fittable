import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { NgStyle } from '@angular/common';

import { PopupControl, Window } from 'fittable-core/view-model';

import { ContextMenuComponent } from '../../context-menu/context-menu.component';

@Component({
  selector: 'fit-settings-button',
  standalone: true,
  imports: [NgStyle, ContextMenuComponent],
  templateUrl: './settings-button.component.html',
  styleUrls: ['./settings-button.component.scss'],
})
export class SettingsButtonComponent {
  @Input({ required: true }) model!: PopupControl;
  @ViewChild('button') buttonRef?: ElementRef;

  getIcon(): string | undefined {
    return this.model.getIcon();
  }

  getLabel(): string {
    return this.model.getLabel();
  }

  run(): void {
    this.model.run();
  }

  getWindow(): Window {
    return this.model.getWindow();
  }
}

import { Component, ElementRef, ViewChild, input } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PopupControl, Window } from 'fittable-core/view-model';

import { ContextMenuComponent } from '../../context-menu/context-menu.component';
import { SvgImgComponent } from '../../svg-img/svg-img.component';

@Component({
  selector: 'fit-settings-button',
  standalone: true,
  imports: [CommonModule, ContextMenuComponent, SvgImgComponent],
  templateUrl: './settings-button.component.html',
  styleUrls: ['./settings-button.component.scss'],
})
export class SettingsButtonComponent {
  model = input.required<PopupControl>();

  @ViewChild('button') buttonRef?: ElementRef;

  get label(): string {
    return this.model().getLabel();
  }

  get icon(): string | undefined {
    return this.model().getIcon();
  }

  get window(): Window {
    return this.model().getWindow();
  }

  run(): void {
    this.model().run();
  }
}

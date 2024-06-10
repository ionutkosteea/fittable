import { Component, ElementRef, ViewChild, inject, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

import { PopupControl, Window } from 'fittable-core/view-model';

import { ContextMenuComponent } from '../../context-menu/context-menu.component';

@Component({
  selector: 'fit-settings-button',
  standalone: true,
  imports: [CommonModule, ContextMenuComponent],
  templateUrl: './settings-button.component.html',
  styleUrls: ['./settings-button.component.scss'],
})
export class SettingsButtonComponent {
  model = input.required<PopupControl>();

  @ViewChild('button') buttonRef?: ElementRef;
  private readonly domSanitizer = inject(DomSanitizer);

  getLabel(): string {
    return this.model().getLabel();
  }

  getIcon(): SafeHtml | undefined {
    const htmlContent = this.model().getIcon();
    return htmlContent ? this.domSanitizer.bypassSecurityTrustHtml(htmlContent) : undefined;
  }

  run(): void {
    this.model().run();
  }

  getWindow(): Window {
    return this.model().getWindow();
  }
}

import { Component, ElementRef, Input, ViewChild, inject } from '@angular/core';
import { NgStyle } from '@angular/common';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

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

  private readonly domSanitizer = inject(DomSanitizer);

  getLabel(): string {
    return this.model.getLabel();
  }

  getIcon(): SafeHtml | undefined {
    const htmlContent = this.model.getIcon() ?? '';
    return this.domSanitizer.bypassSecurityTrustHtml(htmlContent);
  }

  run(): void {
    this.model.run();
  }

  getWindow(): Window {
    return this.model.getWindow();
  }
}

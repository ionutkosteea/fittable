import { Component, input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

import { CssStyle } from 'fittable-core/model';
import { Control, asToggleControl } from 'fittable-core/view-model';

import { createToggleStyle } from '../common/style-functions.model';

@Component({
  selector: 'fit-button',
  standalone: true,
  imports: [CommonModule],
  template: `
    <button
      [ngStyle]="getStyle()"
      [ngClass]="{ 'is-on': isOn() }"
      [title]="getLabel()"
      (click)="run()"
    >
      <div class="icon" [innerHTML]="getIcon()"></div>
    </button>
  `,
  styleUrl: './button.component.scss',
})
export class ButtonComponent {
  model = input.required<Control>();

  private readonly domSanitizer = inject(DomSanitizer);

  getIcon(): SafeHtml | undefined {
    const htmlContent = this.model().getIcon();
    return htmlContent ? this.domSanitizer.bypassSecurityTrustHtml(htmlContent) : undefined;
  }

  getLabel(): string {
    return this.model().getLabel();
  }

  getStyle(): CssStyle | null {
    return createToggleStyle(this.model());
  }

  isOn(): boolean {
    return asToggleControl(this.model())?.isOn() ?? false;
  }

  run(): void {
    !this.model().isDisabled() && this.model().isValid() && this.model().run();
  }
}

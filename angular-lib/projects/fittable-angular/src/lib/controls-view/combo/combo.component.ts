import { Component, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

import { CssStyle } from 'fittable-core/model';
import { Control, PopupControl, Window } from 'fittable-core/view-model';

import { createToggleStyle } from '../common/style-functions.model';
import { ContextMenuComponent } from '../context-menu/context-menu.component';

@Component({
  selector: 'fit-combo',
  standalone: true,
  imports: [CommonModule, ContextMenuComponent],
  templateUrl: './combo.component.html',
  styleUrl: './combo.component.scss',
})
export class ComboComponent {
  @Input({ required: true }) model!: PopupControl;
  @Input() controlStyleFn?: (control: Control) => CssStyle | null;
  private readonly domSanitizer = inject(DomSanitizer);

  getStyle(): CssStyle | null {
    return createToggleStyle(this.model);
  }

  getIcon(): SafeHtml | undefined {
    const htmlContent = this.model.getIcon() ?? '';
    return this.domSanitizer.bypassSecurityTrustHtml(htmlContent);
  }

  getLabel(): string {
    return this.model.getLabel();
  }

  run(): void {
    !this.model.isDisabled() && this.model.isValid() && this.model.run();
  }

  getWindow(): Window {
    return this.model.getWindow();
  }
}

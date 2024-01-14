import { Component, Input } from '@angular/core';
import { NgStyle } from '@angular/common';

import { CssStyle } from 'fittable-core/model';
import { Control, PopupControl, Window } from 'fittable-core/view-model';

import { createToggleStyle } from '../common/style-functions.model';
import { ContextMenuComponent } from '../context-menu/context-menu.component';

@Component({
  selector: 'fit-combo',
  standalone: true,
  imports: [NgStyle, ContextMenuComponent],
  templateUrl: './combo.component.html',
  styleUrl: './combo.component.scss',
})
export class ComboComponent {
  @Input({ required: true }) model!: PopupControl;
  @Input() controlStyleFn?: (control: Control) => CssStyle | null;

  getStyle(): CssStyle {
    let style: CssStyle | null = createToggleStyle(this.model);
    if (style) style['background-image'] = this.model.getIcon();
    else style = { 'background-image': this.model.getIcon() };
    return style;
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

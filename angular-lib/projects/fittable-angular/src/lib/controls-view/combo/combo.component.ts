import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CssStyle } from 'fittable-core/model';
import { Control, PopupControl, Window } from 'fittable-core/view-model';

import { createToggleStyle } from '../common/style-functions.model';
import { ContextMenuComponent } from '../context-menu/context-menu.component';
import { SvgImgComponent } from '../svg-img/svg-img.component';

@Component({
  selector: 'fit-combo',
  standalone: true,
  imports: [CommonModule, ContextMenuComponent, SvgImgComponent],
  templateUrl: './combo.component.html',
  styleUrl: './combo.component.scss',
})
export class ComboComponent {
  model = input.required<PopupControl>();
  controlStyle = input<(control: Control) => CssStyle | null>();

  get window(): Window {
    return this.model().getWindow();
  }

  get icon(): string | undefined {
    return this.model().getIcon();
  }

  get label(): string {
    return this.model().getLabel();
  }

  getStyle(): CssStyle | null {
    return createToggleStyle(this.model());
  }

  run(): void {
    !this.model().isDisabled() && this.model().isValid() && this.model().run();
  }
}

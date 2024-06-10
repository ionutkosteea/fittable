import { Component, OnDestroy, input } from '@angular/core';

import { Statusbar } from 'fittable-core/view-model';

@Component({
  selector: 'fit-statusbar',
  standalone: true,
  template: '<div class="statusbar">{{model().getText()}}</div>',
  styleUrl: './statusbar.component.scss',
})
export class StatusbarComponent implements OnDestroy {
  model = input.required<Statusbar>();

  ngOnDestroy(): void {
    this.model().destroy();
  }
}

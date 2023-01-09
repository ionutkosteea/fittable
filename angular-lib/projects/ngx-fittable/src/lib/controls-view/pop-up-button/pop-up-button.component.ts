import { Component, Input } from '@angular/core';

import { OptionsControl, WindowListener } from 'fit-core/view-model';

import { OptionsComponent } from '../common/options-component.model';

@Component({
  selector: 'fit-pop-up-button',
  templateUrl: './pop-up-button.component.html',
  styleUrls: ['./pop-up-button.component.css'],
})
export class PopUpButtonComponent extends OptionsComponent {
  @Input() override model!: OptionsControl;
  @Input() override windowListener!: WindowListener;
}

import { Component, Input } from '@angular/core';

import { WindowListener, OptionsControl } from 'fit-core/view-model';
import { OptionsComponent } from '../../common/options-component.model';

@Component({
  selector: 'fit-settings-button',
  templateUrl: './settings-button.component.html',
  styleUrls: ['./settings-button.component.css'],
})
export class SettingsButtonComponent extends OptionsComponent {
  @Input() override model!: OptionsControl;
  @Input() override windowListener!: WindowListener;
}

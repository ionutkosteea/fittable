import { Component, Input, OnInit } from '@angular/core';

import {
  WindowListener,
  createWindowListener,
  OptionsControl,
} from 'fittable-core/view-model';
import { OptionsComponent } from '../../common/options-component.model';

@Component({
  selector: 'fit-settings-button',
  templateUrl: './settings-button.component.html',
  styleUrls: ['./settings-button.component.css'],
})
export class SettingsButtonComponent
  extends OptionsComponent
  implements OnInit
{
  @Input() override model!: OptionsControl;

  public override windowListener!: WindowListener;

  public ngOnInit(): void {
    this.windowListener = createWindowListener(this.model.getWindow());
  }
}

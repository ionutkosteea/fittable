import { Component, Input, OnInit } from '@angular/core';

import {
  WindowListener,
  createWindowListener,
  PopupControl,
} from 'fittable-core/view-model';
import { PopupControlComponent } from '../../common/popup-control-component.model';

@Component({
  selector: 'fit-settings-button',
  templateUrl: './settings-button.component.html',
  styleUrls: ['./settings-button.component.css'],
})
export class SettingsButtonComponent
  extends PopupControlComponent
  implements OnInit
{
  @Input() override model!: PopupControl;

  public override windowListener!: WindowListener;

  public ngOnInit(): void {
    this.windowListener = createWindowListener(this.model.getWindow());
  }
}

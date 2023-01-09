import { Window, Control } from 'fit-core/view-model/index.js';

import { FitTextKey } from '../../../language-dictionary/language-dictionary-keys.js';
import { FitImageId } from '../../../image-registry/fit-image-registry.js';
import { ControlType } from '../../../common/view-model-utils.js';
import { FitValueControl } from '../../../common/controls/fit-value-control.js';
import { StyleCombo } from './common/style-combo.js';

export class HorizontalAlignMenu extends StyleCombo {
  protected readonly labelKey: FitTextKey = 'Horizontal align';
  protected readonly imageId: FitImageId = 'alignLeft';
  protected readonly styleAttName = 'text-align';

  public getType(): ControlType {
    return 'pop-up-button';
  }

  protected createOptionControls(): void {
    const window: Window = this.getWindow();
    const alignLeftControl: Control = new FitValueControl()
      .setLabel((): string => this.getText('Align left'))
      .setIcon((): string | undefined => this.getImageUrl('alignLeft'));
    window.addControl('align-left', alignLeftControl);
    const alignCenterControl: Control = new FitValueControl()
      .setLabel((): string => this.getText('Align center'))
      .setIcon((): string | undefined => this.getImageUrl('alignCenter'))
      .setValue('center');
    window.addControl('align-center', alignCenterControl);
    const alignRightControl: Control = new FitValueControl()
      .setLabel((): string => this.getText('Align right'))
      .setIcon((): string | undefined => this.getImageUrl('alignRight'))
      .setValue('right');
    window.addControl('align-right', alignRightControl);
  }
}

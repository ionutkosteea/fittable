import { Window, Control } from 'fit-core/view-model/index.js';

import { FitImageId } from '../../../image-registry/fit-image-ids.js';
import { FitTextKey } from '../../../language-dictionary/language-dictionary-keys.js';
import { FitValueControl } from '../../../common/controls/fit-value-control.js';
import { FitControlType } from '../../../common/controls/fit-control-type.js';
import { StyleCombo } from './common/style-combo.js';

export class VerticalAlignMenu extends StyleCombo {
  protected readonly labelKey: FitTextKey = 'Vertical align';
  protected readonly imageId: FitImageId = 'alignTop';
  protected readonly styleAttName = 'place-items';

  public getType(): FitControlType | undefined {
    return 'pop-up-button';
  }

  protected createOptionControls(): void {
    const window: Window = this.getWindow();
    const alignTopControl: Control = new FitValueControl()
      .setLabel((): string => this.getText('Align top'))
      .setIcon((): string | undefined => this.getImageUrl('alignTop'));
    window.addControl('align-top', alignTopControl);
    const alignMiddleControl: Control = new FitValueControl()
      .setLabel((): string => this.getText('Align middle'))
      .setIcon((): string | undefined => this.getImageUrl('alignMiddle'))
      .setValue('center normal');
    window.addControl('align-middle', alignMiddleControl);
    const alignBottomControl: Control = new FitValueControl()
      .setLabel((): string => this.getText('Align bottom'))
      .setIcon((): string | undefined => this.getImageUrl('alignBottom'))
      .setValue('end normal');
    window.addControl('align-bottom', alignBottomControl);
  }
}

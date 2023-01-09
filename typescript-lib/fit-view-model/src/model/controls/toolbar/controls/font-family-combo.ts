import {
  Window,
  getViewModelConfig,
  Control,
} from 'fit-core/view-model/index.js';

import { FitTextKey } from '../../../language-dictionary/language-dictionary-keys.js';
import { FitImageId } from '../../../image-registry/fit-image-registry.js';
import { ControlType } from '../../../common/view-model-utils.js';
import { StyleCombo } from './common/style-combo.js';
import { FitValueControl } from '../../../common/controls/fit-value-control.js';

export class FontFamilyCombo extends StyleCombo {
  protected readonly labelKey: FitTextKey = 'Font family';
  protected readonly imageId: FitImageId = 'arrowDown';
  protected readonly styleAttName = 'font-family';

  public getType(): ControlType | undefined {
    return 'combo';
  }

  protected createOptionControls(): void {
    const winow: Window = this.getWindow();
    for (const font of getViewModelConfig().fontFamily ?? []) {
      const fontControl: Control = new FitValueControl()
        .setLabel((): string => font.label)
        .setValue(font.value);
      winow.addControl(font.label, fontControl);
    }
  }
}

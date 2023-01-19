import {
  ControlMap,
  getViewModelConfig,
  ValueControl,
} from 'fit-core/view-model/index.js';

import { FitTextKey } from '../../../language-dictionary/language-dictionary-keys.js';
import { FitImageId } from '../../../image-registry/fit-image-ids.js';
import { FitValueControl } from '../../../common/controls/fit-value-control.js';
import { FitControlType } from '../../../common/controls/fit-control-type.js';
import { StyleCombo } from './common/style-combo.js';

export class ColorMenu extends StyleCombo {
  protected readonly labelKey: FitTextKey = 'Text color';
  protected readonly imageId: FitImageId = 'color';
  protected readonly styleAttName = 'color';

  public getType(): FitControlType | undefined {
    return 'color-picker';
  }

  protected createOptionControls(): void {
    if (Object.keys(colorControls).length <= 0) {
      colorControls = createColorControls(this.getText, this.getImageUrl);
    }
    this.getWindow().setControls(colorControls);
  }
}

export class BackgroundColorMenu extends StyleCombo {
  protected readonly labelKey: FitTextKey = 'Backgroundcolor';
  protected readonly imageId: FitImageId = 'backgroundColor';
  protected readonly styleAttName = 'background-color';

  public getType(): FitControlType | undefined {
    return 'color-picker';
  }

  protected createOptionControls(): void {
    if (Object.keys(colorControls).length <= 0) {
      colorControls = createColorControls(this.getText, this.getImageUrl);
    }
    this.getWindow().setControls(colorControls);
  }
}

export let colorControls: ControlMap = {};

export function createColorControls(
  getText: (textKey: FitTextKey) => string,
  getImageUrl: (imageId: FitImageId) => string | undefined
): ControlMap {
  const colorMap: ControlMap = {};
  const colorNoneControl: ValueControl = new FitValueControl()
    .setLabel((): string => getText('None'))
    .setIcon((): string | undefined => getImageUrl('colorNone'));
  colorMap['color-none'] = colorNoneControl;
  for (const color of getViewModelConfig().colorPalette ?? []) {
    const colorControl: ValueControl = new FitValueControl()
      .setLabel((): string => color.label)
      .setValue(color.value);
    colorMap[color.label] = colorControl;
  }
  return colorMap;
}

export function setColorControls(controls: ControlMap): void {
  colorControls = controls;
}

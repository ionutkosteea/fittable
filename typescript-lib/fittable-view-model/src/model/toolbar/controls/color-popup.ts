import { ControlArgs, getViewModelConfig } from 'fittable-core/view-model';

import {
  FitTextKey,
  getLanguageDictionary,
} from '../../language/language-def.js';
import { FitValueControl } from '../../common/controls/fit-value-control.js';
import { FitImageId } from '../../image-registry/fit-image-ids.js';
import { FitSelectorWindow } from '../../common/controls/fit-selector-window.js';
import { StyleCombo } from './common/style-combo.js';
import { getImageRegistry } from '../../image-registry/fit-image-registry.js';

export function createColorPopup(args: ControlArgs): StyleCombo {
  return new ColorPopupBuilder('color', args)
    .setTextKey('Text color')
    .setImageId('color')
    .build();
}

export function createBackgroundColorPopup(args: ControlArgs): StyleCombo {
  return new ColorPopupBuilder('background-color', args)
    .setTextKey('Background color')
    .setImageId('backgroundColor')
    .build();
}

class ColorPopupBuilder {
  private combo: StyleCombo;
  private textKey!: FitTextKey;
  private imageId!: FitImageId;

  constructor(styleAttName: string, args: ControlArgs) {
    this.combo = new StyleCombo(styleAttName, args);
  }

  public setTextKey(key: FitTextKey): this {
    this.textKey = key;
    return this;
  }

  public setImageId(id: FitImageId): this {
    this.imageId = id;
    return this;
  }

  public build(): StyleCombo {
    this.initCombo();
    createColorControls(this.combo.getWindow());
    return this.combo;
  }

  private initCombo(): void {
    this.combo
      .setType('color-picker')
      .setLabel((): string => getLanguageDictionary().getText(this.textKey))
      .setIcon((): string | undefined =>
        getImageRegistry().getUrl(this.imageId)
      );
    this.combo.setRun((): void => {
      !this.combo.isDisabled() &&
        !this.combo.getWindow().isVisible() &&
        this.combo.getWindow().setVisible(true);
    });
  }
}

export function createColorControls(window: FitSelectorWindow<string>): void {
  const colorNoneControl: FitValueControl = new FitValueControl()
    .setLabel((): string => getLanguageDictionary().getText('None'))
    .setIcon((): string | undefined => getImageRegistry().getUrl('colorNone'));
  window.addControl('color-none', colorNoneControl);
  for (const color of getViewModelConfig().colorPalette ?? []) {
    const colorControl: FitValueControl = new FitValueControl()
      .setLabel((): string => color.label)
      .setValue(color.value);
    window.addControl(color.label, colorControl);
  }
}

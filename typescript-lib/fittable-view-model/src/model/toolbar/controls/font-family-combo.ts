import { Value } from 'fittable-core/model';
import {
  ControlArgs,
  getViewModelConfig,
  Option,
} from 'fittable-core/view-model';

import { FitValueControl } from '../../common/controls/fit-value-control.js';
import { getImageRegistry } from '../../image-registry/fit-image-registry.js';
import { StyleCombo } from './common/style-combo.js';

export function createFontFamilyCombo(args: ControlArgs): StyleCombo {
  return new FontFamilyComboBuilder(args).build();
}

class FontFamilyComboBuilder {
  private combo: StyleCombo;

  constructor(args: ControlArgs) {
    this.combo = new StyleCombo('font-family', args);
  }

  public build(): StyleCombo {
    this.initCombo();
    this.createControls();
    return this.combo;
  }

  private initCombo(): void {
    this.combo
      .setType('combo')
      .setLabel((): string => {
        return this.combo.getWindow().getSelectedControl()?.getLabel() ?? '';
      })
      .setIcon((): string | undefined => getImageRegistry().getUrl('arrowDown'))
      .setRun((): void => {
        !this.combo.isDisabled() &&
          !this.combo.getWindow().isVisible() &&
          this.combo.getWindow().setVisible(true);
      });
  }

  private createControls(): void {
    const fonts: Option[] = getViewModelConfig().fontFamily ?? [];
    for (const font of fonts) {
      const control: FitValueControl = new FitValueControl()
        .setType('menu-item')
        .setLabel((): string => font.label)
        .setValueFn((): Value | undefined => {
          return font.value === fonts[0].value ? undefined : font.value;
        });
      this.combo.getWindow().addControl(font.label, control);
    }
    this.combo.getWindow().setControlId(fonts[0].label);
  }
}

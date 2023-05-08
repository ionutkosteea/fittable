import { Value } from 'fittable-core/model';
import {
  getViewModelConfig,
  Control,
  Option,
  Window,
} from 'fittable-core/view-model';

import { FitValueControl } from '../../common/controls/fit-value-control.js';
import { StyleCombo } from './common/style-combo.js';
import { FitControlArgs } from './common/fit-control-args.js';

export function createFontFamilyCombo(args: FitControlArgs): StyleCombo {
  const combo: StyleCombo = new StyleCombo(args)
    .setType('combo')
    .setLabel((): string => args.dictionary.getText('Font family'))
    .setIcon((): string | undefined =>
      args.imageRegistry.getImageUrl('arrowDown')
    )
    .setStyleAttName('font-family');
  createControls(combo.getWindow());
  return combo;
}

function createControls(window: Window): void {
  const fonts: Option[] = getViewModelConfig().fontFamily ?? [];
  for (const font of fonts) {
    const fontControl: Control = new FitValueControl()
      .setLabel((): string => font.label)
      .setValueFn((): Value | undefined => {
        return font.value === fonts[0].value ? undefined : font.value;
      });
    window.addControl(font.label, fontControl);
  }
}

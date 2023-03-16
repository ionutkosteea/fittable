import { getViewModelConfig, Control } from 'fit-core/view-model/index.js';
import { Window } from 'fit-core/view-model/index.js';

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
  for (const font of getViewModelConfig().fontFamily ?? []) {
    const fontControl: Control = new FitValueControl()
      .setLabel((): string => font.label)
      .setValue(font.value);
    window.addControl(font.label, fontControl);
  }
}

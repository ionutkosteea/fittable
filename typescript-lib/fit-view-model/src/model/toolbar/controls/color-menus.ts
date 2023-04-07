import {
  ControlMap,
  getViewModelConfig,
  ValueControl,
} from 'fit-core/view-model/index.js';

import { FitValueControl } from '../../common/controls/fit-value-control.js';
import { StyleCombo } from './common/style-combo.js';
import { FitControlArgs } from './common/fit-control-args.js';

export function createColorMenu(args: FitControlArgs): StyleCombo {
  const combo: StyleCombo = new StyleCombo(args)
    .setType('color-picker')
    .setLabel((): string => args.dictionary.getText('Text color'))
    .setIcon((): string | undefined => args.imageRegistry.getImageUrl('color'))
    .setStyleAttName('color');
  combo.getWindow().setControls(createColorControls(args));
  return combo;
}

export function createBackgroundColorMenu(args: FitControlArgs): StyleCombo {
  const combo: StyleCombo = new StyleCombo(args)
    .setType('color-picker')
    .setLabel((): string => args.dictionary.getText('Backgroundcolor'))
    .setIcon((): string | undefined =>
      args.imageRegistry.getImageUrl('backgroundColor')
    )
    .setStyleAttName('background-color');
  combo.getWindow().setControls(createColorControls(args));
  return combo;
}

export function createColorControls(args: FitControlArgs): ControlMap {
  const colorMap: ControlMap = {};
  const colorNoneControl: ValueControl = new FitValueControl()
    .setLabel((): string => args.dictionary.getText('None'))
    .setIcon((): string | undefined =>
      args.imageRegistry.getImageUrl('colorNone')
    );
  colorMap['color-none'] = colorNoneControl;
  for (const color of getViewModelConfig().colorPalette ?? []) {
    const colorControl: ValueControl = new FitValueControl()
      .setLabel((): string => color.label)
      .setValue(color.value);
    colorMap[color.label] = colorControl;
  }
  return colorMap;
}

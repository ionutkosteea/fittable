import { Window, Control } from 'fittable-core/view-model';

import { FitValueControl } from '../../common/controls/fit-value-control.js';
import { StyleCombo } from './common/style-combo.js';
import { FitControlArgs } from './common/fit-control-args.js';

export function createVerticalAlignMenu(args: FitControlArgs): StyleCombo {
  const combo: StyleCombo = new StyleCombo(args)
    .setType('popup-button')
    .setLabel((): string => args.dictionary.getText('Vertical align'))
    .setIcon((): string | undefined =>
      args.imageRegistry.getImageUrl('alignTop')
    )
    .setStyleAttName('place-items');
  createControls(args, combo.getWindow());
  return combo;
}

function createControls(args: FitControlArgs, window: Window): void {
  const alignLeftControl: Control = new FitValueControl()
    .setLabel((): string => args.dictionary.getText('Align top'))
    .setIcon((): string | undefined =>
      args.imageRegistry.getImageUrl('alignTop')
    );
  window.addControl('align-top', alignLeftControl);
  const alignCenterControl: Control = new FitValueControl()
    .setLabel((): string => args.dictionary.getText('Align middle'))
    .setIcon((): string | undefined =>
      args.imageRegistry.getImageUrl('alignMiddle')
    )
    .setValue('center normal');
  window.addControl('align-middle', alignCenterControl);
  const alignRightControl: Control = new FitValueControl()
    .setLabel((): string => args.dictionary.getText('Align bottom'))
    .setIcon((): string | undefined =>
      args.imageRegistry.getImageUrl('alignBottom')
    )
    .setValue('end normal');
  window.addControl('align-bottom', alignRightControl);
}

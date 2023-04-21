import { Window, Control } from 'fittable-core/view-model/index.js';

import { FitValueControl } from '../../common/controls/fit-value-control.js';
import { StyleCombo } from './common/style-combo.js';
import { FitControlArgs } from './common/fit-control-args.js';

export function createHorizontalAlignMenu(args: FitControlArgs): StyleCombo {
  const combo: StyleCombo = new StyleCombo(args)
    .setType('pop-up-button')
    .setLabel((): string => args.dictionary.getText('Horizontal align'))
    .setIcon((): string | undefined =>
      args.imageRegistry.getImageUrl('alignLeft')
    )
    .setStyleAttName('text-align');
  createControls(args, combo.getWindow());
  return combo;
}

function createControls(args: FitControlArgs, window: Window): void {
  const alignLeftControl: Control = new FitValueControl()
    .setLabel((): string => args.dictionary.getText('Align left'))
    .setIcon((): string | undefined =>
      args.imageRegistry.getImageUrl('alignLeft')
    );
  window.addControl('align-left', alignLeftControl);
  const alignCenterControl: Control = new FitValueControl()
    .setLabel((): string => args.dictionary.getText('Align center'))
    .setIcon((): string | undefined =>
      args.imageRegistry.getImageUrl('alignCenter')
    )
    .setValue('center');
  window.addControl('align-center', alignCenterControl);
  const alignRightControl: Control = new FitValueControl()
    .setLabel((): string => args.dictionary.getText('Align right'))
    .setIcon((): string | undefined =>
      args.imageRegistry.getImageUrl('alignRight')
    )
    .setValue('right');
  window.addControl('align-right', alignRightControl);
}

import { createStyle } from 'fit-core/model/index.js';

import { StylePushButton } from '../controls/common/style-push-button.js';
import { FitControlArgs } from './common/fit-control-args.js';

export function createBoldButton(args: FitControlArgs): StylePushButton {
  const button: StylePushButton = new StylePushButton(args)
    .setType('push-button')
    .setLabel((): string => args.dictionary.getText('Bold'))
    .setStyle(createStyle().set('font-weight', 'bold'));
  button.setIcon((): string | undefined => {
    return button.isPushed()
      ? args.imageRegistry.getImageUrl('boldBlue')
      : args.imageRegistry.getImageUrl('bold');
  });
  return button;
}

export function createItalicButton(args: FitControlArgs): StylePushButton {
  const button: StylePushButton = new StylePushButton(args)
    .setType('push-button')
    .setLabel((): string => args.dictionary.getText('Italic'))
    .setStyle(createStyle().set('font-style', 'italic'));
  button.setIcon((): string | undefined => {
    return button.isPushed()
      ? args.imageRegistry.getImageUrl('italicBlue')
      : args.imageRegistry.getImageUrl('italic');
  });
  return button;
}

export function createUnderlineButton(args: FitControlArgs): StylePushButton {
  const button: StylePushButton = new StylePushButton(args)
    .setType('push-button')
    .setLabel((): string => args.dictionary.getText('Underline'))
    .setStyle(createStyle().set('text-decoration', 'underline'));
  button.setIcon((): string | undefined => {
    return button.isPushed()
      ? args.imageRegistry.getImageUrl('underlineBlue')
      : args.imageRegistry.getImageUrl('underline');
  });
  return button;
}

export function createStrikeButton(args: FitControlArgs): StylePushButton {
  const button: StylePushButton = new StylePushButton(args)
    .setType('push-button')
    .setLabel((): string => args.dictionary.getText('Strike'))
    .setStyle(createStyle().set('text-decoration', 'line-through'));
  button.setIcon((): string | undefined => {
    return button.isPushed()
      ? args.imageRegistry.getImageUrl('strikeBlue')
      : args.imageRegistry.getImageUrl('strike');
  });
  return button;
}

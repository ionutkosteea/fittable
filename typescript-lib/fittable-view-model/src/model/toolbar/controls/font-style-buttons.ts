import { createStyle } from 'fittable-core/model';
import { ControlArgs } from 'fittable-core/view-model';

import { getLanguageDictionary } from '../../language/language-def.js';
import { getImageRegistry } from '../../image-registry/fit-image-registry.js';
import { StylePushButton } from './common/style-push-button.js';

export function createBoldButton(args: ControlArgs): StylePushButton {
  const button: StylePushButton = new StylePushButton(args)
    .setType('button')
    .setLabel((): string => getLanguageDictionary().getText('Bold'))
    .setStyle(createStyle().set('font-weight', 'bold'));
  button.setIcon((): string | undefined => {
    return button.isPushed()
      ? getImageRegistry().getUrl('boldBlue')
      : getImageRegistry().getUrl('bold');
  });
  return button;
}

export function createItalicButton(args: ControlArgs): StylePushButton {
  const button: StylePushButton = new StylePushButton(args)
    .setType('button')
    .setLabel((): string => getLanguageDictionary().getText('Italic'))
    .setStyle(createStyle().set('font-style', 'italic'));
  button.setIcon((): string | undefined => {
    return button.isPushed()
      ? getImageRegistry().getUrl('italicBlue')
      : getImageRegistry().getUrl('italic');
  });
  return button;
}

export function createUnderlineButton(args: ControlArgs): StylePushButton {
  const button: StylePushButton = new StylePushButton(args)
    .setType('button')
    .setLabel((): string => getLanguageDictionary().getText('Underline'))
    .setStyle(createStyle().set('text-decoration', 'underline'));
  button.setIcon((): string | undefined => {
    return button.isPushed()
      ? getImageRegistry().getUrl('underlineBlue')
      : getImageRegistry().getUrl('underline');
  });
  return button;
}

export function createStrikeButton(args: ControlArgs): StylePushButton {
  const button: StylePushButton = new StylePushButton(args)
    .setType('button')
    .setLabel((): string => getLanguageDictionary().getText('Strike'))
    .setStyle(createStyle().set('text-decoration', 'line-through'));
  button.setIcon((): string | undefined => {
    return button.isPushed()
      ? getImageRegistry().getUrl('strikeBlue')
      : getImageRegistry().getUrl('strike');
  });
  return button;
}

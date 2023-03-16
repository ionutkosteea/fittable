import { MissingFactoryError } from '../../common/factory-error.js';
import { getViewModelConfig } from '../view-model-config.js';
import { Container } from './controls.js';
import { ImageRegistry } from './image-registry.js';
import { LanguageDictionary } from './language-dictionary.js';
import { ThemeSwitcher } from './theme-switcher.js';

export type SettingsBarArgs = {
  dictionary: LanguageDictionary;
  imageRegistry: ImageRegistry;
  themeSwitcher?: ThemeSwitcher;
};

export interface SettingsBarFactory {
  createSettingsBar(args: SettingsBarArgs): Container;
}

export function createSettingsBar(args: SettingsBarArgs): Container {
  const factory: SettingsBarFactory | undefined =
    getViewModelConfig().settingsBarFactory;
  if (factory) return factory.createSettingsBar(args);
  else throw new MissingFactoryError();
}

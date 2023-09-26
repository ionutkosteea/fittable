import { MissingFactoryError } from '../../common/factory-error.js';
import { getViewModelConfig } from '../view-model-config.js';
import { Container } from './controls.js';
import { ThemeSwitcher } from './theme-switcher.js';

export interface SettingsBarFactory {
  createSettingsBar(
    themeSwitcher: ThemeSwitcher | undefined,
    reloadTableLocalsFn: (locale: string) => void
  ): Container;
}

export function createSettingsBar(
  themeSwitcher: ThemeSwitcher | undefined,
  reloadTableLocalsFn: (locale: string) => void
): Container {
  const factory: SettingsBarFactory | undefined =
    getViewModelConfig().settingsBarFactory;
  if (factory) {
    return factory.createSettingsBar(themeSwitcher, reloadTableLocalsFn);
  } else {
    throw new MissingFactoryError();
  }
}

import { getViewModelConfig } from '../view-model-config.js';
import { Images, ImageRegistry } from './image-registry.js';

export type CssVariables = { [name: string]: string };

export interface Theme {
  cssVariables: CssVariables;
  images: Images;
}

export interface ThemeSwitcher {
  registerTheme(name: string, theme: Theme): this;
  getThemeNames(): string[];
  getTheme(name: string): Theme | undefined;
  switch(name: string): this;
  getCurrentThemeName(): string | undefined;
}

export interface ThemeSwitcherFactory {
  createThemeSwitcher(imageRegistry: ImageRegistry): ThemeSwitcher;
}

export function createThemeSwitcher(
  imageRegistry: ImageRegistry
): ThemeSwitcher {
  const factory: ThemeSwitcherFactory | undefined =
    getViewModelConfig().themeSwitcherFactory;
  if (factory) {
    return factory.createThemeSwitcher(imageRegistry);
  } else {
    throw new Error('ThemeSwitcherFactory is not defined!');
  }
}

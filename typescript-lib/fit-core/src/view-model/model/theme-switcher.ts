import { getViewModelConfig } from '../view-model-config.js';
import { Images, ImageRegistry } from './image-registry.js';

export type CssVariables = { [name: string]: string };

export interface Theme {
  cssVariables: CssVariables;
  images: Images;
}

export interface ThemeSwitcher<ThemeName extends string> {
  registerTheme(name: ThemeName, theme: Theme): this;
  getThemeNames(): ThemeName[];
  switch(name: ThemeName): this;
  getCurrentThemeName(): ThemeName | undefined;
}

export interface ThemeSwitcherFactory {
  createThemeSwitcher(
    imageRegistry: ImageRegistry<string>
  ): ThemeSwitcher<string>;
}

export function createThemeSwitcher<ThemeName extends string>(
  imageRegistry: ImageRegistry<string>
): ThemeSwitcher<ThemeName> {
  const factory: ThemeSwitcherFactory | undefined =
    getViewModelConfig().themeSwitcherFactory;
  if (factory) {
    return factory.createThemeSwitcher(
      imageRegistry
    ) as ThemeSwitcher<ThemeName>;
  } else {
    throw new Error('ThemeSwitcherFactory is not defined!');
  }
}

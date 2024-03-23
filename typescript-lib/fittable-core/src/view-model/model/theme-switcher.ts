import { MissingFactoryError } from '../../common/factory-error.js';
import { getViewModelConfig } from '../view-model-config.js';

export type CssVariables = { [name: string]: string };

export interface Theme {
  cssVariables: CssVariables;
}

export interface ThemeSwitcher {
  registerTheme(name: string, theme: Theme): this;
  getThemeNames(): string[];
  getTheme(name: string): Theme | undefined;
  switch(name: string): this;
  getCurrentThemeName(): string | undefined;
}

export interface ThemeSwitcherFactory {
  createThemeSwitcher(): ThemeSwitcher;
}

export function createThemeSwitcher(): ThemeSwitcher {
  const factory: ThemeSwitcherFactory | undefined =
    getViewModelConfig().themeSwitcherFactory;
  if (factory) {
    return factory.createThemeSwitcher();
  } else {
    throw new MissingFactoryError();
  }
}

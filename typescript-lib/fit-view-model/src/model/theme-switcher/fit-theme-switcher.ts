import {
  ImageRegistry,
  Theme,
  ThemeSwitcher,
  ThemeSwitcherFactory,
} from 'fit-core/view-model/index.js';

import { setCssVariables } from '../common/css-variables.js';
import { lightTheme } from './light-theme/theme.js';
import { darkTheme } from './dark-theme/theme.js';

export type FitThemeName = 'Light mode' | 'Dark mode';

export class FitThemeSwitcher implements ThemeSwitcher {
  private currentThemeName?: FitThemeName;
  private readonly themes: { [name in FitThemeName]?: Theme } = {};

  constructor(private readonly imageRegistry: ImageRegistry) {}

  public registerTheme(name: FitThemeName, theme: Theme): this {
    this.themes[name] = theme;
    return this;
  }

  public getThemeNames(): FitThemeName[] {
    return Object.keys(this.themes) as FitThemeName[];
  }

  public getTheme(name: FitThemeName): Theme | undefined {
    return this.themes[name];
  }

  public switch(name: FitThemeName): this {
    const theme: Theme | undefined = this.themes[name];
    if (!theme) throw new Error('Invalid theme name ' + name);
    this.imageRegistry.setImages(theme.images);
    setCssVariables(theme.cssVariables);
    this.currentThemeName = name;
    return this;
  }

  public getCurrentThemeName(): FitThemeName | undefined {
    return this.currentThemeName;
  }
}

export class FitThemeSwitcherFactory implements ThemeSwitcherFactory {
  public createThemeSwitcher(imageRegistry: ImageRegistry): FitThemeSwitcher {
    return new FitThemeSwitcher(imageRegistry)
      .registerTheme('Light mode', lightTheme)
      .registerTheme('Dark mode', darkTheme)
      .switch('Light mode');
  }
}

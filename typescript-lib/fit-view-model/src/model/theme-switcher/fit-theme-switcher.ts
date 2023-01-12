import {
  ImageRegistry,
  Theme,
  ThemeSwitcher,
  ThemeSwitcherFactory,
} from 'fit-core/view-model/index.js';

import { setCssVariables } from '../common/css-variables.js';
import { lightTheme } from './light-theme/theme.js';
import { darkTheme } from './dark-theme/theme.js';

export class FitThemeSwitcher implements ThemeSwitcher {
  private currentThemeName?: ThemeName;
  private readonly themes: { [name in ThemeName]?: Theme } = {};

  constructor(private readonly imageRegistry: ImageRegistry) {}

  public registerTheme(name: ThemeName, theme: Theme): this {
    this.themes[name] = theme;
    return this;
  }

  public getThemeNames(): ThemeName[] {
    return Object.keys(this.themes) as ThemeName[];
  }

  public switch(name: ThemeName): this {
    const theme: Theme | undefined = this.themes[name];
    if (!theme) throw new Error('Invalid theme name ' + name);
    this.imageRegistry.setImages(theme.images);
    setCssVariables(theme.cssVariables);
    this.currentThemeName = name;
    return this;
  }

  public getCurrentThemeName(): ThemeName | undefined {
    return this.currentThemeName;
  }
}

export type ThemeName = 'Light mode' | 'Dark mode';

export class FitThemeSwitcherFactory implements ThemeSwitcherFactory {
  public createThemeSwitcher(imageRegistry: ImageRegistry): FitThemeSwitcher {
    return new FitThemeSwitcher(imageRegistry)
      .registerTheme('Light mode', lightTheme)
      .registerTheme('Dark mode', darkTheme)
      .switch('Light mode');
  }
}

import { SettingsBarFactory, ThemeSwitcher } from 'fittable-core/view-model';

import { FitContainer } from '../common/controls/fit-container.js';
import { FitControl } from '../common/controls/fit-control.js';
import { FitPopupControl } from '../common/controls/fit-popup-control.js';
import { FitValueControl } from '../common/controls/fit-value-control.js';
import { FitWindow } from '../common/controls/fit-window.js';
import { FitThemeName } from '../theme-switcher/fit-theme-switcher.js';
import { FitLocale, getLanguageDictionary } from '../language/language-def.js';
import { getImageRegistry } from '../image-registry/fit-image-registry.js';

export type FitSettingsBarControlId =
  | 'settings-button'
  | 'language-label'
  | 'theme-label'
  | FitLocale
  | FitThemeName;

export class FitSettingsBarBuilder {
  constructor(
    private readonly themeSwitcher: ThemeSwitcher,
    private readonly reloadTableLocalesFn: (locale: string) => void
  ) { }

  public build(): FitContainer<FitSettingsBarControlId> {
    return new FitContainer<FitSettingsBarControlId>()
      .addControl('settings-button', this.createButton());
  }

  private createButton(): FitPopupControl<string> {
    const window: FitWindow<string> = this.createWindow();
    const button: FitPopupControl<string> = new FitPopupControl(window)
      .setLabel((): string => getLanguageDictionary().getText('Settings'))
      .setIcon((): string | undefined => getImageRegistry().getUrl('settings'))
      .setRun((): void => {
        window.setVisible(true);
      });
    return button;
  }

  private createWindow(): FitWindow<string> {
    const window: FitWindow<FitSettingsBarControlId> = new FitWindow();
    this.addLocales(window);
    this.addThemes(window);
    return window;
  }

  private addLocales(window: FitWindow<FitSettingsBarControlId>): void {
    const controls: FitControl = new FitControl()
      .setType('label')
      .setLabel((): string => getLanguageDictionary().getText('Languages'));
    window.addControl('language-label', controls);
    for (const locale of getLanguageDictionary().getAllLocales()) {
      const control: FitValueControl = new FitValueControl()
        .setType('menu-item')
        .setLabel((): string => getLanguageDictionary().getText(locale))
        .setValue(locale)
        .setRun((): void => {
          this.reloadTableLocalesFn(locale);
          window.setVisible(false);
        });
      control.setIcon((): string | undefined => {
        return control.getValue() === getLanguageDictionary().getLocale()
          ? getImageRegistry().getUrl('check')
          : undefined;
      });
      window.addControl(locale, control);
    }
  }

  private addThemes(window: FitWindow<FitSettingsBarControlId>): void {
    if (!this.themeSwitcher) return;
    const themeSwitcher: FitControl = new FitControl()
      .setType('label')
      .setLabel((): string => getLanguageDictionary().getText('Color themes'));
    window.addControl('theme-label', themeSwitcher);
    for (const name of this.themeSwitcher.getThemeNames()) {
      const themeName: FitThemeName = name as FitThemeName;
      const theme: FitValueControl = new FitValueControl()
        .setType('menu-item')
        .setLabel((): string => getLanguageDictionary().getText(themeName))
        .setValue(themeName)
        .setRun((): void => {
          this.themeSwitcher?.switch(themeName);
          window.setVisible(false);
        });
      theme.setIcon((): string | undefined => {
        return theme.getValue() === this.themeSwitcher?.getCurrentThemeName()
          ? getImageRegistry().getUrl('check')
          : undefined;
      });
      window.addControl(themeName, theme);
    }
  }
}

export class FitSettingsBarFactory implements SettingsBarFactory {
  public createSettingsBar(
    themeSwitcher: ThemeSwitcher,
    reloadTableFn: (locale: string) => void
  ): FitContainer<string> {
    return new FitSettingsBarBuilder(themeSwitcher, reloadTableFn).build();
  }
}

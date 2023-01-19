import {
  SettingsBarArgs,
  SettingsBarFactory,
} from 'fit-core/view-model/index.js';

import { FitContainer } from '../../common/controls/fit-container.js';
import { FitControl } from '../../common/controls/fit-control.js';
import { FitOptionsControl } from '../../common/controls/fit-options-control.js';
import { FitValueControl } from '../../common/controls/fit-value-control.js';
import { FitWindow } from '../../common/controls/fit-window.js';
import { FitImageId } from '../../image-registry/fit-image-ids.js';
import {
  FitLanguageCode,
  FitTextKey,
} from '../../language-dictionary/language-dictionary-keys.js';
import { FitThemeName } from '../../theme-switcher/fit-theme-switcher.js';

export type FitSettingsBarControlId =
  | 'settings-button'
  | 'language-label'
  | 'theme-label'
  | FitLanguageCode
  | FitThemeName;

export class FitSettingsBarBuilder {
  constructor(private readonly args: SettingsBarArgs) {}

  public build(): FitContainer<FitSettingsBarControlId> {
    return new FitContainer<FitSettingsBarControlId>() //
      .addControl('settings-button', this.createButton());
  }

  private createButton(): FitOptionsControl {
    const window: FitWindow<string> = this.createWindow();
    const button: FitOptionsControl = new FitOptionsControl(window) //
      .setLabel((): string => this.getText('Settings'))
      .setIcon((): string | undefined => this.getImageUrl('settings'));
    return button;
  }

  private createWindow(): FitWindow<string> {
    const window: FitWindow<FitSettingsBarControlId> = new FitWindow();
    this.addLanguages(window);
    this.addThemes(window);
    return window;
  }

  private addLanguages(window: FitWindow<FitSettingsBarControlId>): void {
    const languages: FitControl = new FitControl()
      .setType('label')
      .setLabel((): string => this.getText('Languages'));
    window.addControl('language-label', languages);
    for (const lang of this.args.dictionary.getRegisteredLanguages()) {
      const language: FitValueControl = new FitValueControl()
        .setLabel((): string => this.getText(lang as FitTextKey))
        .setValue(lang)
        .setRun((): void => {
          this.args.dictionary.setCurrentLanguage(lang);
        });
      language.setIcon((): string | undefined => {
        return language.getValue() === this.args.dictionary.getCurrentLanguage()
          ? this.getImageUrl('check')
          : undefined;
      });
      window.addControl(lang as FitLanguageCode, language);
    }
  }

  private addThemes(window: FitWindow<FitSettingsBarControlId>): void {
    if (!this.args.themeSwitcher) return;
    const themeSwitcher: FitControl = new FitControl()
      .setType('label')
      .setLabel((): string => this.getText('Color themes'));
    window.addControl('theme-label', themeSwitcher);
    for (const themeName of this.args.themeSwitcher.getThemeNames()) {
      const theme: FitValueControl = new FitValueControl()
        .setLabel((): string => this.getText(themeName as FitTextKey))
        .setValue(themeName)
        .setRun((): void => {
          this.args.themeSwitcher?.switch(themeName);
        });
      theme.setIcon((): string | undefined => {
        return theme.getValue() ===
          this.args.themeSwitcher?.getCurrentThemeName()
          ? this.getImageUrl('check')
          : undefined;
      });
      window.addControl(themeName as FitThemeName, theme);
    }
  }

  private readonly getText = (key: FitTextKey): string =>
    this.args.dictionary.getText(key);

  private readonly getImageUrl = (id: FitImageId): string | undefined =>
    this.args.imageRegistry.getImageUrl(id);
}

export class FitSettingsBarFactory implements SettingsBarFactory {
  public createSettingsBar(args: SettingsBarArgs): FitContainer<string> {
    return new FitSettingsBarBuilder(args).build();
  }
}

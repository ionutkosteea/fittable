import { Component, OnInit } from '@angular/core';

import { createTable, registerModelConfig } from 'fit-core/model';
import { registerOperationConfig } from 'fit-core/operations';
import {
  createFittableDesigner,
  FittableDesigner,
  registerViewModelConfig,
} from 'fit-core/view-model';
import { FIT_MODEL_CONFIG } from 'fit-model';
import { FIT_OPERATION_CONFIG } from 'fit-model-operations';
import {
  createFitViewModelConfig,
  FitLanguageCode,
  FitTextKey,
} from 'fit-view-model';

import { TopicTitle } from '../../common/topic-title.model';
import { CodeSnippet } from '../common/code-snippet.model';
import { Button, ConsoleTopic } from './common/console-topic.model';

@Component({
  selector: 'language-dictionary',
  templateUrl: './common/console-topic.html',
  styleUrls: ['./common/console-topic.css', '../common/common.css'],
})
export class LanguageDictionaryComponent implements ConsoleTopic, OnInit {
  public readonly title: TopicTitle = 'Language dictionary';
  public readonly htmlCode: CodeSnippet[] = [
    { image: 'fittable-component-html.jpg' },
  ];
  public readonly typescriptCode: CodeSnippet[] = [
    { image: 'language-dictionary-ts-01.jpg' },
    { image: 'language-dictionary-ts-02.jpg' },
    { image: 'language-dictionary-ts-03.jpg' },
    { image: 'language-dictionary-ts-04.jpg' },
    { image: 'language-dictionary-ts-05.jpg' },
  ];
  public readonly buttons: Button[] = [];
  public fit!: FittableDesigner;

  public ngOnInit(): void {
    // The register functions should be called, in most cases, from the Angular main module.
    registerModelConfig(FIT_MODEL_CONFIG);
    registerOperationConfig(FIT_OPERATION_CONFIG);
    registerViewModelConfig(
      createFitViewModelConfig({
        settingsBar: true,
        cellSelection: true,
        contextMenu: true,
        statusbar: true,
      })
    );

    this.fit = createFittableDesigner(createTable(5, 5));

    this.setFrenchAsCurrentLanguage();
    this.createButtons();
  }

  private setFrenchAsCurrentLanguage(): void {
    const french: CustomLanguageCode = 'fr-FR';
    this.fit.viewModel.dictionary
      .registerLanguage(french, frFr)
      .setCurrentLanguage(french);
  }

  private createButtons(): void {
    this.buttons.push(this.createEnglishButton());
    this.buttons.push(this.createGermanButton());
    this.buttons.push(this.createFrenchButton());
  }

  private createEnglishButton(): Button {
    return {
      getLabel: (): string => 'English',
      run: (): void => {
        const lang: CustomLanguageCode = 'en-US';
        this.fit.viewModel.dictionary.setCurrentLanguage(lang);
      },
    };
  }

  private createGermanButton(): Button {
    return {
      getLabel: (): string => 'German',
      run: (): void => {
        const lang: CustomLanguageCode = 'de-DE';
        this.fit.viewModel.dictionary.setCurrentLanguage(lang);
      },
    };
  }

  private createFrenchButton(): Button {
    return {
      getLabel: (): string => 'French',
      run: (): void => {
        const lang: CustomLanguageCode = 'fr-FR';
        this.fit.viewModel.dictionary.setCurrentLanguage(lang);
      },
    };
  }

  public getConsoleText(): string {
    return (
      'Current language: ' + this.fit.viewModel.dictionary.getCurrentLanguage()
    );
  }
}

type CustomLanguageCode = FitLanguageCode | 'fr-FR';
type CustomTextKey = FitTextKey | 'fr-FR';
type CustomDictionary = { [key in CustomTextKey]?: string };

const frFr: CustomDictionary = {
  'Clear cells': 'Effacer les cellules',
  'Remove cells': 'Supprimer des cellules',
  'Cut cells': 'Cellules coupées',
  'Copy cells': 'Copier des cellules',
  'Paste cells': 'Coller des cellules',
  'Merge cells': 'Fusionner des cellules',
  'Unmerge cells': 'Annuler la fusion des cellules',
  'Resize rows': 'Redimensionner les lignes',
  'Insert rows above': 'Insérer des lignes au-dessus',
  'Insert rows below': 'Insérer des lignes ci-dessous',
  'Remove rows': 'Supprimer des lignes',
  'Resize columns': 'Redimensionner les colonnes',
  'Insert columns left': 'Insérer des colonnes à gauche',
  'Insert columns right': 'Insérer des colonnes à droite',
  'Remove columns': 'Supprimer des colonnes',
  None: 'Aucun',
  'Align top': 'Aligner en haut',
  'Align middle': 'Aligner au milieu',
  'Align bottom': 'Aligner en bas',
  'Align left': 'Alignez à gauche',
  'Align center': 'Aligner le centre',
  'Align right': 'Aligner à droite',
  Undo: 'annuler',
  Redo: 'Refaire',
  'Paint format': 'Format peinture',
  Bold: 'Audacieux',
  Italic: 'Italique',
  Underline: 'Souligner',
  Strike: 'Frapper',
  'Font size': 'Taille de police',
  'Font family': 'Famille de polices',
  'Text color': 'Couleur du texte',
  Backgroundcolor: "Couleur de l'arrière plan",
  'Vertical align': 'Alignement vertical',
  'Horizontal align': 'Alignement horizontal',
  'en-US': 'Anglais',
  'de-DE': 'Allemand',
  'fr-FR': 'Français',
  'Light mode': 'Mode lumière',
  'Dark mode': 'Mode sombre',
  Settings: 'Paramètres',
  Languages: 'Langages',
  'Color themes': 'Thèmes de couleur',
  Rows: 'Lignes',
  Columns: 'Colonnes',
};

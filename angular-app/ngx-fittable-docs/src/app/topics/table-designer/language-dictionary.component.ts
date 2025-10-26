import { Component, OnInit } from '@angular/core';

import {
  createDataType,
  createTable,
  getLanguageDictionary,
  registerModelConfig,
} from 'fittable-core/model';
import { registerOperationConfig } from 'fittable-core/operations';
import {
  createTableDesigner,
  TableDesigner,
  registerViewModelConfig,
} from 'fittable-core/view-model';
import {
  FIT_MODEL_CONFIG,
  FitLocale,
  FitTextKey as FitModelTextKey,
  FitTable,
} from 'fittable-model';
import { FIT_OPERATION_CONFIG } from 'fittable-model-operations';
import {
  FitTextKey as FitViewModelTextKey,
  createFitViewModelConfig,
} from 'fittable-view-model';

import { TopicTitle } from '../../common/topic-title.model';
import { CodeSnippet } from '../common/code-snippet.model';
import { Button, ConsoleTopic } from './common/console-topic.model';

@Component({
  selector: 'language-dictionary',
  templateUrl: './common/console-topic.html',
  styleUrls: ['../common/common.css'],
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
  ];
  public readonly buttons: Button[] = [];
  public fit!: TableDesigner;
  private table?: FitTable;

  public ngOnInit(): void {
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

    const locale: CustomLocale = 'fr-FR';
    getLanguageDictionary().register(locale, frFr);

    this.table = createTable<FitTable>()
      .setLocale(locale)
      .setCellValue(1, 1, 1000.123)
      .setCellDataType(1, 1, createDataType('number', '# #,00'))
      .setCellValue(1, 2, true)
      .setCellValue(1, 3, false);

    this.fit = createTableDesigner(this.table);

    this.createButtons();
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
        const locale: CustomLocale = 'en-US';
        this.table?.setLocale(locale);
      },
    };
  }

  private createGermanButton(): Button {
    return {
      getLabel: (): string => 'German',
      run: (): void => {
        const locale: CustomLocale = 'de-DE';
        this.table?.setLocale(locale);
      },
    };
  }

  private createFrenchButton(): Button {
    return {
      getLabel: (): string => 'French',
      run: (): void => {
        const locale: CustomLocale = 'fr-FR';
        this.table?.setLocale(locale);
      },
    };
  }

  public getConsoleText(): string {
    return 'Current locale: ' + getLanguageDictionary().getLocale();
  }
}

type CustomLocale = FitLocale | 'fr-FR';
type CustomTextKey = FitModelTextKey | FitViewModelTextKey | 'fr-FR';
type CustomDictionary = { [key in CustomTextKey]?: string };

const frFr: CustomDictionary = {
  thousandSeparator: ' ',
  decimalPoint: ',',
  TRUE: 'VRAI',
  FALSE: 'FAUX',
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
  'Background color': "Couleur de l'arrière plan",
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

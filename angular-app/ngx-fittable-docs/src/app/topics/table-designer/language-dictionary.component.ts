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
  FitDataType,
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
    { image: 'language-dictionary-ts-05.jpg' },
    { image: 'language-dictionary-ts-06.jpg' },
  ];
  public readonly buttons: Button[] = [];
  public fit!: TableDesigner;
  private table!: FitTable;

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

    this.initFrDictionary();
    this.fit = this.createTableDesigner();
    this.createButtons();
  }

  private initFrDictionary(): void {
    const dictionary = getLanguageDictionary();
    dictionary.register(frFR, frDictionary);
    dictionary.setLocale(enUS).setText(frFR, 'French');
    dictionary.setLocale(deDE).setText(frFR, 'Französisch');
    dictionary.setLocale(frFR).setText(frFR, 'Français');
  }

  private createTableDesigner(): TableDesigner {
    this.table = createTable<FitTable>()
      .setLocale(frFR)
      .setCellValue(1, 1, 1000.123)
      .setCellDataType(1, 1, createDataType<FitDataType>('number', '# #,00'))
      .setCellValue(1, 2, true)
      .setCellValue(1, 3, false);
    return createTableDesigner(this.table);
  }

  private createButtons(): void {
    this.buttons.push(this.createEnglishButton());
    this.buttons.push(this.createGermanButton());
    this.buttons.push(this.createFrenchButton());
  }

  private createEnglishButton(): Button {
    return {
      getLabel: (): string => 'English',
      run: () => this.table.setLocale(enUS)
    };
  }

  private createGermanButton(): Button {
    return {
      getLabel: (): string => 'German',
      run: () => this.table.setLocale(deDE)
    };
  }

  private createFrenchButton(): Button {
    return {
      getLabel: (): string => 'French',
      run: () => this.table.setLocale(frFR)
    };
  }

  public getConsoleText(): string {
    return 'Current locale: ' + getLanguageDictionary().getLocale();
  }
}

const enUS = 'en-US';
const deDE = 'de-DE';
const frFR = 'fr-FR';

type FitTextKey = FitModelTextKey | FitViewModelTextKey;
type FitDictionary = { [key in FitTextKey]?: string };

const frDictionary: FitDictionary = {
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
  'Light mode': 'Mode lumière',
  'Dark mode': 'Mode sombre',
  Settings: 'Paramètres',
  Languages: 'Langages',
  'Color themes': 'Thèmes de couleur',
  Rows: 'Lignes',
  Columns: 'Colonnes',
};

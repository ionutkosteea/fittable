import {
  LanguageDictionary,
  getLanguageDictionary as getCoreLanguageDictionary,
} from 'fittable-core/model';

export type FitLocale = 'en-US' | 'de-DE';

export type FitTextKey =
  | 'en-US'
  | 'de-DE'
  | 'Resize rows'
  | 'Insert rows above'
  | 'Insert rows below'
  | 'Remove rows'
  | 'Resize columns'
  | 'Insert columns left'
  | 'Insert columns right'
  | 'Remove columns'
  | 'Clear cells'
  | 'Remove cells'
  | 'Cut cells'
  | 'Copy cells'
  | 'Paste cells'
  | 'Merge cells'
  | 'Unmerge cells'
  | 'None'
  | 'Align top'
  | 'Align middle'
  | 'Align bottom'
  | 'Align left'
  | 'Align center'
  | 'Align right'
  | 'Undo'
  | 'Redo'
  | 'Paint format'
  | 'Bold'
  | 'Italic'
  | 'Underline'
  | 'Strike'
  | 'Font size'
  | 'Font family'
  | 'Text color'
  | 'Background color'
  | 'Vertical align'
  | 'Horizontal align'
  | 'Borders'
  | 'All borders'
  | 'Inner borders'
  | 'Outer borders'
  | 'Horizontal borders'
  | 'Vertical borders'
  | 'Left borders'
  | 'Top borders'
  | 'Right borders'
  | 'Bottom borders'
  | 'Clear borders'
  | 'Border type'
  | 'Border color'
  | 'Separator'
  | 'Settings'
  | 'Languages'
  | 'Color themes'
  | 'Light mode'
  | 'Dark mode'
  | 'Rows'
  | 'Columns'
  | 'Select all'
  | 'Clear'
  | 'Cancel'
  | 'Blank cells'
  | 'Filter'
  | 'Filter by value'
  | 'Search'
  | 'Ok'
  | 'Automatic'
  | 'Number'
  | 'Text'
  | 'Data type & format'
  | 'Plain number'
  | 'Percent'
  | 'Currency'
  | 'Custom format'
  | 'Date'
  | 'Time'
  | '1000.00'
  | '#.00'
  | '1,000.00'
  | '#,#.00'
  | '1000%'
  | '#%'
  | '1000.00%'
  | '#.00%'
  | '1,000.00%'
  | '#,#.00%'
  | '$1000'
  | '$#'
  | '$1000.00'
  | '$#.00'
  | '$1,000.00'
  | '$#,#.00'
  | 'RON 0#.##0'
  | 'Show cell values'
  | 'Show cell data references';

export type FitDictionary = { [key in FitTextKey]?: string };

export function getLanguageDictionary(): //
  LanguageDictionary<FitLocale, FitTextKey> {
  return getCoreLanguageDictionary<FitLocale, FitTextKey>();
}

export type FitImageId =
  | 'alignBottom'
  | 'alignCenter'
  | 'alignLeft'
  | 'alignMiddle'
  | 'alignRight'
  | 'alignTop'
  | 'arrowDown'
  | 'arrowRight'
  | 'backgroundColor'
  | 'bold'
  | 'borderAll'
  | 'borderAround'
  | 'borderBottom'
  | 'borderCenter'
  | 'borderColor'
  | 'borderCross'
  | 'borderLeft'
  | 'borderMiddle'
  | 'borderNone'
  | 'borderRight'
  | 'borderTop'
  | 'borderType'
  | 'clear'
  | 'color'
  | 'colorNone'
  | 'copy'
  | 'cut'
  | 'height'
  | 'insertAbove'
  | 'insertBelow'
  | 'insertLeft'
  | 'insertRight'
  | 'italic'
  | 'paintFormat'
  | 'paste'
  | 'redo'
  | 'remove'
  | 'strike'
  | 'underline'
  | 'undo'
  | 'width'
  | 'merge'
  | 'unmerge'
  | 'settings'
  | 'check'
  | 'filter'
  | 'search'
  | 'automatic'
  | 'text'
  | 'number'
  | 'date'
  | 'cellValue'
  | 'cellDataRef';

export type FitImages = { [id in FitImageId]?: string };

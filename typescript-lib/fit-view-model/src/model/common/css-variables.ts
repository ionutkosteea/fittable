import { CssVariables } from 'fit-core/view-model/index.js';

export const cssColorVariables = {
  '--highlight-color': '#2987d6',
  '--disabled-color': '#b7b7b7',
  '--toolbar-background-color': '#ffffff',
  '--toolbar-background-hover-color': 'rgba(96, 96, 96, 0.1)',
  '--toolbar-color': '#606060',
  '--toolbar-border-color': '#b7b7b7',
  '--toolbar-box-shadow-color': 'rgba(0, 0, 0, 0.25)',
  '--scrollbar-background-color': '#ffffff',
  '--scrollbar-color': '#b7b7b7',
  '--scrollbar-border-color': '#ffffff',
  '--table-header-background-color': '#ffffff',
  '--table-header-background-hover-color': 'rgba(96, 96, 96, 0.1)',
  '--table-header-color': '#606060',
  '--table-header-border-color': '#b7b7b7',
  '--table-body-background-color': '#ffffff',
  '--table-body-color': '#000000',
  '--table-body-border-color': '#b7b7b7',
  '--cell-editor-background-color': '#ffffff',
  '--cell-editor-color': '#000000',
  '--cell-editor-box-shadow-color': 'rgba(42, 135, 214, 1)',
  '--cell-selection-background-color': 'rgba(82, 177, 255, 0.1)',
  '--cell-selection-border-color': '#2987d6',
  '--context-menu-background-color': '#ffffff',
  '--context-menu-background-hover-color': 'rgba(96, 96, 96, 0.1)',
  '--context-menu-color': '#606060',
  '--context-menu-border-color': '#b7b7b7',
  '--context-menu-box-shadow-color': 'rgba(0, 0, 0, 0.25)',
  '--statusbar-background-color': '#ffffff',
  '--statusbar-color': '#606060',
  '--statusbar-border-color': '#b7b7b7',
};

export type CssColorVariables = typeof cssColorVariables;

export const cssUnitVariables = {
  '--toolbar-height': '36px',
  '--statusbar-height': '20px',
  '--font-size': '0px',
};

export type CssUnitVariables = typeof cssUnitVariables;

export function setCssVariable(
  name: keyof CssColorVariables | keyof CssUnitVariables,
  value: string
): void {
  document.body.style.setProperty(name, value);
}

export function setCssVariables(cssVariables: CssVariables): void {
  for (const key of Reflect.ownKeys(cssVariables)) {
    const varName: string = key as string;
    const varValue: string = Reflect.get(cssVariables, key);
    document.body.style.setProperty(varName, varValue);
  }
}

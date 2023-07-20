import { CssVariables } from 'fittable-core/view-model';

export type FitCssColorVariable =
  | '--highlight-color'
  | '--toolbar-background-color'
  | '--toolbar-background-hover-color'
  | '--toolbar-color'
  | '--toolbar-border-color'
  | '--toolbar-box-shadow-color'
  | '--scrollbar-background-color'
  | '--scrollbar-color'
  | '--scrollbar-border-color'
  | '--table-header-background-color'
  | '--table-header-background-hover-color'
  | '--table-header-color'
  | '--table-header-border-color'
  | '--table-body-background-color'
  | '--table-body-color'
  | '--table-body-border-color'
  | '--cell-editor-background-color'
  | '--cell-editor-color'
  | '--cell-editor-box-shadow-color'
  | '--cell-selection-background-color'
  | '--cell-selection-border-color'
  | '--context-menu-background-color'
  | '--context-menu-background-hover-color'
  | '--context-menu-color'
  | '--context-menu-border-color'
  | '--context-menu-box-shadow-color'
  | '--statusbar-background-color'
  | '--statusbar-color'
  | '--statusbar-border-color';

export type FitCssColorVariables = { [name in FitCssColorVariable]: string };

export const FIT_CSS_COLOR_VARIABLES: FitCssColorVariables = {
  '--highlight-color': '#2987d6',
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

export function setCssVariable(
  name: keyof FitCssColorVariables,
  value: string
): void {
  if (typeof document === 'undefined') return;
  document.body.style.setProperty(name, value);
}

export function setCssVariables(cssVariables: CssVariables): void {
  if (typeof document === 'undefined') return;
  for (const key of Reflect.ownKeys(cssVariables)) {
    const varName: string = key as string;
    const varValue: string = Reflect.get(cssVariables, key);
    document.body.style.setProperty(varName, varValue);
  }
}

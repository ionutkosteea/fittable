import {} from 'jasmine';

import { ViewModelConfig } from 'fittable-core/view-model';

import {
  createFitViewModelConfig,
  THIN_VIEW_MODEL_CONFIG,
  FIT_VIEW_MODEL_CONFIG,
} from '../../fittable-view-model/dist/fit-view-model-config.js';

describe('fittable-view-model-config.ts', (): void => {
  it('thin config', (): void => {
    const config: ViewModelConfig = createFitViewModelConfig({});
    const configKeys: string[] = Object.keys(config);
    const thinConfigKeys: string[] = Object.keys(THIN_VIEW_MODEL_CONFIG);
    expect(configKeys.length === thinConfigKeys.length).toBeTruthy();
    for (const key of configKeys) {
      const cfgKey = key as keyof ViewModelConfig;
      expect(config[cfgKey] === THIN_VIEW_MODEL_CONFIG[cfgKey]).toBeTruthy();
    }
  });

  it('fat config', (): void => {
    const config: ViewModelConfig = createFitViewModelConfig({
      cellEditor: true,
      cellSelection: true,
      colFilters: true,
      colHeader: true,
      colHeaderHeight: FIT_VIEW_MODEL_CONFIG.colHeaderHeight,
      colHeaderTextFn: FIT_VIEW_MODEL_CONFIG.colHeaderTextFn,
      colorPalette: FIT_VIEW_MODEL_CONFIG.colorPalette,
      colWidths: FIT_VIEW_MODEL_CONFIG.colWidths,
      contextMenu: true,
      disableVirtualCols: true,
      disableVirtualRows: true,
      fontFamily: FIT_VIEW_MODEL_CONFIG.fontFamily,
      fontSize: FIT_VIEW_MODEL_CONFIG.fontSize,
      rowHeader: true,
      rowHeaderTextFn: FIT_VIEW_MODEL_CONFIG.rowHeaderTextFn,
      rowHeaderWidth: FIT_VIEW_MODEL_CONFIG.rowHeaderWidth,
      rowHeights: FIT_VIEW_MODEL_CONFIG.rowHeights,
      settingsBar: true,
      showColHeader: true,
      showRowHeader: true,
      statusbar: true,
      themeSwitcher: true,
      toolbar: true,
    });
    const fatConfig: ViewModelConfig = { ...FIT_VIEW_MODEL_CONFIG };
    fatConfig.disableVirtualRows = true;
    fatConfig.disableVirtualCols = true;
    const configKeys: string[] = Object.keys(config);
    const fatConfigKeys: string[] = Object.keys(fatConfig);
    expect(configKeys.length === fatConfigKeys.length).toBeTruthy();
    for (const key of configKeys) {
      const cfgKey = key as keyof ViewModelConfig;
      expect(config[cfgKey] === fatConfig[cfgKey]).toBeTruthy();
    }
  });
});

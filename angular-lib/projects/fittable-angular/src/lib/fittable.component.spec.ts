import { ComponentFixture, TestBed } from '@angular/core/testing';

import { createTable, registerModelConfig } from 'fittable-core/model';
import { registerOperationConfig } from 'fittable-core/operations';
import {
  createFittableDesigner,
  registerViewModelConfig,
} from 'fittable-core/view-model';
import { FIT_MODEL_CONFIG } from 'fittable-model';
import { FIT_OPERATION_CONFIG } from 'fittable-model-operations';
import { FIT_VIEW_MODEL_CONFIG } from 'fittable-view-model';

import { FittableComponent } from './fittable.component';
import { TableCenterComponent } from './table-view/table-center/table-center.component';
import { TableLeftComponent } from './table-view/table-left/table-left.component';
import { TableTopComponent } from './table-view/table-top/table-top.component';
import { TableLeftTopCornerComponent } from './table-view/table-left-top-corner/table-left-top-corner.component';
import { ScrollContainerDirective } from './controls-view/common/scroll-container.directive';
import { CellSelectionDirective } from './table-view/common/cell-selection.directive';
import { ToolbarComponent } from './controls-view/toolbar/toolbar.component';
import { ButtonComponent } from './controls-view/button/button.component';
import { BorderPopupButtonComponent } from './controls-view/border-popup/border-popup.component';
import { BorderTypeComponent } from './controls-view/border-popup/border-type/border-type.component';
import { CellEditorComponent } from './controls-view/cell-editor/cell-editor.component';
import { CellEditorOpenDirective } from './controls-view/cell-editor/cell-editor.directive';
import { ColorPickerComponent } from './controls-view/color-picker/color-picker.component';
import { ComboComponent } from './controls-view/combo/combo.component';
import { ContextMenuComponent } from './controls-view/context-menu/context-menu.component';
import {
  FilterPopupButtonComponent,
  FilterPopupWindowComponent,
} from './controls-view/filter-popup/filter-popup.component';
import { InputComponent } from './controls-view/input/input.component';
import { PopupButtonComponent } from './controls-view/popup-button/popup-button.component';
import { SettingsBarComponent } from './controls-view/settings-bar/settings-bar.component';
import { SettingsButtonComponent } from './controls-view/settings-bar/settings-button/settings-button.component';
import { StatusbarComponent } from './controls-view/statusbar/statusbar.component';
import { TableComponent } from './table-view/table.component';
import { ContextMenuButtonComponent } from './controls-view/context-menu/context-menu-button.component';

describe('FittableComponent', () => {
  let component: FittableComponent;
  let fixture: ComponentFixture<FittableComponent>;

  beforeAll(() => {
    registerModelConfig(FIT_MODEL_CONFIG);
    registerOperationConfig(FIT_OPERATION_CONFIG);
    registerViewModelConfig(FIT_VIEW_MODEL_CONFIG);
  });

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        TableLeftTopCornerComponent,
        TableTopComponent,
        TableLeftComponent,
        TableCenterComponent,
        FittableComponent,
        ScrollContainerDirective,
        CellSelectionDirective,
        ToolbarComponent,
        ButtonComponent,
        ComboComponent,
        InputComponent,
        PopupButtonComponent,
        ColorPickerComponent,
        ContextMenuButtonComponent,
        ContextMenuComponent,
        BorderPopupButtonComponent,
        BorderTypeComponent,
        StatusbarComponent,
        CellEditorOpenDirective,
        CellEditorComponent,
        SettingsBarComponent,
        SettingsButtonComponent,
        FilterPopupButtonComponent,
        FilterPopupWindowComponent,
        TableComponent,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(FittableComponent);
    component = fixture.componentInstance;
    component.designer = createFittableDesigner(createTable());
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

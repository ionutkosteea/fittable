import { ComponentFixture, TestBed } from '@angular/core/testing';

import { createTable, registerModelConfig } from 'fittable-core/model';
import {
  createFittableDesigner,
  registerViewModelConfig,
} from 'fittable-core/view-model';

import { FIT_MODEL_CONFIG } from '../../../../../../typescript-lib/fittable-model/dist';
import { FIT_OPERATION_CONFIG } from '../../../../../../typescript-lib/fittable-model-operations/dist';
import { FIT_VIEW_MODEL_CONFIG } from '../../../../../../typescript-lib/fittable-view-model/dist';

import { TableViewComponent } from './table-view.component';
import { TableCenterComponent } from './table-center/table-center.component';
import { TableLeftComponent } from './table-left/table-left.component';
import { TableTopComponent } from './table-top/table-top.component';
import { TableLeftTopCornerComponent } from './table-left-top-corner/table-left-top-corner.component';
import { registerOperationConfig } from 'fittable-core/operations';
import { ScrollContainerDirective } from './common/scroll-container.directive';
import { CellSelectionDirective } from './common/cell-selection.directive';
import { ToolbarComponent } from '../controls-view/toolbar/toolbar.component';
import { ButtonComponent } from '../controls-view/button/button.component';
import { BorderPopUpButtonComponent } from '../controls-view/border-pop-up/border-pop-up.component';
import { BorderTypeComponent } from '../controls-view/border-pop-up/border-type/border-type.component';
import { CellEditorComponent } from '../controls-view/cell-editor/cell-editor.component';
import { CellEditorOpenDirective } from '../controls-view/cell-editor/cell-editor.directive';
import { ColorPickerComponent } from '../controls-view/color-picker/color-picker.component';
import { ComboComponent } from '../controls-view/combo/combo.component';
import { ContextMenuComponent } from '../controls-view/context-menu/context-menu.component';
import { MenuItemComponent } from '../controls-view/context-menu/menu-item/menu-item.component';
import {
  FilterPopupButtonComponent,
  FilterPopupWindowComponent,
} from '../controls-view/filter-pop-up/filter-pop-up.component';
import { InputComponent } from '../controls-view/input/input.component';
import { PopUpButtonComponent } from '../controls-view/pop-up-button/pop-up-button.component';
import { SettingsBarComponent } from '../controls-view/settings-bar/settings-bar.component';
import { SettingsButtonComponent } from '../controls-view/settings-bar/settings-button/settings-button.component';
import { StatusbarComponent } from '../controls-view/statusbar/statusbar.component';

describe('TableViewComponent', () => {
  let component: TableViewComponent;
  let fixture: ComponentFixture<TableViewComponent>;

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
        TableViewComponent,
        ScrollContainerDirective,
        CellSelectionDirective,
        ToolbarComponent,
        ButtonComponent,
        ComboComponent,
        InputComponent,
        PopUpButtonComponent,
        ColorPickerComponent,
        ContextMenuComponent,
        MenuItemComponent,
        BorderPopUpButtonComponent,
        BorderTypeComponent,
        StatusbarComponent,
        CellEditorOpenDirective,
        CellEditorComponent,
        SettingsBarComponent,
        SettingsButtonComponent,
        FilterPopupButtonComponent,
        FilterPopupWindowComponent,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TableViewComponent);
    component = fixture.componentInstance;
    component.designer = createFittableDesigner(createTable());
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

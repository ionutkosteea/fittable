import {
  AfterViewInit,
  Component,
  HostListener,
  OnInit,
  input,
} from '@angular/core';
import { CommonModule } from '@angular/common';

import { RangeIterator } from 'fittable-core/common';
import { CssStyle } from 'fittable-core/model';
import {
  PopupControl,
  ColFilters,
  WindowListener,
  Control,
  asPopupControl,
  ToggleControl,
  Container,
  InputControl,
  asInputControl,
  Window,
  ScrollContainer,
  asToggleControl,
  createWindowListener,
} from 'fittable-core/view-model';

import { createToggleStyle, createWindowStyle } from '../common/style-functions.model';
import { ScrollContainerDirective } from '../common/scroll-container.directive';
import { SvgImgComponent } from '../svg-img/svg-img.component';

@Component({
  selector: 'fit-filter-popup-button',
  standalone: true,
  imports: [CommonModule, SvgImgComponent],
  template: `
    <button
      class="popup-button"
      [ngClass]="{ 'is-on': isOn() }"
      [ngStyle]="getStyle()"
      [title]="label"
    >
      <fit-svg-img [content]="icon" />
    </button>
  `,
  styleUrls: ['./filter-popup-window.component.scss'],
})
export class FilterPopupButtonComponent implements OnInit {
  colFilters = input.required<ColFilters>();
  colId = input.required<number>();

  private windowListener!: WindowListener;

  get label(): string {
    return this.popupButton.getLabel();
  }

  get icon(): string | undefined {
    return this.popupButton.getIcon();
  }

  private get popupButton(): PopupControl {
    return this.colFilters().getPopupButton(this.colId());
  }

  ngOnInit(): void {
    this.windowListener = createWindowListener(this.popupButton.getWindow());
  }

  @HostListener('click', ['$event']) onMouseDown(event: MouseEvent): void {
    if (this.popupButton.isDisabled()) return;
    this.colFilters().loadCol(this.colId());
    this.windowListener.onShow(event);
    setTimeout((): void => {
      this.popupButton.getWindow().setFocus(true);
      this.colFilters().getValueScrollContainer().renderModel();
    });
  }

  isOn(): boolean {
    return asToggleControl(this.popupButton)?.isOn() ?? false;
  }

  getStyle(): CssStyle | null {
    return createToggleStyle(this.popupButton);
  }
}

type ControlId =
  | 'search-input'
  | 'clear-button'
  | 'select-all-button'
  | 'value-check-list'
  | 'ok-button'
  | 'cancel-button';

@Component({
  selector: 'fit-filter-popup-window',
  standalone: true,
  imports: [CommonModule, ScrollContainerDirective, SvgImgComponent],
  templateUrl: './filter-popup-window.component.html',
  styleUrls: ['./filter-popup-window.component.scss'],
})
export class FilterPopupWindowComponent implements AfterViewInit {
  colFilters = input.required<ColFilters>();

  private windowListener!: WindowListener;

  get scrollContainer(): ScrollContainer {
    return this.colFilters().getValueScrollContainer();
  }

  get scrollOffsetY(): number {
    return this.scrollContainer.getInnerOffsetY();
  }

  get checkBoxIds(): RangeIterator {
    return this.scrollContainer.getRenderableRows();
  }

  get selectAllButton(): Control {
    const controlId: ControlId = 'select-all-button';
    return this.popupWindow.getControl(controlId);
  }

  get clearButton(): Control {
    const controlId: ControlId = 'clear-button';
    return this.popupWindow.getControl(controlId);
  }

  get okButton(): Control {
    const controlId: ControlId = 'ok-button';
    return this.popupWindow.getControl(controlId);
  }

  get cancelButton(): Control {
    const controlId: ControlId = 'cancel-button';
    return this.popupWindow.getControl(controlId);
  }

  private get popupWindow(): Window {
    return this.popupButton.getWindow();
  }

  private get popupButton(): PopupControl {
    return this.colFilters().getPopupButton(0);
  }

  ngAfterViewInit(): void {
    this.windowListener = createWindowListener(this.popupButton.getWindow());
  }

  @HostListener('mousedown', ['$event']) onMouseDown(event: MouseEvent): void {
    this.windowListener.onMouseDown(event);
  }

  @HostListener('window:mousedown') onGlobalMouseDown(): void {
    this.windowListener.onGlobalMouseDown();
  }

  getWindowStyle(): CssStyle {
    return createWindowStyle(this.popupWindow);
  }

  getSearchInput(): InputControl {
    const controlId: ControlId = 'search-input';
    const control: Control = this.popupWindow.getControl(controlId);
    const input: InputControl | undefined = asInputControl(control);
    if (input) return input;
    else throw new Error('Search input control was not found!');
  }

  getSearchInputIcon(): string | undefined {
    return this.getSearchInput().getIcon();
  }

  onSearchInput(event: Event): void {
    const input: HTMLInputElement = event.target as HTMLInputElement;
    this.getSearchInput().setValue(input.value).run();
  }

  getCheckListHeight(): number {
    return this.getCheckBoxContainer().getControlIds().length * 20;
  }

  hasCheckList(): boolean {
    return this.getCheckBoxContainer().getControlIds().length > 0;
  }

  getCheckBox(id: number): ToggleControl {
    const control: Control | undefined = //
      this.getCheckBoxContainer().getControl('' + id);
    const checkBox: ToggleControl | undefined = asToggleControl(control);
    if (checkBox) return checkBox;
    else throw new Error('Invalid check box control');
  }

  onCheckBoxClick(id: number): void {
    const checkBox: ToggleControl = this.getCheckBox(id);
    checkBox.setOn(!checkBox.isOn());
  }

  private getCheckBoxContainer(): Container {
    const controlId: ControlId = 'value-check-list';
    const control: Control = this.popupWindow.getControl(controlId);
    const popup: PopupControl | undefined = asPopupControl(control);
    if (popup) return popup.getWindow();
    else throw new Error('Invalid value check list control');
  }
}

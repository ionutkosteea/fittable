import {
  AfterViewInit,
  Component,
  HostListener,
  OnInit,
  inject,
  input,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

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

import { createWindowStyle } from '../common/style-functions.model';
import { ScrollContainerDirective } from '../common/scroll-container.directive';

@Component({
  selector: 'fit-filter-popup-button',
  standalone: true,
  imports: [CommonModule],
  template: `
    <button
      class="popup-button"
      [ngClass]="{ 'is-on': isOn() }"
      [title]="getLabel()"
    >
      <div class="icon" [innerHTML]="getIcon()"></div>
    </button>
  `,
  styleUrls: ['./filter-popup-window.component.scss'],
})
export class FilterPopupButtonComponent implements OnInit {
  colFilters = input.required<ColFilters>();
  colId = input.required<number>();

  private windowListener!: WindowListener;
  private readonly domSanitizer = inject(DomSanitizer);

  ngOnInit(): void {
    this.windowListener = //
      createWindowListener(this.getPopupButton().getWindow());
  }

  @HostListener('click', ['$event']) onMouseDown(event: MouseEvent): void {
    this.colFilters().loadCol(this.colId());
    this.windowListener.onShow(event);
    setTimeout((): void => {
      this.getPopupButton().getWindow().setFocus(true);
      this.colFilters().getValueScrollContainer().renderModel();
    });
  }

  getLabel(): string {
    return this.getPopupButton().getLabel();
  }

  getIcon(): SafeHtml | undefined {
    const htmlContent = this.getPopupButton().getIcon() ?? '';
    return this.domSanitizer.bypassSecurityTrustHtml(htmlContent);
  }

  isOn(): boolean {
    return asToggleControl(this.getPopupButton())?.isOn() ?? false;
  }

  getPopupButton(): PopupControl {
    return this.colFilters().getPopupButton(this.colId());
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
  imports: [CommonModule, ScrollContainerDirective],
  templateUrl: './filter-popup-window.component.html',
  styleUrls: ['./filter-popup-window.component.scss'],
})
export class FilterPopupWindowComponent implements AfterViewInit {
  colFilters = input.required<ColFilters>();

  private windowListener!: WindowListener;
  private readonly domSanitizer = inject(DomSanitizer);

  ngAfterViewInit(): void {
    this.windowListener = //
      createWindowListener(this.getPopupButton().getWindow());
  }

  @HostListener('mousedown', ['$event']) onMouseDown(event: MouseEvent): void {
    this.windowListener.onMouseDown(event);
  }

  @HostListener('window:mousedown') onGlobalMouseDown(): void {
    this.windowListener.onGlobalMouseDown();
  }

  getWindowStyle(): CssStyle {
    return createWindowStyle(this.getPopupWindow());
  }

  getSearchInput(): InputControl {
    const controlId: ControlId = 'search-input';
    const control: Control = this.getPopupWindow().getControl(controlId);
    const input: InputControl | undefined = asInputControl(control);
    if (input) return input;
    else throw new Error('Search input control was not found!');
  }

  getSearchInputIcon(): SafeHtml | undefined {
    const htmlContent = this.getSearchInput().getIcon() ?? '';
    return this.domSanitizer.bypassSecurityTrustHtml(htmlContent);
  }

  onSearchInput(event: Event): void {
    const input: HTMLInputElement = event.target as HTMLInputElement;
    this.getSearchInput().setValue(input.value).run();
  }

  getScrollContainer(): ScrollContainer {
    return this.colFilters().getValueScrollContainer();
  }

  getScrollOffsetY(): number {
    return this.getScrollContainer().getInnerOffsetY();
  }

  getCheckListHeight(): number {
    return this.getCheckBoxContainer().getControlIds().length * 20;
  }

  hasCheckList(): boolean {
    return this.getCheckBoxContainer().getControlIds().length > 0;
  }

  getCheckBoxIds(): RangeIterator {
    return this.getScrollContainer().getRenderableRows();
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

  getSelectAllButton(): Control {
    const controlId: ControlId = 'select-all-button';
    return this.getPopupWindow().getControl(controlId);
  }

  getClearButton(): Control {
    const controlId: ControlId = 'clear-button';
    return this.getPopupWindow().getControl(controlId);
  }

  getOkButton(): Control {
    const controlId: ControlId = 'ok-button';
    return this.getPopupWindow().getControl(controlId);
  }

  getCancelButton(): Control {
    const controlId: ControlId = 'cancel-button';
    return this.getPopupWindow().getControl(controlId);
  }

  private getCheckBoxContainer(): Container {
    const controlId: ControlId = 'value-check-list';
    const control: Control = this.getPopupWindow().getControl(controlId);
    const popup: PopupControl | undefined = asPopupControl(control);
    if (popup) return popup.getWindow();
    else throw new Error('Invalid value check list control');
  }

  private getPopupWindow(): Window {
    return this.getPopupButton().getWindow();
  }

  private getPopupButton(): PopupControl {
    return this.colFilters().getPopupButton(0);
  }
}

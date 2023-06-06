import {
  AfterViewInit,
  Component,
  ElementRef,
  HostListener,
  Input,
  OnInit,
  ViewChild,
} from '@angular/core';

import { RangeIterator } from 'fittable-core/common';
import { CssStyle } from 'fittable-core/model';
import {
  PopupControl,
  ColFilters,
  WindowListener,
  Control,
  asPopupControl,
  CheckBoxControl,
  Container,
  InputControl,
  asInputControl,
  Window,
  ScrollContainer,
  asCheckBoxControl,
  createWindowListener,
} from 'fittable-core/view-model';

import { createWindowStyle } from '../common/style-functions.model';

@Component({
  selector: 'fit-filter-popup-button',
  template:
    '<div class="pop-up-button" [ngStyle]="{backgroundImage: getPopupButton().getIcon()}">&nbsp;</div>',
  styleUrls: ['./filter-popup.component.css'],
})
export class FilterPopupButtonComponent implements OnInit {
  @Input() colFilters!: ColFilters;
  @Input() colId!: number;

  private windowListener!: WindowListener;

  public ngOnInit(): void {
    this.windowListener = //
      createWindowListener(this.getPopupButton().getWindow());
  }

  @HostListener('click', ['$event']) onMouseDown(event: MouseEvent): void {
    this.colFilters.loadCol(this.colId);
    this.windowListener.onShow(event);
    setTimeout((): void => {
      this.getPopupButton().getWindow().setFocus(true);
      this.colFilters.getValueScroller().scrollTo(0, 0);
    });
  }

  public readonly getPopupButton = (): PopupControl =>
    this.colFilters.getPopupButton(this.colId);
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
  templateUrl: './filter-popup-window.component.html',
  styleUrls: ['./filter-popup.component.css'],
})
export class FilterPopupWindowComponent implements AfterViewInit {
  @Input() colFilters!: ColFilters;
  @ViewChild('filterWindow') filterWindowRef!: ElementRef;
  @ViewChild('searchInput') searchInputRef!: ElementRef;
  @ViewChild('scroller') scrollerRef!: ElementRef;

  private windowListener!: WindowListener;

  public ngAfterViewInit(): void {
    const filterWindow: HTMLElement = this.filterWindowRef.nativeElement;
    this.getPopupWindow()
      .setHeight((): number => filterWindow.clientHeight)
      .setWidth((): number => filterWindow.clientWidth);
    this.windowListener = //
      createWindowListener(this.getPopupButton().getWindow());
  }

  public readonly getWindowStyle = (): CssStyle =>
    createWindowStyle(this.getPopupWindow());

  public getSearchInput(): InputControl {
    const controlId: ControlId = 'search-input';
    const control: Control = this.getPopupWindow().getControl(controlId);
    const input: InputControl | undefined = asInputControl(control);
    if (input) return input;
    else throw new Error('Search input control was not found!');
  }

  public onSearchInput(event: Event): void {
    const input: HTMLInputElement = event.target as HTMLInputElement;
    this.getSearchInput().setValue(input.value).run();
  }

  public getScrollContainer = (): ScrollContainer =>
    this.colFilters.getValueScroller();

  public getOffsetY = (): number => this.getScrollContainer().getOffsetY();

  public getCheckListHeight = (): number =>
    this.getCheckBoxContainer().getControlIds().length * 20;

  public hasCheckList = (): boolean =>
    this.getCheckBoxContainer().getControlIds().length > 0;

  public getCheckBoxIds = (): RangeIterator =>
    this.getScrollContainer().getRenderableRows();

  public getCheckBox(id: number): CheckBoxControl {
    const control: Control | undefined = //
      this.getCheckBoxContainer().getControl('' + id);
    const checkBox: CheckBoxControl | undefined = asCheckBoxControl(control);
    if (checkBox) return checkBox;
    else throw new Error('Invalid check box control');
  }

  public onCheckBoxClick(id: number): void {
    const checkBox: CheckBoxControl = this.getCheckBox(id);
    checkBox.setChecked(!checkBox.isChecked());
  }

  public getSelectAllButton(): Control {
    const controlId: ControlId = 'select-all-button';
    return this.getPopupWindow().getControl(controlId);
  }

  public getClearButton(): Control {
    const controlId: ControlId = 'clear-button';
    return this.getPopupWindow().getControl(controlId);
  }

  public getOkButton(): Control {
    const controlId: ControlId = 'ok-button';
    return this.getPopupWindow().getControl(controlId);
  }

  public getCancelButton(): Control {
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

  private readonly getPopupWindow = (): Window =>
    this.getPopupButton().getWindow();

  private readonly getPopupButton = (): PopupControl =>
    this.colFilters.getPopupButton(0);

  @HostListener('mousedown', ['$event']) onMouseDown(event: MouseEvent): void {
    this.windowListener.onMouseDown(event);
  }

  @HostListener('window:mousedown') onGlobalMouseDown(): void {
    this.windowListener.onGlobalMouseDown();
  }
}

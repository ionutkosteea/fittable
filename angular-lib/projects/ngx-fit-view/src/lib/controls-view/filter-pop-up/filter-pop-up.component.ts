import { Subscription } from 'rxjs';
import {
  AfterViewInit,
  Component,
  ElementRef,
  HostListener,
  Input,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';

import { RangeIterator } from 'fit-core/common';
import { CssStyle } from 'fit-core/model';
import {
  OptionsControl,
  ColFilters,
  WindowListener,
  Control,
  asOptionsControl,
  CheckBoxControl,
  Container,
  InputControl,
  asInputControl,
  Window,
  ScrollContainer,
  asCheckBoxControl,
  createWindowListener,
} from 'fit-core/view-model';

import { createWindowStyle } from '../common/style-functions.model';

@Component({
  selector: 'fit-filter-pop-up-button',
  template:
    '<div class="pop-up-button" [ngStyle]="{backgroundImage: getPopUpButton().getIcon()}">&nbsp;</div>',
  styleUrls: ['./filter-pop-up.component.css'],
})
export class FilterPopupButtonComponent implements OnInit {
  @Input() colFilters!: ColFilters;
  @Input() colId!: number;

  private windowListener!: WindowListener;

  public ngOnInit(): void {
    this.windowListener = //
      createWindowListener(this.getPopUpButton().getWindow());
  }

  @HostListener('click', ['$event']) onMouseDown(event: MouseEvent): void {
    this.colFilters.loadCol(this.colId);
    this.windowListener.onShow(event);
    setTimeout((): void => {
      this.getPopUpButton().getWindow().setFocus(true);
      this.colFilters.getValueScroller().scrollTo(0, 0);
    });
  }

  public readonly getPopUpButton = (): OptionsControl =>
    this.colFilters.getPopUpButton(this.colId);
}

type ControlId =
  | 'search-input'
  | 'clear-button'
  | 'select-all-button'
  | 'value-check-list'
  | 'ok-button'
  | 'cancel-button';

@Component({
  selector: 'fit-filter-pop-up-window',
  templateUrl: './filter-pop-up-window.component.html',
  styleUrls: ['./filter-pop-up.component.css'],
})
export class FilterPopupWindowComponent implements AfterViewInit, OnDestroy {
  @Input() colFilters!: ColFilters;
  @ViewChild('filterWindow') filterWindowRef!: ElementRef;
  @ViewChild('searchInput') searchInputRef!: ElementRef;
  @ViewChild('scroller') scrollerRef!: ElementRef;

  private windowListener!: WindowListener;

  private subscriptions: Subscription[] = [];

  public ngAfterViewInit(): void {
    const filterWindow: HTMLElement = this.filterWindowRef.nativeElement;
    this.getPopUpWindow()
      .setHeight((): number => filterWindow.clientHeight)
      .setWidth((): number => filterWindow.clientWidth);
    this.windowListener = //
      createWindowListener(this.getPopUpButton().getWindow());
    this.subscriptions.push(this.initScrollContainer$());
  }

  private initScrollContainer$(): Subscription {
    return this.getPopUpWindow()
      .onAfterSetFocus$()
      .subscribe((focus: boolean): void => {
        if (!focus) return;
        this.getScrollContainer().resizeViewportHeight();
      });
  }

  public readonly getWindowStyle = (): CssStyle =>
    createWindowStyle(this.getPopUpWindow());

  public getSearchInput(): InputControl {
    const controlId: ControlId = 'search-input';
    const control: Control = this.getPopUpWindow().getControl(controlId);
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
    return this.getPopUpWindow().getControl(controlId);
  }

  public getClearButton(): Control {
    const controlId: ControlId = 'clear-button';
    return this.getPopUpWindow().getControl(controlId);
  }

  public getOkButton(): Control {
    const controlId: ControlId = 'ok-button';
    return this.getPopUpWindow().getControl(controlId);
  }

  public getCancelButton(): Control {
    const controlId: ControlId = 'cancel-button';
    return this.getPopUpWindow().getControl(controlId);
  }

  private getCheckBoxContainer(): Container {
    const controlId: ControlId = 'value-check-list';
    const control: Control = this.getPopUpWindow().getControl(controlId);
    const options: OptionsControl | undefined = asOptionsControl(control);
    if (options) return options.getWindow();
    else throw new Error('Invalid value check list control');
  }

  private readonly getPopUpWindow = (): Window =>
    this.getPopUpButton().getWindow();

  private readonly getPopUpButton = (): OptionsControl =>
    this.colFilters.getPopUpButton(0);

  @HostListener('mousedown', ['$event']) onMouseDown(event: MouseEvent): void {
    this.windowListener.onMouseDown(event);
  }

  @HostListener('window:mousedown') onGlobalMouseDown(): void {
    this.windowListener.onGlobalMouseDown();
  }

  public ngOnDestroy(): void {
    this.subscriptions.forEach((s: Subscription): void => s.unsubscribe());
  }
}

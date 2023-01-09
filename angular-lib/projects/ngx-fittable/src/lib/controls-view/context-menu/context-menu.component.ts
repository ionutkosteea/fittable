import {
  Component,
  Input,
  HostListener,
  AfterViewInit,
  ViewChild,
  ElementRef,
} from '@angular/core';

import { CssStyle } from 'fit-core/model';
import {
  Window,
  WindowListener,
  InputControlListener,
  Control,
} from 'fit-core/view-model';

import { ControlType, createWindowStyle } from '../common/control-utils.model';

@Component({
  selector: 'fit-context-menu',
  templateUrl: './context-menu.component.html',
  styleUrls: ['./context-menu.component.css'],
})
export class ContextMenuComponent implements AfterViewInit {
  @Input() window!: Window;
  @Input() windowListener!: WindowListener;
  @Input() inputControlListener?: InputControlListener;
  @ViewChild('main') menuRef!: ElementRef;

  public ngAfterViewInit(): void {
    const htmlMenu: HTMLElement = this.menuRef.nativeElement;
    this.window
      .setWidth((): number => htmlMenu.clientWidth)
      .setHeight((): number => htmlMenu.clientHeight);
  }

  public readonly getMenuStyle = (): CssStyle => createWindowStyle(this.window);

  public readonly getMenuItemIds = (): string[] => this.window.getControlIds();

  public readonly getMenuItem = (id: string): Control =>
    this.window.getControl(id);

  public readonly getMenuItemType = (id: string): ControlType =>
    this.getMenuItem(id).getType() as ControlType;

  public hideMenu = (): void => {
    this.window.setVisible(false);
  };

  public readonly hasWindowListener = (): boolean =>
    this.windowListener !== undefined;

  public readonly getWindowListener = (): WindowListener =>
    this.windowListener as WindowListener;

  @HostListener('mousedown', ['$event']) onMouseDown(event: MouseEvent): void {
    this.windowListener.setWindow(this.window).onMouseDown(event);
  }

  @HostListener('window:mousedown') onGlobalMouseDown(): void {
    this.windowListener.setWindow(this.window).onGlobalMouseDown();
  }
}

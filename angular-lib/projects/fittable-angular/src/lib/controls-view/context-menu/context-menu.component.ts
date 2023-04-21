import {
  Component,
  Input,
  HostListener,
  AfterViewInit,
  ViewChild,
  ElementRef,
} from '@angular/core';

import { CssStyle } from 'fittable-core/model';
import {
  Control,
  Window,
  WindowListener,
  createWindowListener,
} from 'fittable-core/view-model';

import { ControlType } from '../common/control-type.model';
import { createWindowStyle } from '../common/style-functions.model';

@Component({
  selector: 'fit-context-menu',
  templateUrl: './context-menu.component.html',
  styleUrls: ['./context-menu.component.css'],
})
export class ContextMenuComponent implements AfterViewInit {
  @Input() window!: Window;
  @ViewChild('main') menuRef!: ElementRef;

  private windowListener!: WindowListener;

  public ngAfterViewInit(): void {
    const htmlMenu: HTMLElement = this.menuRef.nativeElement;
    this.window
      .setWidth((): number => htmlMenu.clientWidth)
      .setHeight((): number => htmlMenu.clientHeight);
    this.windowListener = createWindowListener(this.window);
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

  @HostListener('mousedown', ['$event']) onMouseDown(event: MouseEvent): void {
    this.windowListener.onMouseDown(event);
  }

  @HostListener('window:mousedown') onGlobalMouseDown(): void {
    this.windowListener.onGlobalMouseDown();
  }
}

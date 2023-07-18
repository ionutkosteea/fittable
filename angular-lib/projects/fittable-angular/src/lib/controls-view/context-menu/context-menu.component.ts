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
  styleUrls: ['../common/css/controls-common.css'],
})
export class ContextMenuComponent implements AfterViewInit {
  @Input() model!: Window;
  @ViewChild('main') menuRef!: ElementRef;

  private windowListener!: WindowListener;

  public ngAfterViewInit(): void {
    const htmlMenu: HTMLElement = this.menuRef.nativeElement;
    this.model //
      .setSize({
        getWidth: (): number => htmlMenu.clientWidth,
        getHeight: (): number => htmlMenu.clientHeight,
      });
    this.windowListener = createWindowListener(this.model);
  }

  public readonly getMenuStyle = (): CssStyle => createWindowStyle(this.model);

  public readonly getMenuItemIds = (): string[] => this.model.getControlIds();

  public readonly getMenuItem = (id: string): Control =>
    this.model.getControl(id);

  public readonly getMenuItemType = (id: string): ControlType =>
    this.getMenuItem(id).getType() as ControlType;

  public hideMenu = (): void => {
    this.model.setVisible(false);
  };

  @HostListener('mousedown', ['$event']) onMouseDown(event: MouseEvent): void {
    this.windowListener.onMouseDown(event);
  }

  @HostListener('window:mousedown') onGlobalMouseDown(): void {
    this.windowListener.onGlobalMouseDown();
  }
}

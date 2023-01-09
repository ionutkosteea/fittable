import {
  Coord,
  FitMouseEvent,
  Window,
  WindowListener,
  WindowListenerFactory,
} from 'fit-core/view-model/index.js';

export class FitWindowListener implements WindowListener {
  private window!: Window;

  public setWindow(window: Window): this {
    this.window = window;
    return this;
  }

  public onShow(event?: FitMouseEvent): void {
    if (event) {
      event.preventDefault();
      this.window.setPosition({ x: event.x, y: event.y });
    }
    this.window.setVisible(true);
    setTimeout((): void => this.moveWindowIfPartlyHidden());
  }

  private moveWindowIfPartlyHidden(): void {
    const position: Coord = this.window.getPosition();
    const width: number = this.window.getWidth();
    const height: number = this.window.getHeight();
    let moveX: number = position.x + width - window.innerWidth;
    moveX = moveX > 0 ? moveX : 0;
    let moveY: number = position.y + height - window.innerHeight;
    moveY = moveY > 0 ? moveY : 0;
    if (!moveX && !moveY) return;
    this.window.setPosition({
      x: position.x - moveX,
      y: position.y - moveY,
    });
  }

  public onMouseDown(event: FitMouseEvent): void {
    event.stopPropagation();
  }

  public onGlobalMouseDown(): void {
    this.window.isVisible() && this.window.setVisible(false);
  }
}

export class FitWindowListenerFactory implements WindowListenerFactory {
  public createWindowListener(): FitWindowListener {
    return new FitWindowListener();
  }
}

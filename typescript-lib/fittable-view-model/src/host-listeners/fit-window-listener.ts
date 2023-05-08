import {
  Coord,
  FitMouseEvent,
  Window,
  WindowListener,
  WindowListenerFactory,
} from 'fittable-core/view-model';

export class FitWindowListener implements WindowListener {
  constructor(private readonly window: Window) {}

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
  public createWindowListener(window: Window): FitWindowListener {
    return new FitWindowListener(window);
  }
}

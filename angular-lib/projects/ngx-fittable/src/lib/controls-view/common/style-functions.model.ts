import { CssStyle } from 'fit-core/model';
import { Window, Coord, Control } from 'fit-core/view-model';

export function createWindowStyle(window: Window): CssStyle {
  const display: string = window.isVisible() ? 'block' : 'none';
  const position: Coord = window.getPosition();
  const x: number = position.x;
  const y: number = position.y;
  const transform: string = 'translate3d(' + x + 'px,' + y + 'px,0px)';
  return { display, transform };
}

export function createToggleStyle(control: Control): CssStyle {
  return control.isDisabled()
    ? { opacity: 0.4, cursor: 'default' }
    : { cursor: 'pointer' };
}

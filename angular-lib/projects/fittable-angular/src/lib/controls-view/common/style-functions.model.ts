import { CssStyle } from 'fittable-core/model';
import { Window, Coord, Control } from 'fittable-core/view-model';

export function createWindowStyle(window: Window): CssStyle {
  const style: CssStyle = {};
  const display: string = window.isVisible() ? 'block' : 'none';
  style['display'] = display;
  const position: Coord | undefined = window.getPosition();
  if (position) {
    const x: number = position.x;
    const y: number = position.y;
    const transform: string = 'translate3d(' + x + 'px,' + y + 'px,0px)';
    style['transform'] = transform;
  }
  return style;
}

export function createToggleStyle(control: Control): CssStyle | null {
  return control.isDisabled() || !control.isValid()
    ? { opacity: 0.4, cursor: 'default' }
    : null;
}

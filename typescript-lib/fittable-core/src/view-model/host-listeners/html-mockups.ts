export interface FitHtmlElement {
  parentElement: FitHtmlElement | null;
  tagName: string;
  getAttribute(name: string): string | null;
}

export interface FitHtmlDivElement extends FitHtmlElement {
  clientHeight: number;
  clientWidth: number;
  scrollLeft: number;
  scrollTop: number;
  scrollTo(left: number, top: number): void;
}

export interface FitHtmlInputElement extends FitHtmlElement {
  value: string | null;
}

export interface FitEvent {
  target: unknown;
  preventDefault(): void;
  stopPropagation(): void;
}

export interface FitMouseEvent extends FitEvent {
  x: number;
  y: number;
  button: number;
  shiftKey: boolean;
  ctrlKey: boolean;
  metaKey: boolean;
}

export interface FitKeyboardEvent extends FitEvent {
  key: string;
  shiftKey: boolean;
  ctrlKey: boolean;
  metaKey: boolean;
}

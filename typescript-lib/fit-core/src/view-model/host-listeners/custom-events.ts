export interface FitHTMLInputElement {
  value: string;
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
}

export interface FitKeyboardEvent extends FitEvent {
  key: string;
  shiftKey: boolean;
  ctrlKey: boolean;
  metaKey: boolean;
}

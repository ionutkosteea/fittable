import {
  FitEvent,
  FitHtmlElement,
  FitHtmlInputElement,
  FitKeyboardEvent,
  FitMouseEvent,
} from 'fittable-core/view-model';

export class TstHtmlElement implements FitHtmlElement {
  public parentElement: FitHtmlElement | null = null;
  public tagName = '';

  private attributes: Map<string, string | null> = new Map();

  public getAttribute(name: string): string | null {
    return this.attributes.get(name) ?? null;
  }
  public setAttribute(name: string, value: string): this {
    this.attributes.set(name, value);
    return this;
  }
}

export class TstHtmlInputElement
  extends TstHtmlElement
  implements FitHtmlInputElement
{
  public value = '';
}

export class TstEvent implements FitEvent {
  public target: TstHtmlElement | undefined = undefined;
  public preventDefault(): void {}
  public stopPropagation(): void {}
}

export class TstMouseEvent extends TstEvent implements FitMouseEvent {
  public x = 0;
  public y = 0;
  public button = 0;
  public shiftKey = false;
  public ctrlKey = false;
  public metaKey = false;
}

export class TstKeyboardEvent extends TstEvent implements FitKeyboardEvent {
  public key = '';
  public shiftKey = false;
  public ctrlKey = false;
  public metaKey = false;
}

import { getModelConfig } from './model-config.js';

export type CssStyle = { [name in string]?: string | number };

export interface Style {
  getDto(): unknown;
  set(name: string, value?: string | number): this;
  get(name: string): string | number | undefined;
  remove(name: string): this;
  forEach(propertyFn: (name: string, value?: string | number) => boolean): void;
  toCss(): CssStyle;
  toCssText(): string;
  contains(other?: Style): boolean;
  append(other: Style): Style;
  hasProperties(): boolean;
  clone(): Style;
  equals(other?: Style): boolean;
}

export interface StyleFactory {
  createStyle(): Style;
  createStyle4Dto?(dto: unknown): Style;
}

export function createStyle<T extends Style>(): T {
  return getFactory().createStyle() as T;
}

export function createStyle4Dto<T extends Style>(dto: unknown): T {
  const factory: StyleFactory = getFactory();
  if (factory.createStyle4Dto) return factory.createStyle4Dto(dto) as T;
  else throw new Error('StyleFactory.createStyle4Dto is not defined!');
}

function getFactory(): StyleFactory {
  const factory: StyleFactory | undefined = getModelConfig().styleFactory;
  if (factory) return factory;
  else throw new Error('StyleFactory is not defined!');
}

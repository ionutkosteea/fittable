import { Style, StyleFactory, CssStyle } from 'fit-core/model/index.js';

import { FitStyleDto } from './dto/fit-table-dto.js';

export class FitStyle implements Style {
  private readonly dto: FitStyleDto = {};

  constructor(dto?: FitStyleDto) {
    if (dto) this.dto = dto;
  }

  public getDto(): FitStyleDto {
    return this.dto;
  }

  public set(name: keyof FitStyleDto, value?: string | number): this {
    Reflect.defineProperty(this.dto, name, {
      value,
      writable: true,
      configurable: true,
      enumerable: true,
    });
    return this;
  }

  public get(name: keyof FitStyleDto): string | number | undefined {
    const value: unknown = Reflect.get(this.dto, name);
    if (value) {
      const stringValue: string = value as string;
      const result: number = Number(stringValue).valueOf();
      return isNaN(result) ? stringValue : result;
    } else {
      return undefined;
    }
  }

  public remove(name: keyof FitStyleDto): this {
    Reflect.deleteProperty(this.dto, name);
    return this;
  }

  public forEach(
    propertyFn: (name: keyof FitStyleDto, value?: string | number) => boolean
  ): void {
    for (const key of Reflect.ownKeys(this.dto)) {
      const propName: keyof FitStyleDto = key as keyof FitStyleDto;
      const propValue: string | number | undefined = this.get(propName);
      if (!propertyFn(propName, propValue)) {
        break;
      }
    }
  }

  public toCss(): CssStyle {
    return { ...this.dto };
  }

  public toCssText(): string {
    let cssStyle = '';
    this.forEach((name: string, value?: string | number) => {
      if (value) cssStyle += name + ':' + value + ';';
      return true;
    });
    return cssStyle;
  }

  public equals(other?: FitStyle): boolean {
    if (!other) return false;
    const countThis: number = this.countDefinedProperties(this);
    const countOther: number = this.countDefinedProperties(other);
    if (countThis !== countOther) return false;
    let isEqual = true;
    this.forEach((name: keyof FitStyleDto, value?: string | number) => {
      if (value && value !== other.get(name)) {
        isEqual = false;
        return false;
      }
      return true;
    });
    return isEqual;
  }

  private countDefinedProperties(style: FitStyle): number {
    let count = 0;
    style.forEach((name: string, value?: string | number) => {
      if (value) count++;
      return true;
    });
    return count;
  }

  public contains(other?: FitStyle): boolean {
    if (!other) return false;
    let contains = true;
    other.forEach((name: keyof FitStyleDto, value?: string | number) => {
      if (this.get(name) !== value) {
        contains = false;
        return false;
      }
      return true;
    });
    return contains;
  }

  public append(other: FitStyle): FitStyle {
    const newStyle = this.clone();
    other.forEach((name: keyof FitStyleDto, value?: string | number) => {
      newStyle.set(name, value);
      return true;
    });
    return newStyle;
  }

  public hasProperties(): boolean {
    let hasProperties = false;
    this.forEach((name: string, value?: number | string) => {
      if (value) {
        hasProperties = true;
        return false;
      }
      return true;
    });
    return hasProperties;
  }

  public clone(): FitStyle {
    return new FitStyle({ ...this.dto });
  }
}

export class FitStyleFactory implements StyleFactory {
  public createStyle(): FitStyle {
    return new FitStyle();
  }

  public createStyle4Dto(dto: FitStyleDto): FitStyle {
    for (const key of Reflect.ownKeys(dto)) {
      const value: unknown = Reflect.get(dto, key);
      if (value && typeof value !== 'number' && typeof value !== 'string') {
        throw Error('Invalid style DTO.');
      }
    }
    return new FitStyle(dto);
  }
}

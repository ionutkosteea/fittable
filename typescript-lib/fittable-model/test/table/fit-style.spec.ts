import {} from 'jasmine';

import { FitStyle } from '../../dist/index.js';

describe('Test FitStyle', () => {
  it('forEachProperty', () => {
    const style: FitStyle = new FitStyle()
      .set('color', 'blue')
      .set('background-color', 'red')
      .set('text-align');
    const testMap: Map<string, string | number | undefined> = new Map();
    style.forEach((name: string, value: string | number | undefined) => {
      testMap.set(name, value);
      return true;
    });
    expect(testMap.size === 3).toBeTruthy();
    expect(testMap.get('color') === 'blue').toBeTruthy();
    expect(testMap.get('background-color') === 'red').toBeTruthy();
    expect(testMap.get('text-align') === undefined).toBeTruthy();
  });

  it('createCssStyle', () => {
    const style: FitStyle = new FitStyle({
      color: 'blue',
      'background-color': 'red',
      'text-align': undefined,
    });
    const cssStyle: string = style.toCssText();
    expect(cssStyle === 'color:blue;background-color:red;').toBeTruthy();
  });

  it('compare to identical styles', () => {
    const thisStyle: FitStyle = new FitStyle({
      color: 'blue',
      'background-color': 'red',
      'text-align': undefined,
    });
    const otherStyle: FitStyle = new FitStyle({
      color: 'blue',
      'background-color': 'red',
      'text-align': undefined,
    });
    expect(thisStyle.equals(otherStyle)).toBeTruthy();
  });

  it('compare to different styles', () => {
    const thisStyle: FitStyle = new FitStyle({
      color: 'blue',
      'background-color': 'red',
      'text-align': undefined,
    });
    const otherStyle: FitStyle = new FitStyle({
      color: 'blue',
      'background-color': 'red',
      'place-items': 'middle',
    });
    expect(thisStyle.equals(otherStyle)).toBeFalsy();
  });

  it('contains style propeties', () => {
    const thisStyle: FitStyle = new FitStyle({
      color: 'blue',
      'background-color': 'red',
      'text-align': undefined,
    });
    const otherStyle: FitStyle = new FitStyle({
      color: 'blue',
    });
    expect(thisStyle.contains(otherStyle)).toBeTruthy();
  });

  it('contains undefined style propeties', () => {
    const thisStyle: FitStyle = new FitStyle({
      color: 'blue',
      'background-color': 'red',
      'text-align': undefined,
    });
    const otherStyle: FitStyle = new FitStyle({
      'text-align': undefined,
    });
    expect(thisStyle.contains(otherStyle)).toBeTruthy();
  });

  it('does not contain style propeties', () => {
    const thisStyle: FitStyle = new FitStyle({
      color: 'blue',
      'background-color': 'red',
      'text-align': undefined,
    });
    const otherStyle: FitStyle = new FitStyle({
      'text-align': 'flex-end',
    });
    expect(thisStyle.contains(otherStyle)).toBeFalsy();
  });

  it('define properties', () => {
    const style: FitStyle = new FitStyle({
      color: 'blue',
      'font-size.px': 12,
      'border-left': undefined,
    });
    expect(style.get('color') === 'blue').toBeTruthy();
    expect(style.get('font-size.px') === 12).toBeTruthy();
    expect(style.get('border-left')).toBeFalsy();
  });

  it('append', () => {
    const thisStyle: FitStyle = new FitStyle()
      .set('font-weight', 'bold')
      .set('text-align', 'flex-end')
      .set('place-items', 'middle');
    const otherStyle: FitStyle = new FitStyle()
      .set('color', 'blue')
      .set('text-align', 'center')
      .set('place-items');
    const resultStyle: FitStyle = thisStyle.append(otherStyle);
    expect(resultStyle.get('font-weight') === 'bold').toBeTruthy();
    expect(resultStyle.get('text-align') === 'center').toBeTruthy();
    expect(resultStyle.get('place-items')).toBeUndefined();
    expect(resultStyle.get('color') === 'blue').toBeTruthy();
  });

  it('hasProperties', () => {
    const style: FitStyle = new FitStyle().set('font-weight', 'bold');
    expect(style.hasProperties()).toBeTruthy();
  });
});

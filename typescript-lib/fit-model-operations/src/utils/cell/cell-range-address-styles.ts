import { Style, CellRange, CellRangeList } from 'fit-core/model/index.js';

export interface AddressStyle {
  style: Style;
  address: CellRangeList;
}

export type RangeAddressStyleDto = {
  style: Style;
  address: CellRange[];
};

export class CellRangeAddressStyles {
  private readonly styleMap: Map<string, AddressStyle> = new Map();

  constructor(dto?: RangeAddressStyleDto) {
    if (!dto) return;
    const styleUid: string = dto.style.toCssText();
    this.styleMap.set(styleUid, {
      style: dto.style,
      address: new CellRangeList(dto.address),
    });
  }

  public set(style: Style, rowId: number, colId: number): void {
    this.getAddress(style)?.addCell(rowId, colId);
  }

  private getAddress(style: Style): CellRangeList | undefined {
    const styleUid: string = style.toCssText();
    if (!this.styleMap.has(styleUid)) {
      this.styleMap.set(styleUid, {
        style,
        address: new CellRangeList(),
      });
    }
    return this.styleMap.get(styleUid)?.address;
  }

  public forEach(entryFn: (style: Style, address: CellRange[]) => void): void {
    for (const uid of this.styleMap.keys()) {
      const addrStyle: AddressStyle | undefined = this.styleMap.get(uid);
      if (addrStyle) {
        entryFn(addrStyle.style, addrStyle.address.getRanges());
      }
    }
  }
}

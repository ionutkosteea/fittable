import { LineRange, LineRangeList } from 'fit-core/model/index.js';

export class LineRangeAddressObjects<Obj> {
  private objectMap: Map<Obj, LineRangeList> = new Map();

  public set(obj: Obj, address: LineRange): this {
    if (!this.objectMap.has(obj)) this.objectMap.set(obj, new LineRangeList());
    this.objectMap.get(obj)?.add(address);
    return this;
  }

  public getAddress(obj: Obj): LineRange[] | undefined {
    return this.objectMap.get(obj)?.sort().getRanges();
  }

  public getAllObjects(): IterableIterator<Obj> {
    return this.objectMap.keys();
  }

  public getAllAddresses(): LineRange[] {
    const addresses: LineRange[] = [];
    for (const value of this.objectMap.values()) {
      value.getRanges().forEach((LineRange) => addresses.push(LineRange));
    }
    return addresses;
  }

  public forEach(entryFn: (obj: Obj, address?: LineRange[]) => void): void {
    for (const obj of this.getAllObjects()) {
      entryFn(obj, this.getAddress(obj));
    }
  }
}

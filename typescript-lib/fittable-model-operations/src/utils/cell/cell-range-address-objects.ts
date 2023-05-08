import { CellRange, CellRangeList } from 'fittable-core/model';

export class CellRangeAddressObjects<Obj> {
  private objectMap: Map<Obj, CellRangeList> = new Map();

  public set(obj: Obj, rowId: number, colId: number): this {
    if (!this.objectMap.has(obj)) this.objectMap.set(obj, new CellRangeList());
    this.objectMap.get(obj)?.addCell(rowId, colId);
    return this;
  }

  public append(other: CellRangeAddressObjects<Obj>): this {
    for (const value of other.getAllObjects()) {
      const address: CellRange[] = other.getAddress(value) ?? [];
      for (const cellRange of address) {
        cellRange.forEachCell((rowId: number, colId: number) => {
          this.set(value, rowId, colId);
        });
      }
    }
    return this;
  }

  public getAddress(obj: Obj): CellRange[] | undefined {
    return this.objectMap.get(obj)?.getRanges();
  }

  public getAllObjects(): IterableIterator<Obj> {
    return this.objectMap.keys();
  }

  public getAllAddresses(): CellRange[] {
    const addresses: CellRange[] = [];
    for (const value of this.objectMap.values()) {
      value.getRanges().forEach((range) => addresses.push(range));
    }
    return addresses;
  }

  public forEach(entryFn: (obj: Obj, address: CellRange[]) => void): void {
    for (const obj of this.getAllObjects()) {
      const address: CellRange[] | undefined = this.getAddress(obj);
      if (address) {
        entryFn(obj, address);
      }
    }
  }

  public clear(): void {
    this.objectMap.clear();
  }
}

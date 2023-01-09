type Cells<V> = { [colId: number]: V };
type Row<T> = { cells: Cells<T> };
type Rows<T> = { [rowId: number]: Row<T> };

export class DoubleKeyMap<V> {
  private rows: Rows<V> = {};

  public keys(): number[] {
    return Reflect.ownKeys(this.rows) as unknown as number[];
  }

  public set(key1: number, key2: number, value: V): this {
    if (!this.rows[key1]) this.rows[key1] = { cells: {} };
    this.rows[key1].cells[key2] = value;
    return this;
  }

  public get(key1: number, key2: number): V | undefined {
    return this.rows[key1]?.cells[key2];
  }

  public getAll(key1: number): V[] | undefined {
    let values: V[] | undefined;
    const cells: Cells<V> | undefined = this.rows[key1]?.cells;
    if (cells) {
      values = [];
      for (const key2 of Reflect.ownKeys(cells)) {
        const value: V | undefined = this.get(key1, key2 as unknown as number);
        value && values.push(value);
      }
    }
    return values;
  }

  public delete(key1: number, key2: number): this {
    const row: Row<V> = this.rows[key1];
    if (row) {
      const cells: Cells<V> = row.cells;
      cells[key2] && Reflect.deleteProperty(cells, key2);
      if (Reflect.ownKeys(cells).length <= 0) {
        Reflect.deleteProperty(this.rows, key1);
      }
    }
    return this;
  }

  public clear(): this {
    this.rows = {};
    return this;
  }
}

type Cells<V> = { [colId: number]: V };
type Row<T> = { cells: Cells<T> };
type Rows<T> = { [rowId: number]: Row<T> };

export class TwoDimensionalMap<V> {
  private rows: Rows<V> = {};

  public getRows(): number[] {
    return Reflect.ownKeys(this.rows) as unknown as number[];
  }

  public setValue(rowId: number, colId: number, value: V): this {
    if (!this.rows[rowId]) this.rows[rowId] = { cells: {} };
    this.rows[rowId].cells[colId] = value;
    return this;
  }

  public hasValue(rowId: number, colId: number): boolean {
    if (!(rowId in this.rows)) return false;
    const row: Row<V> = this.rows[rowId];
    if (!(colId in row.cells)) return false;
    return true;
  }

  public getValue(rowId: number, colId: number): V | undefined {
    return this.rows[rowId]?.cells[colId];
  }

  public getRowValues(rowId: number): V[] | undefined {
    let values: V[] | undefined;
    const cells: Cells<V> | undefined = this.rows[rowId]?.cells;
    if (cells) {
      values = [];
      for (const key2 of Reflect.ownKeys(cells)) {
        const value: V | undefined = this.getValue(
          rowId,
          key2 as unknown as number
        );
        value && values.push(value);
      }
    }
    return values;
  }

  public deleteValue(rowId: number, colId: number): this {
    const row: Row<V> = this.rows[rowId];
    if (row) {
      const cells: Cells<V> = row.cells;
      cells[colId] && delete cells[colId];
      if (Reflect.ownKeys(cells).length <= 0) {
        delete this.rows[rowId];
      }
    }
    return this;
  }

  public deleteRow(rowId: number): this {
    if (this.rows[rowId]) delete this.rows[rowId];
    return this;
  }

  public deleteCol(colId: number): this {
    for (const key of this.getRows()) {
      this.deleteValue(key, colId);
    }
    return this;
  }

  public clearAll(): this {
    this.rows = {};
    return this;
  }
}

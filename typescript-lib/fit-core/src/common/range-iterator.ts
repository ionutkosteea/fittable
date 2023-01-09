export class RangeIterator implements Iterable<number>, Iterator<number> {
  private current = 0;

  constructor(private readonly from: number, private readonly to: number) {}

  public [Symbol.iterator](): Iterator<number> {
    this.current = this.from;
    return this;
  }

  public next(): IteratorResult<number> {
    return this.current < this.to
      ? { done: false, value: this.current++ }
      : { done: true, value: this.current };
  }
}

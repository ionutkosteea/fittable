import { LineRange, createLineRange } from '../line-range.js';

export class LineRangeList {
  private ranges: LineRange[] = [];

  public sort(): this {
    this.ranges = this.ranges.sort((i1, i2) => compareTo(i1, i2));
    return this;
  }

  public getRanges(): LineRange[] {
    return this.ranges;
  }

  public get(index: number): LineRange {
    return this.ranges[index];
  }

  public has(range: LineRange): boolean {
    for (const lineRange of this.ranges) {
      if (lineRange.contains(range)) {
        return true;
      }
    }
    return false;
  }

  public add(range: LineRange): this {
    if (!this.match(range, -1)) {
      this.ranges.push(range);
    }
    return this;
  }

  private match(range: LineRange, removeId: number): boolean {
    let isMatched = false;
    for (let i = 0; i < this.ranges.length; i++) {
      const oldRange: LineRange = this.get(i);
      if (oldRange.equals(range)) {
        isMatched = true;
        continue;
      } else if (isIntersection(oldRange, range)) {
        const newRange: LineRange = this.createReunion(oldRange, range);
        this.addMatched(i, newRange, removeId);
        isMatched = true;
        break;
      } else if (isSubset(oldRange, range)) {
        isMatched = true;
        break;
      } else if (isSubset(range, oldRange)) {
        this.addMatched(i, range, removeId);
        isMatched = true;
        break;
      } else if (isFirstNeighbour(oldRange, range)) {
        const newRange: LineRange = this.merge(range, oldRange);
        this.addMatched(i, newRange, removeId);
        isMatched = true;
        break;
      } else if (isFirstNeighbour(range, oldRange)) {
        const newRange: LineRange = this.merge(oldRange, range);
        this.addMatched(i, newRange, removeId);
        isMatched = true;
        break;
      }
    }
    return isMatched;
  }

  private addMatched(i: number, newRange: LineRange, removeId: number): void {
    this.ranges.splice(i, 1, newRange);
    if (removeId > -1) this.ranges.splice(removeId, 1);
    this.match(newRange, i);
  }

  private createReunion(r1: LineRange, r2: LineRange): LineRange {
    const from: number =
      r1.getFrom() < r2.getFrom() ? r1.getFrom() : r2.getFrom();
    const to: number = r1.getTo() > r2.getTo() ? r1.getTo() : r2.getTo();
    return createLineRange(from, to);
  }

  private merge(first: LineRange, second: LineRange): LineRange {
    return createLineRange(first.getFrom(), second.getTo());
  }
}

function compareTo(current: LineRange, other: LineRange): number {
  return current.getFrom() - other.getFrom();
}

function isIntersection(current: LineRange, other: LineRange): boolean {
  return (
    (current.getFrom() >= other.getFrom() &&
      current.getFrom() <= other.getTo()) ||
    (current.getTo() >= other.getFrom() && current.getTo() <= other.getTo())
  );
}

function isSubset(current: LineRange, other: LineRange): boolean {
  if (
    other.getFrom() >= current.getFrom() &&
    other.getTo() <= current.getTo()
  ) {
    return true;
  }
  return false;
}

function isFirstNeighbour(current: LineRange, other: LineRange): boolean {
  return current.getFrom() === other.getTo() + 1;
}

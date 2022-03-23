export interface INextIterator<T> {
  next(): T | null;
}

export class ArrayIterator<T> implements INextIterator<T> {
  private readonly items: T[];
  protected start: number;
  protected end: number;
  protected index: number;

  constructor(items: T[], start = 0, end: number = items.length, index = start - 1) {
    this.items = items;
    this.start = start;
    this.end = end;
    this.index = index;
  }

  public first(): T | null {
    this.index = this.start;

    return this.current();
  }

  public next(): T | null {
    this.index = Math.min(this.index + 1, this.end);

    return this.current();
  }

  protected current(): T | null {
    if (this.index === this.start - 1 || this.index === this.end) {
      return null;
    }

    return this.items[this.index];
  }
}

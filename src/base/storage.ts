export class JSONParseError extends Error {
  constructor(message?: string) {
    super(message);
  }
}

export abstract class LocalStorageItem<T> {
  protected constructor(public readonly key: string, defaultValue?: T) {
    this.value = this.get();

    if (defaultValue && !this.value) {
      this.set(defaultValue);
    }
  }

  protected value: T;

  public set(value: T): void {
    this.value = value;

    const { key } = this;
    const valueStr = JSON.stringify(value);
    window.localStorage.setItem(key, valueStr);
  }

  public get(): T {
    const { key } = this;

    if (this.value) {
      return this.value;
    }

    return this._parse(key);
  }

  private _parse(key: string): T {
    try {
      const str = window.localStorage.getItem(key);

      if (!str) {
        return this.value;
      }

      return JSON.parse(str);
    } catch (error) {
      throw new JSONParseError(error.message);
    }
  }
}

export class LocalStorageNumberItem extends LocalStorageItem<number> {
  protected value = 0;

  constructor(key: string, defaultValue?: number) {
    super(key, defaultValue);
  }
}

export class LocalStorageStringItem extends LocalStorageItem<string> {
  protected value = '';

  constructor(key: string, defaultValue?: string) {
    super(key, defaultValue);
  }
}

export class LocalStorageBooleanItem extends LocalStorageItem<boolean> {
  protected value = false;

  constructor(key: string, defaultValue?: boolean) {
    super(key, defaultValue);
  }
}

export abstract class AbstractLocalStorageInstance {
  protected constructor(protected readonly namespace: string) {
  }
}

export class NoteStorageInstance extends AbstractLocalStorageInstance {
  public readonly userName: LocalStorageStringItem;

  constructor(
    namespace: string,
  ) {
    super(namespace);

    this.userName = new LocalStorageStringItem(`${namespace}.name`);
  }
}

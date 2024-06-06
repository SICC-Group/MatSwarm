export class LocalStorageItem<T = any> {
  public readonly key: string;
  private defaultValue: T | null

  constructor(key: string, defaultValue: T | any = null) {
    this.key = key;
    this.defaultValue = defaultValue;
  }

  get value(): T {
    return JSON.parse(localStorage.getItem(this.key)) || this.defaultValue;
  }

  set value(obj: T) {
    localStorage.setItem(this.key, JSON.stringify(obj));
  }
}
export class Dict<T> {
  private readonly obj: any;
  constructor(obj: any) {
    this.obj = obj;
  }

  public Get(key: string): T {
    if (this.obj.hasOwnProperty(key)) {
      return this.obj[key];
    }
    else {
      throw new Error(`Dict: key ${key} does not exist in object ${this.obj}`);
    }
  }

  public forEach(callback: (key: string, value: T) => void): void {
    for (const key in this.obj) {
      if (this.obj.hasOwnProperty(key)) {
        callback(key, this.obj[key]);
      }
    }
  }
}

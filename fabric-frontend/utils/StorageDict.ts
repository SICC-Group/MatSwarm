export class StorageDict<T> {
  
    public readonly storageKeyName: string;
  
    constructor(key: string) {
      this.storageKeyName = key;
    }
  
    public Get(key: string): T {
      const obj = JSON.parse(localStorage.getItem(this.storageKeyName)) || {};
      if (obj.hasOwnProperty(key)) {
        return obj[key];
      }
      else {
        return undefined;
      }
    }
  
    public Set(key: string, value: T): void {
      const obj = JSON.parse(localStorage.getItem(this.storageKeyName)) || {};
      obj[key] = value;
      localStorage.setItem(this.storageKeyName, JSON.stringify(obj));
    }
  
    public FindMissing(keys: any[]): string[] {
      const obj = JSON.parse(localStorage.getItem(this.storageKeyName)) || {};
      const ret: string[] = [];
      for (const i of keys) {
        if (!obj.hasOwnProperty(String(i))) {
          ret.push(i);
        }
      }
      return ret;
    }
  }
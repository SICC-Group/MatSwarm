/**
 * 枚举类
 * 使用一个名字的字符串数组初始化
 */
export class Enum<T> {

  public readonly names: string[];
  public readonly values: T[];
  constructor(names: string[], values: T[]) {
    this.names = names;
    this.values = values;
    if (this.names.length !== this.values.length) {
      throw new Error('Enum: Unmatch names and values');
    }
  }

  /**
   * 获得所有枚举值的数组
   */
  public GetValueArray(): T[] {
    return this.values;
  }
  
  /**
   * 获得所有枚举值名字的数组
   * 保证和GetValueArray的返回值一一对应
   */
  public GetNameArray(): string[] {
    return this.names;
  }

  /**
   * 名字转换为值，如果没有找到返回-1
   * @param name 名字
   */
  public NameToValue(name: string): T {
    const index = this.names.indexOf(name);
    return this.values[index];
  }

  /**
   * 值转换为名字，如果没有找到返回undefined
   * @param value 值 
   */
  public ValueToName(value: T): string {
    const index = this.values.indexOf(value);
    return this.names[index];
  }

  public ForEach(callback: (name: string, value: T) => void) {
    const length = this.names.length;
    for (let i = 0; i < length; ++i) {
      callback(this.names[i], this.values[i]);
    }
  }
}

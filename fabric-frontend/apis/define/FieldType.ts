export enum FieldType {
    // 空类型，不建议使用
    Null = 0,
    // 以下是基本类型
    String = 1,
    Number = 2,
    Range = 3,
    Image = 4,
    File = 5,
    Choice = 6,
    // 以下是复合类型
    Array = 7,
    Table = 8,
    Container = 9,
    Generator = 10,
}

export namespace FieldType {
    export type Primitive = FieldType.String | FieldType.Number | FieldType.Choice | FieldType.File | FieldType.Image | FieldType.Range;

    export type Composite = FieldType.Table | FieldType.Container | FieldType.Generator;

    export function isPrimitive(t: FieldType): boolean {
        return (
            t === FieldType.String ||
            t === FieldType.Number ||
            t === FieldType.Choice ||
            t === FieldType.Image ||
            t === FieldType.File ||
            t === FieldType.Range
        );
    }

    export function isComposite(t: FieldType) {
        return (
            t === FieldType.Container ||
            t === FieldType.Generator ||
            t === FieldType.Table
        );
    }
    
    export function isArray(t: FieldType) {
        return t === FieldType.Array;
    }

    export function toMessageID(t: FieldType) {
      switch(t) {
        case FieldType.String: return 'type_string';
        case FieldType.Number: return 'type_number';
        case FieldType.Choice: return 'type_choice';
        case FieldType.Range: return 'type_range';
        case FieldType.Image: return 'type_image';
        case FieldType.File: return 'type_file';
        case FieldType.Container: return 'type_container';
        case FieldType.Generator: return 'type_generator';
        case FieldType.Table: return 'type_table';
        case FieldType.Array: return 'type_array';
      }
      throw 'Invalid Field Type'
    }
}

import { ChoiceItem } from './ChoiceGroup';
import { FieldType } from './FieldType';
import { RangeFieldType } from './RangeFieldType';
import { RawField, RawNumberField, RawRangeField, RawImageField, RawFileField, RawChoiceField, RawArrayField, RawTableField, RawContainerField, RawGeneratorField } from './RawField';

export interface BaseField {
  required: boolean;
  title: string;
  type: FieldType;
  rawtitle?:boolean; //判断是否为原始模板中的字段
}

// 字符串
export interface StringField extends BaseField {
  type: FieldType.String;
}
// 数值
export interface NumberFieldExtra {
  unit: string;
}
type _NumberField = BaseField & NumberFieldExtra;
export interface NumberField extends _NumberField {
  type: FieldType.Number;
}
// 范围
export interface RangeFieldExtra {
  subType: RangeFieldType;
  unit: string;
}
type _RangeField = BaseField & RangeFieldExtra;
export interface RangeField extends _RangeField {
  type: FieldType.Range;
}
// 图片
export interface ImageFieldExtra {
  allowMulti: boolean;
}
type _ImageField = BaseField & ImageFieldExtra;
export interface ImageField extends _ImageField {
  type: FieldType.Image;
}
// 文件
export interface FileFieldExtra {
  allowMulti: boolean;
}
type _FileField = BaseField & FileFieldExtra;
export interface FileField extends _FileField {
  type: FieldType.File;
}


// 候选
export interface ChoiceFieldExtra {
  choices: ChoiceItem[];
}
type _ChoiceField = BaseField & ChoiceFieldExtra;
export interface ChoiceField extends _ChoiceField {
  type: FieldType.Choice;
}

export type FieldExtra = NumberFieldExtra | RangeFieldExtra | ChoiceFieldExtra | ImageFieldExtra | FileFieldExtra;
export type PrimitiveField = StringField | NumberField | ChoiceField | ImageField | RangeField | FileField;

interface CompositeBase extends BaseField {
  children: AnyField[];
}

export interface ContainerField extends CompositeBase {
  type: FieldType.Container;
}

export interface TableField extends CompositeBase {
  children: PrimitiveField[];
  type: FieldType.Table;
}

export interface GeneratorField extends CompositeBase {
  type: FieldType.Generator;
  children: Array<PrimitiveField | ArrayField | TableField | ContainerField>;
}

export interface ArrayField extends CompositeBase {
  children: Array<PrimitiveField | TableField | GeneratorField | ContainerField>;
  type: FieldType.Array;
}


export type CompositeField = ContainerField | ArrayField | GeneratorField | TableField;
export type AnyField = PrimitiveField | CompositeField;

/**
 * 将原始的模板字段转换成新的
 * @param raw 原始模板字段
 * @param title 字段标题
 * @returns 新的模板字段
 */
export function RawFieldToField(rawField: RawField, title: string): AnyField {

  const ret = { title, required: rawField.r, type: rawField.t,rawtitle:true } as AnyField;//转换时为原来的模板字段加上辨识符rawtitle

  const raw = rawField;
  if (raw.misc == null) {
    raw.misc = {};
  }

  const mapper = (s: string) => RawFieldToField((raw.misc as any)[s], s);

  switch (ret.type) {
    case FieldType.String: {
      break;
    }
    case FieldType.Number: {
      (ret as NumberField).unit = (raw as RawNumberField).misc.unit || '';
      break;
    }
    case FieldType.Range: {
      (ret as RangeField).unit = (raw as RawRangeField).misc.unit || '';
      (ret as RangeField).subType = (raw as RawRangeField).misc.type;
      break;
    }
    case FieldType.Image: {
      (ret as ImageField).allowMulti = (raw as RawImageField).misc.multi;
      break;
    }
    case FieldType.File: {
      (ret as FileField).allowMulti = (raw as RawFileField).misc.multi;
      break;
    }
    case FieldType.Choice: {
      const rawChoice = (raw as RawChoiceField);
      (ret as ChoiceField).choices = (rawChoice.misc.opt as ChoiceItem[]).concat(rawChoice.misc.grp);
      break;
    }
    case FieldType.Array: {
      const item = RawFieldToField((raw as RawArrayField).misc, '');
      (ret as ArrayField).children = [item as PrimitiveField];
      break;
    }
    case FieldType.Table: {
      ret.children = (raw as RawTableField).misc._head.map(mapper) as any;
      break;
    }
    case FieldType.Container: {
      ret.children = (raw as RawContainerField).misc._ord.map(mapper);
      break;
    }
    case FieldType.Generator: {
      ret.children = (raw as RawGeneratorField).misc._opt.map(mapper) as any;
      break;
    }
  }
  return (ret as AnyField);
}

function CreatePrimitive(type: FieldType.Primitive): PrimitiveField {
  const ret: any = { title: '', required: false, type };
  switch (type) {
    case FieldType.String: break;
    case FieldType.Number: {
      (ret as NumberField).unit = '';
      break;
    }
    case FieldType.Range: {
      (ret as RangeField).unit = '';
      (ret as RangeField).subType = RangeFieldType.Interval;
      break;
    }
    case FieldType.Image:
    case FieldType.File: {
      (ret as FileField).allowMulti = false;
      break;
    }
    case FieldType.Choice: {
      (ret as ChoiceField).choices = [];
      break;
    }
  }
  return ret;
}

// 创建一个空的新字段
export function Create(type: FieldType): AnyField {
  if (FieldType.isPrimitive(type)) {
    return CreatePrimitive(type as FieldType.Primitive);
  }

  const ret = { title: '', required: false, type } as BaseField;
  switch (type) {
    case FieldType.Array: {
      (ret as ArrayField).children = [];
      break;
    }
    case FieldType.Table: {
      (ret as TableField).children = [];
      break;
    }
    case FieldType.Container: {
      (ret as ContainerField).children = [];
      break;
    }
    case FieldType.Generator: {
      (ret as GeneratorField).children = [];
      break;
    }
    default: throw new Error(`Invalid field type: ${ret.type}`);
  }
  return ret as AnyField;
}

import { ChoiceItem } from './ChoiceGroup';
import { FieldType } from './FieldType';
import { RangeFieldType } from './RangeFieldType';

export interface RawBaseField {
    r: boolean; // 是否必填
    misc: any; // 额外信息
}

/**
 * 字符串型
 * t=1
 */
export interface RawStringField extends RawBaseField {
    /**
     * 字符类型的misc为空
     */
    misc: {}; // 字符类型的misc为空
    t: FieldType.String;
}

/**
 * 数值型
 * t=2
 */
export interface RawNumberField extends RawBaseField {
    /**
     * 数值型的misc包括其单位
     */
    misc: { unit: string; };
    t: FieldType.Number;
}

/**
 * 范围型
 * t=3
 */
export interface RawRangeField extends RawBaseField {
    /**
     * 范围型的misc描述其子类型（误差或者区间）及其单位
     */
    misc: { type: RangeFieldType, unit: string };
    t: FieldType.Range;
}

/**
 * 图片型
 * t=4
 */
export interface RawImageField extends RawBaseField {
    /** 图片型的misc描述其是否允许多张图片 */
    misc: { multi: boolean; };
    t: FieldType.Image;
}

/**
 * 文件型，和图片型类型一致
 * t=5
 */
export interface RawFileField extends RawBaseField {
    /** 文件型的misc描述其是否允许多张图片 */
    misc: { multi: boolean; };
    t: FieldType.File;
}

/**
 * 候选型
 * t=6
 */
export interface RawChoiceField extends RawBaseField {
    /** 候选型的misc描述其支持的选项 */
    misc: { opt: string[]; grp: ChoiceItem[] };
    t: FieldType.Choice;
}

/**
 * 数组型
 * t=7
 */
export interface RawArrayField extends RawBaseField {
    misc: RawField;
    t: FieldType.Array;
}

/**
 * 表格型
 * t=8
 */
export interface RawTableField extends RawBaseField {
    misc: { _head: string[]; [x: string]: any };
    t: FieldType.Table;
}

/**
 * 容器型
 * t=9
 */
export interface RawContainerField extends RawBaseField {
    misc: { _ord: string[]; [x: string]: any };
    t: FieldType.Container;
}

/**
 * 生成器型
 * t=10
 */
export interface RawGeneratorField extends RawBaseField {
    misc: { _opt: string[]; [x: string]: any };
    t: FieldType.Generator;
}

export type RawField = RawStringField | RawNumberField | RawRangeField | RawImageField | RawFileField | RawChoiceField | RawArrayField | RawTableField | RawContainerField | RawGeneratorField;

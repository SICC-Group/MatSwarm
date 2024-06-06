import React, { FC } from 'react';

import { BaseFieldProps } from './common/BaseFieldProps';
import { FieldBoxEdit } from './common/FieldBoxEdit';
import { StringField, NumberField, RangeField, ChoiceField, ImageField, FileField, ArrayField, TableField, ContainerField, GeneratorField, AnyField } from '../../../apis/define/Field';
import { StringContentView } from './content/String';
import { NumberContentView } from './content/Number';
import { RangeContentView } from './content/Range';
import { ChoiceContentView } from './content/Choice';
import { ImageContentView } from './content/Image';
import { FileContentView } from './content/File';
import { ArrayContentEdit } from './content/Array';
import { TableContentEdit } from './content/Table';
import { ContainerContentEdit } from './content/Container';
import { GeneratorContentEdit } from './content/Generator';
import { FieldType } from '../../../apis/define/FieldType';

export const StringFieldView: FC<BaseFieldProps<StringField>> = (props) => {
  return (
    <FieldBoxEdit {...props}>
      <StringContentView {...props} />
    </FieldBoxEdit>
  )
}

export const NumberFieldView: FC<BaseFieldProps<NumberField>> = (props) => {
  return (
    <FieldBoxEdit {...props}>
      <NumberContentView {...props} />
    </FieldBoxEdit>
  )
}

export const RangeFieldView: FC<BaseFieldProps<RangeField>> = (props) => {
  return (
    <FieldBoxEdit {...props}>
      <RangeContentView {...props} />
    </FieldBoxEdit>
  )
}

export const ChoiceFieldView: FC<BaseFieldProps<ChoiceField>> = (props) => {
  return (
    <FieldBoxEdit {...props}>
      <ChoiceContentView {...props} />
    </FieldBoxEdit>
  )
}

export const ImageFieldView: FC<BaseFieldProps<ImageField>> = (props) => {
  return (
    <FieldBoxEdit {...props}>
      <ImageContentView {...props} />
    </FieldBoxEdit>
  )
}

export const FileFieldView: FC<BaseFieldProps<FileField>> = (props) => {
  return (
    <FieldBoxEdit {...props}>
      <FileContentView {...props} />
    </FieldBoxEdit>
  )
}

export const ArrayFieldView: FC<BaseFieldProps<ArrayField>> = (props) => {
  return (
    <FieldBoxEdit {...props}>
      <ArrayContentEdit {...props}/>
    </FieldBoxEdit>
  )
}

export const TableFieldView: FC<BaseFieldProps<TableField>> = (props) => {
  return (
    <FieldBoxEdit {...props}>
      <TableContentEdit {...props}/>
    </FieldBoxEdit>
  )
}

export const ContainerFieldView: FC<BaseFieldProps<ContainerField>> = (props) => {
  return (
    <FieldBoxEdit {...props}>
      <ContainerContentEdit {...props}/>
    </FieldBoxEdit>
  )
}

export const GeneratorFieldView: FC<BaseFieldProps<GeneratorField>> = (props) => {
  return (
    <FieldBoxEdit {...props}>
      <GeneratorContentEdit {...props}/>
    </FieldBoxEdit>
  )
}

export function FieldTypeToComponentEdit(type: FieldType): React.FunctionComponent<BaseFieldProps<AnyField>> {
  switch (type) {
      case FieldType.String: return StringFieldView as any;
      case FieldType.Image: return ImageFieldView as any;
      case FieldType.Range: return RangeFieldView as any;
      case FieldType.File: return FileFieldView as any;
      case FieldType.Choice: return ChoiceFieldView as any;
      case FieldType.Number: return NumberFieldView as any;
      case FieldType.Container: return ContainerFieldView as any;
      case FieldType.Array: return ArrayFieldView as any;
      case FieldType.Table: return TableFieldView as any;
      case FieldType.Generator: return GeneratorFieldView as any;
    }
}

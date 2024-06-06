import React, { FC } from 'react';

import { BaseFieldProps } from './common/BaseFieldProps';
import { FieldBox } from './common/FieldBox';

import { StringField, NumberField, RangeField, ChoiceField, ImageField, FileField, ArrayField, TableField, ContainerField, GeneratorField, AnyField } from '../../../apis/define/Field';
import { StringContentView } from './content/String';
import { NumberContentView } from './content/Number';
import { RangeContentView } from './content/Range';
import { ChoiceContentView } from './content/Choice';
import { ImageContentView } from './content/Image';
import { FileContentView } from './content/File';
import { ArrayContentView } from './content/Array';
import { TableContentView } from './content/Table';
import { ContainerContentView } from './content/Container';
import { GeneratorContentView } from './content/Generator';
import { FieldType } from '../../../apis/define/FieldType';

export const StringFieldView: FC<BaseFieldProps<StringField>> = (props) => {
  return (
    <FieldBox {...props}>
      <StringContentView {...props} />
    </FieldBox>
  )
}

export const NumberFieldView: FC<BaseFieldProps<NumberField>> = (props) => {
  return (
    <FieldBox {...props}>
      <NumberContentView {...props} />
    </FieldBox>
  )
}

export const RangeFieldView: FC<BaseFieldProps<RangeField>> = (props) => {
  return (
    <FieldBox {...props}>
      <RangeContentView {...props} />
    </FieldBox>
  )
}

export const ChoiceFieldView: FC<BaseFieldProps<ChoiceField>> = (props) => {
  return (
    <FieldBox {...props}>
      <ChoiceContentView {...props} />
    </FieldBox>
  )
}

export const ImageFieldView: FC<BaseFieldProps<ImageField>> = (props) => {
  return (
    <FieldBox {...props}>
      <ImageContentView {...props} />
    </FieldBox>
  )
}

export const FileFieldView: FC<BaseFieldProps<FileField>> = (props) => {
  return (
    <FieldBox {...props}>
      <FileContentView {...props} />
    </FieldBox>
  )
}

export const ArrayFieldView: FC<BaseFieldProps<ArrayField>> = (props) => {
  return (
    <FieldBox {...props}>
      <ArrayContentView {...props} />
    </FieldBox>
  )
}

export const TableFieldView: FC<BaseFieldProps<TableField>> = (props) => {
  return (
    <FieldBox {...props}>
      <TableContentView {...props} />
    </FieldBox>
  )
}

export const ContainerFieldView: FC<BaseFieldProps<ContainerField>> = (props) => {
  return (
    <FieldBox {...props}>
      <ContainerContentView {...props} />
    </FieldBox>
  )
}

export const GeneratorFieldView: FC<BaseFieldProps<GeneratorField>> = (props) => {
  return (
    <FieldBox {...props}>
      <GeneratorContentView {...props} />
    </FieldBox>
  )
}

export function FieldTypeToComponent(type: FieldType): React.FunctionComponent<BaseFieldProps<AnyField>> {
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

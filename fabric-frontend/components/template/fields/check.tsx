import React, { FC } from 'react';

import { BaseFieldProps } from './common/BaseFieldProps';
import { FieldBoxCheck } from './common/FieldBoxCheck';

import { StringField, NumberField, RangeField, ChoiceField, ImageField, FileField, ArrayField, TableField, ContainerField, GeneratorField, AnyField } from '../../../apis/define/Field';
import { String } from './content/String';
import { Number } from './content/Number';
import { Range } from './content/Range';
import { Choice } from './content/Choice';
import { Image } from './content/Image';
import { File } from './content/File';
import { Array } from './content/Array';
import { Table } from './content/Table';
import { Container } from './content/Container';
import { Generator } from './content/Generator';
import { FieldType } from '../../../apis/define/FieldType';

export const StringFieldView: FC<BaseFieldProps<StringField>> = (props) => {
  return (
    <FieldBoxCheck {...props}>
      <String {...props} />
    </FieldBoxCheck>
  )
}

export const NumberFieldView: FC<BaseFieldProps<NumberField>> = (props) => {
  return (
    <FieldBoxCheck {...props}>
      <Number {...props} />
    </FieldBoxCheck>
  )
}

export const RangeFieldView: FC<BaseFieldProps<RangeField>> = (props) => {
  return (
    <FieldBoxCheck {...props}>
      <Range {...props} />
    </FieldBoxCheck>
  )
}

export const ChoiceFieldView: FC<BaseFieldProps<ChoiceField>> = (props) => {
  return (
    <FieldBoxCheck {...props}>
      <Choice {...props} />
    </FieldBoxCheck>
  )
}

export const ImageFieldView: FC<BaseFieldProps<ImageField>> = (props) => {
  return (
    <FieldBoxCheck {...props}>
      <Image {...props} />
    </FieldBoxCheck>
  )
}

export const FileFieldView: FC<BaseFieldProps<FileField>> = (props) => {
  return (
    <FieldBoxCheck {...props}>
      <File {...props} />
    </FieldBoxCheck>
  )
}

export const ArrayFieldView: FC<BaseFieldProps<ArrayField>> = (props) => {
  return (
    <FieldBoxCheck {...props}>
      <Array {...props} />
    </FieldBoxCheck>
  )
}

export const TableFieldView: FC<BaseFieldProps<TableField>> = (props) => {
  return (
    <FieldBoxCheck {...props}>
      <Table {...props} />
    </FieldBoxCheck>
  )
}

export const ContainerFieldView: FC<BaseFieldProps<ContainerField>> = (props) => {
  return (
    <FieldBoxCheck {...props}>
      <Container {...props} />
    </FieldBoxCheck>
  )
}

export const GeneratorFieldView: FC<BaseFieldProps<GeneratorField>> = (props) => {
  return (
    <FieldBoxCheck {...props}>
      <Generator {...props} />
    </FieldBoxCheck>
  )
}

export function FieldCheck(type: FieldType): React.FunctionComponent<BaseFieldProps<AnyField>> {
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

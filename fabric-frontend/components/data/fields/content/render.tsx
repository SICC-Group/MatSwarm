import React from 'react';
import { Collapse } from 'antd';

import { AnyField } from '../../../../apis/define/Field';
import { Title } from '../common/Title';
import { FieldType } from '../../../../apis/define/FieldType';
import { StringInputFieldContent } from './String';
import { NumberInputFieldContent } from './Number';
import { RangeInputFieldContent } from './Range';
import { ChoiceInputFieldContent } from './Choice';
import { ImageInputFieldContent } from './Image';
import { FileInputFieldContent, FileInputFieldContentAll } from './File';
import { ContainerInputFieldContent } from './Container';
import { TableInputFieldContent } from './Table';
import { ArrayInputFieldContent } from './Array';
import { GeneratorInputFieldContent } from './Generator';
import { InputFieldProps } from '../Props';


export const FieldTypeToContentView = (type: FieldType): React.FunctionComponent<InputFieldProps<AnyField>> => {
  switch (type) {
    case FieldType.String: return StringInputFieldContent as any;
    case FieldType.Number: return NumberInputFieldContent as any;
    case FieldType.Range: return RangeInputFieldContent as any;
    case FieldType.Choice: return ChoiceInputFieldContent as any;
    case FieldType.Image: return ImageInputFieldContent as any;
    // case FieldType.File: return FileInputFieldContent as any;
    case FieldType.File: return FileInputFieldContentAll as any;
    case FieldType.Container: return ContainerInputFieldContent as any;
    case FieldType.Table: return TableInputFieldContent as any;
    case FieldType.Array: return ArrayInputFieldContent as any;
    case FieldType.Generator: return GeneratorInputFieldContent as any;
  }
  throw 'Invalid Field Type';
}

export function InputFieldRender(fields: AnyField[], informUpdate: () => void, parent: any, noTitle?: boolean) {
  const result = fields.map((value, index, array) => {

    let title = value.title;
    if (value.required) title = title + '*';
    const View = FieldTypeToContentView(value.type);
    if (noTitle) {
      return (
        <View key={index} parent={parent} name={value.title} informUpdate={informUpdate} field={value} />
      );
    }
    else if (FieldType.isComposite(value.type) || FieldType.isArray(value.type)) {
      return (
        <Collapse defaultActiveKey={['1']} key={index} style={{margin: '8px 0'}}>
          <Collapse.Panel key='1' header={title}>
            <View parent={parent} name={value.title} informUpdate={informUpdate} field={value} />
          </Collapse.Panel>
        </Collapse>
      )
    }
    else {
      return (
        <div key={index} style={{margin: '8px 0', clear: 'both'}}>
          <Title name={title} />
          <View parent={parent} name={value.title} informUpdate={informUpdate} field={value} />
        </div>
      )
    };
  })
  return result;
}

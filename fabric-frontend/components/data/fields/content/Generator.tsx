import React, { FC } from 'react';
import { Select } from 'antd';

import { InputFieldProps } from '../Props';
import { GeneratorField } from '../../../../apis/define/Field';
import { FieldTypeToContentView } from './render';

const Option = Select.Option;

export const GeneratorInputFieldContent: FC<InputFieldProps<GeneratorField>> = (props) => {
  const { parent, name, informUpdate, field } = props;
  const object = parent[name] || {};
  
  const handleSelectChange = (newValue: number) => {
    console.log(newValue);
    parent[name] = {};
    parent[name][field.children[newValue].title] = undefined;
    informUpdate();
  }

  const informParentUpdate = () => {
    parent[name] = object;
    informUpdate();
  }

  let selected = 0;
  field.children.forEach((value, index) => {
    if (Object.keys(object).includes(value.title)) {
      selected = index;
    }
  })
  // 最开始没选中任何一项，所以需要手动加上0号对应的字段
  if (Object.keys(object).length === 0) {
    object[field.children[selected].title] = undefined;
  }
  const View = FieldTypeToContentView(field.children[selected].type);
  return (
    <div>
      <div>选取一种类型以生成对应的表单</div>
      <Select onChange={handleSelectChange} value={selected}>
        {field.children.map((value, index) => {
          return <Option value={index} key={index}>{value.title}</Option>
        })}
      </Select>
      <div style={{margin: '8px 0'}}>
        <View parent={object} name={field.children[selected].title}
        informUpdate={informParentUpdate} 
        field={field.children[selected]}/>
      </div>
      
    </div>
  )
}

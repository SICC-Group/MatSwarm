import React, { FC } from 'react';
import { Select } from 'antd';

import { InputFieldProps } from '../Props';
import { ChoiceField } from '../../../../apis/define/Field';

import { ChoiceItem, ChoiceGroupItem } from '../../../../apis/define/ChoiceGroup';

const Option = Select.Option;
const OptGroup = Select.OptGroup;

export const ChoiceInputFieldContent: FC<InputFieldProps<ChoiceField>> = (props) => {
  const { parent, name, informUpdate, field } = props;

  const handleChange = (newValue: string) => {
    parent[name] = newValue;
    informUpdate();
  }

  const optionRender = (options: ChoiceItem[]) => {
    return options.map((value) => {
      if (Object.keys(value).includes('name')) {
        const item = value as ChoiceGroupItem;
        return (
          <OptGroup label={item.name}>
            {optionRender(item.items)}
          </OptGroup>
        )
      }
      else {
        const item = value as string;
        return <Option key={item} value={item}>{item}</Option>
      }
    })
  }

  return (
    <div>
      <Select value={parent[name]} onChange={handleChange} style={{minWidth: '120px', width:'50%'}} allowClear>
        {optionRender(field.choices)}
      </Select>
    </div>
  )
}

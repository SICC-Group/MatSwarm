import React, { FC ,useState} from 'react';
import { Input,InputNumber } from 'antd';

import { InputFieldProps } from '../Props';
import { NumberField } from '../../../../apis/define/Field';


export const NumberInputFieldContent: FC<InputFieldProps<NumberField>> = (props) => {
  const { parent, name, informUpdate, field} = props;
  const handleValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if(e.target.value === ''){
      parent[name] = null;
    }
    else{
      parent[name] = Number(e.target.value);
    }
    informUpdate();
  }
  let value = parent[name];
  if (value === undefined) { value = null; }
  return (
    <div>
      <Input style={{ minWidth:120}} type='number' value={value} onChange={handleValueChange} addonAfter={field.unit || null}/>
    </div>
  )
}

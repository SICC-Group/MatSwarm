import React, { FC } from 'react';
import { Input } from 'antd';

import { InputFieldProps } from '../Props';
import { StringField } from '../../../../apis/define/Field';

export const StringInputFieldContent: FC<InputFieldProps<StringField>> = (props) => {
  
  const { parent, name, informUpdate} = props;
  
  const handleValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    parent[name] = e.target.value;
    informUpdate();
  }

  return (
    <div>
      <Input value={parent[name] || ''} onChange={handleValueChange}/>
    </div>
  )
}

import React, { FC } from 'react';
import { Input } from 'antd';

import { InputFieldProps } from '../Props';
import { RangeField } from '../../../../apis/define/Field';

import { RangeFieldType } from '../../../../apis/define/RangeFieldType';

export const RangeInputFieldContent: FC<InputFieldProps<RangeField>> = (props) => {
  const { parent, name, informUpdate, field } = props;
  const object = parent[name] || {};
  
  let value1 = (field.subType === RangeFieldType.Errors ? object['val']: object['lb']);
  let value2 = (field.subType === RangeFieldType.Errors ? object['err']: object['ub']);
  if (value1 === undefined) value1 = '';
  if (value2 === undefined) value2 = '';

  const handleInput1Change = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val1: any = e.target.value;
    if (val1 !== '') {
      val1 = Number(val1);
    }
    else {
      val1 = undefined;
    }
    if (field.subType === RangeFieldType.Errors) {
      parent[name] = {
        val: val1, err: value2,
      }
    }
    else {
      parent[name] = {
        lb: val1, ub: value2,
      }
    }
    informUpdate();
  }

  const handleInput2Change = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val2: any = e.target.value;
    if (val2 !== '') {
      val2 = Number(val2);
    }
    else {
      val2 = undefined;
    }

    if (field.subType === RangeFieldType.Errors) {
      parent[name] = {
        val: value1, err: val2,
      }
    }
    else {
      parent[name] = {
        lb: value1, ub: val2,
      }
    }
    informUpdate();
  }

  return (
    <div>
      <Input style={{display: 'inline', width: 'unset'}} type='number' onChange={handleInput1Change} value={value1}/>
      &nbsp;{field.subType === RangeFieldType.Errors ? '±' : '~'}&nbsp;
      <Input style={{display: 'inline', width: 'unset'}} type='number' onChange={handleInput2Change} value={value2}/>
      {field.unit}
    </div>
  )
}

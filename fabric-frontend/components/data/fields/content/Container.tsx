import React, { FC } from 'react';
import { InputFieldProps } from '../Props';
import { ContainerField } from '../../../../apis/define/Field';
import { InputFieldRender } from './render';

export const ContainerInputFieldContent: FC<InputFieldProps<ContainerField>> = (props) => {

  const { parent, name, informUpdate, field } = props;
  const obj = parent[name] || {};

  const informParentUpdate = () => {
    parent[name] = obj;
    informUpdate();
  }

  return (
    <>
      {InputFieldRender(field.children, informParentUpdate, obj)}
    </>
  )
}
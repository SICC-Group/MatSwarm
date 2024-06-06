import React, { FC } from 'react';
import { Radio } from 'antd';

export enum RenderType {
  List, Table,
}

export interface Props {
  value: RenderType;
  onChange: (newValue: RenderType) => void;
}

export const RenderTypeView: FC<Props> = ({ value, onChange }) => {
  return (
    <Radio.Group size='small' value={value} onChange={(e) => onChange(e.target.value)}>
      <Radio.Button value={RenderType.List}>
        <i className="fa fa-list" aria-hidden="true"/>
      </Radio.Button>
      <Radio.Button value={RenderType.Table}>
        <i className="fa fa-table" aria-hidden="true"/>
      </Radio.Button>
    </Radio.Group>
  )
}

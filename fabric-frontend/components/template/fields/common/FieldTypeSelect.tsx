import React, { FC } from 'react';
import { Select } from 'antd';
import { FieldType } from '../../../../apis/define/FieldType';
import { FormattedMessage } from 'react-intl';

const Option = Select.Option;

export interface FieldTypeSelectProps {
  noArray?: boolean;
  noGenerator?: boolean;
  value?: FieldType;
  disable?: boolean;
  onChange: (value: FieldType) => void;
}

export const FieldTypeSelect: FC<FieldTypeSelectProps> = (props) => {
  return (
    <Select disabled={props.disable} onChange={props.onChange} value={props.value} style={{width: '120px'}}>
      <Option value={FieldType.String}>
        <FormattedMessage id='type_string' />
      </Option>
      <Option value={FieldType.Number}>
        <FormattedMessage id='type_number' />
      </Option>
      <Option value={FieldType.Range}>
        <FormattedMessage id='type_range' />
      </Option>
      <Option value={FieldType.Choice}>
        <FormattedMessage id='type_choice'/>
      </Option>
      <Option value={FieldType.Image}>
        <FormattedMessage id='type_image'  />
      </Option>
      <Option value={FieldType.File}>
        <FormattedMessage id='type_file'  />
      </Option>
      {
        props.noArray ? null : (
          <Option value={FieldType.Array}>
            <FormattedMessage id='type_array' />
          </Option>
        )
      }
      <Option value={FieldType.Table}>
        <FormattedMessage id='type_table' />
      </Option>
      <Option value={FieldType.Container}>
        <FormattedMessage id='type_container'/>
      </Option>
      {
        props.noGenerator ? null : (
          <Option value={FieldType.Generator}>
            <FormattedMessage id='type_generator' />
          </Option>
        )
      }
    </Select>
  )
}

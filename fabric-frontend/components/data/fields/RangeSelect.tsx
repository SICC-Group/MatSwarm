import { Select, TreeSelect } from 'antd';
import React, { FC, useEffect, useState } from 'react';
import { FormattedMessage } from 'react-intl';

const TreeNode = TreeSelect.TreeNode;
const { Option, OptGroup } = Select;

export interface Props {
  style?: React.CSSProperties;
  value?: string;
  onChange: (newValue: string) => void;
  is_edit?: boolean;
}

export const RangeSelect: FC<Props> = (props) => {
  return (
    <Select style={props.style } value={props.value} onChange={props.onChange}
            // disabled={props.value !== '00'}
    >
      <Option value='0'><FormattedMessage id='data:range_1' defaultMessage='将元数据同步到国家平台' /></Option>
      <Option value='1'><FormattedMessage id='data:range_2' defaultMessage='将元数据和模板同步到国家平台' /></Option>
      <Option value='2'><FormattedMessage id='data:range_3' defaultMessage='将元数据和模板以及数据内容同步到国家平台' /></Option>
    </Select>
  )
}

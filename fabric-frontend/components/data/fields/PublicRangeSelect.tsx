import { Select, TreeSelect } from 'antd';
import React, { FC, useEffect, useState } from 'react';

const TreeNode = TreeSelect.TreeNode;
const { Option, OptGroup } = Select;

export interface Props {
  style?: React.CSSProperties;
  value?: string;
  onChange: (newValue: string) => void;
  is_edit?: boolean;
}

export const PublicRangeSelect: FC<Props> = (props) => {
  return (
    <Select style={props.style} value={props.value} onChange={props.onChange}
            // disabled={props.is_edit === true}
    >
      <Option value='00'>公开</Option>
      <OptGroup label='项目内可见'>
        <Option value='11'>项目内可见-1年后公开</Option>
        <Option value='12'>项目内可见-2年后公开</Option>
        <Option value='13'>项目内可见-3年后公开</Option>
      </OptGroup>
      <OptGroup label='课题内可见'>
        <Option value='21'>课题内可见-1年后公开</Option>
        <Option value='22'>课题内可见-2年后公开</Option>
        <Option value='23'>课题内可见-3年后公开</Option>
      </OptGroup>
      <OptGroup label='个人可见'>
        <Option value='31'>个人可见-1年后公开</Option>
        <Option value='32'>个人可见-2年后公开</Option>
        <Option value='33'>个人可见-3年后公开</Option>
      </OptGroup>
    </Select>
  )
}

import React, { FC, useState, useEffect } from 'react';
import { Select } from 'antd';

import { GetProjectList } from '../../../apis/project/GetProjectList';
import { Project } from '../../../apis/define/Project';

const Option = Select.Option;

export interface Props {
  style?: React.CSSProperties;
  value?: string;
  onChange: (newValue: string) => void;
}

export const ProjectSelect: FC<Props> = (props) => {

  const [loading, setLoading] = useState(true);
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    GetProjectList(0, 1).then((value: any) => {
      setLoading(false);
      setProjects(value);
      console.log(value)
    })
  }, [])

  return (
    <Select style={props.style} loading={loading} onChange={props.onChange} value={props.value} allowClear>
      { projects.map(value => (
        <Option key={value.id} value={value.id}>
          {value.id}/{value.name}
        </Option>))}
    </Select>
  )
}

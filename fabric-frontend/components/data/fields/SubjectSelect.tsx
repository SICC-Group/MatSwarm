import React, { FC, useState, useEffect } from 'react';
import { Select } from 'antd';

import { GetSubjectList } from '../../../apis/project/GetSubjectList';
import { Subject } from '../../../apis/define/Subject';

const Option = Select.Option;

export interface Props {
  style?: React.CSSProperties;
  value?: string;
  projectID?: string;
  onChange: (newValue: string) => void;
}

export const SubjectSelect: FC<Props> = (props) => {

  const [loading, setLoading] = useState(true);
  const [subjects, setSubjects] = useState<Subject[]>([]);

  useEffect(() => {
    setLoading(true);
    console.log(props.projectID)
    if (props.projectID == null || props.projectID == '') {
      return;
    }
    GetSubjectList(props.projectID).then((value) => {
      setLoading(false);
      setSubjects(value);
    })
  }, [props.projectID]);

  return (
    <Select style={props.style} loading={loading} onChange={props.onChange} value={props.value} allowClear>
      {subjects.map(value => (
        <Option key={value.id} value={value.id}>
          {value.id}/{value.name}
        </Option>))}
    </Select>
  )
}

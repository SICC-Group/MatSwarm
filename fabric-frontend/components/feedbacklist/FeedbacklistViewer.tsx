import React, { FC, useEffect, useState } from 'react';
import { Table, Tag } from 'antd';
import { TEXT } from '../../locale/Text';
import { RouteComponentProps, withRouter } from 'react-router';
const Column = Table.Column;
export interface FeedbacklistViewerProps {
  data: any[];
  loading?: boolean;
}


const _FeedbacklistViewer: FC<FeedbacklistViewerProps & RouteComponentProps> = (props) => {
  const [innerdata, setInnerData] = useState<any[]>([]);
  useEffect(() => {
    setInnerData(props.data);
  }, [props.data]);
  return (
    <div>
      <Table
        dataSource={innerdata} loading={props.loading} 
      >
        <Column title={TEXT('feedback:id', '#')} dataIndex='id' key='id' render={(text,record:any)=>{
          console.log(record)
                    return <a href={`/feedback_detail?id=${record.id}`} >{text}</a>
                } }/>
        <Column title={TEXT('feedback:status', '状态')} dataIndex='status' key='status'
          render={(record) => {
            let content = null;
            let color = null;
            switch (record) {
              case 1: content = TEXT('feedback:processing', '处理中'); break;
              case 2: content = TEXT('feedback:closing', '已关闭'); break;
              case 3: content = TEXT('feedback:successing', '已完成'); break;
            }
            if (record === 1) {
              color = 'green';
            }
            if (record === 2) {
              color = 'volcano';
            }
            if (record === 3) {
              color = 'yellow';
            }
            return (
              <Tag color={color} key={content.props}>
                {content}
              </Tag>
            );

          }}
        />
        <Column title={TEXT('feedback:title', '话题')} dataIndex='title' key='title' />
        <Column title={TEXT('feedback:t_type', '主题')} dataIndex='t_type' key='t_type'
          render={(record) => {
            let content = null;
            switch (record) {
              case 1: content = TEXT('feedback:Permissions_Request', '权限申请'); break;
              case 2: content = TEXT('feedback:Template', '模板'); break;
              case 3: content = TEXT('feedback:Data', '数据'); break;
              case 4: content = TEXT('feedback:Suggestion', '建议'); break;
            }
            return (
              <div>
                {content} <br />
              </div>
            );
          }}
        />
        <Column title={TEXT('feedback:creat_time', '创建时间')} dataIndex='created_at' key='created_at'
        />
      </Table>
    </div>
  )
}
export const FeedbacklistViewer = withRouter(_FeedbacklistViewer);

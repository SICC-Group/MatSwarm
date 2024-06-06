import React, { FC, useEffect, useState } from 'react';
import { Table,Button, Divider,Popconfirm,notification} from 'antd';
import { FormattedMessage } from 'react-intl';
import { RouteComponentProps } from "react-router";
import { RoleCheckWrapper } from '../../layout/RoleCheckWrapper';
import { UserRole } from '../../../apis/define/User';
import { TemplatesReview } from '../../../apis/define/TemplateReview';
import { get_snippets,delete_snippet } from '../../../apis/template/ListSnippets';
import { TEXT } from '../../../locale/Text';
import { withSession, WithSession } from '../../context/withSession';
import {MgeError} from '../../../apis/Fetch';
const Column = Table.Column;
export const _MySnippet: FC<RouteComponentProps & WithSession> = (props) => {

  const [dataSource, setDataSource] = useState<TemplatesReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [pageSize, setPageSize] = useState(20);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    if (!props.session.fetched) {
      return;
    }
    get_snippets(1).then(value => {
      setDataSource(value.results);
      setLoading(false);
      setTotal(value.total);
      setCurrentPage(1);
    })
  }, [props.location.pathname,props.session.fetched]);

  const handlePageChange = (page: number) => {
    get_snippets(page).then(value=>{
      setDataSource(value.results);
      setLoading(false);
      setTotal(value.total);
      setCurrentPage(page);
    })
  }
  const handleViewClick = (record:any) =>{
    window.open('/storage/check_snippet/' + record.id);
  }
  const handleClick = (record:any) =>{
    window.open('/storage/edit_snippet/' + record.id);
  }
  const handleDelete = (id:number) => {
    delete_snippet(id).then((res: any) => {
      location.reload();
    }).catch((reason: MgeError) => {
      notification.error({
        message: reason.message,
      })
    })
  }

  if (!props.session.fetched) {
    return <div></div>
  }
  else
    return (
      <RoleCheckWrapper
        forbidMessage={<FormattedMessage id='dashboard:my_template_forbid' defaultMessage='您没有上传模板的权限' />}
        requiredRoles={[UserRole.TemplateUploader]}>
            <div style={{width:'100%'}}>
            <Table dataSource={dataSource} pagination={{total:total,pageSize:pageSize,current:currentPage,onChange:(current)=>handlePageChange(current)}}>
                <Column title={TEXT('dash:ID', '编号')} dataIndex='id' key='id'/>
                <Column title={TEXT('dash:title', '标题')} dataIndex='snippet_name' key='snippet_name' width='30%'/>
                <Column title={TEXT('dash:pub_date','上传时间')} dataIndex='add_time' key='add_time'  render={text => new Date(text).toLocaleString()}/>
                <Column title={TEXT('dash:action', '操作')}  render={(record) => {
                    return(
                    <div>
                        <Button  onClick={()=>{handleViewClick(record)}}>{TEXT('dash:view_data_list', '查看')}</Button>
                        <Divider type='vertical' />
                        <Button type='primary' onClick={()=>{handleClick(record)}}>{TEXT('template:edit', '修改')}</Button>
                        <Divider type='vertical' />
                        <Popconfirm title={'确定删除？'}  onConfirm={()=>{handleDelete(record.id)}}>
                        <Button type='danger'>{TEXT('template:delete', '删除')}</Button>
                        </Popconfirm>
                    </div>
                    );
                }} />
            </Table>
            </div>
      </RoleCheckWrapper>
    )
}

export const MySnippet = withSession(_MySnippet)

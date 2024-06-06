import React, { FC, useEffect, useState } from 'react';
import { Table,Button,notification } from 'antd';
import { FormattedMessage } from 'react-intl';
import { RouteComponentProps } from "react-router";

import { RoleCheckWrapper } from '../../layout/RoleCheckWrapper';
import { UserRole } from '../../../apis/define/User';
import { TemplatesReview } from '../../../apis/define/TemplateReview';
import { ListDataTemplates } from '../../../apis/template/ListTemplates';
import { TEXT } from '../../../locale/Text';
import {TempalteDataRegisterDoi} from '../../../apis/data/DatasetList';
const Column = Table.Column;
export const DOIRegister: FC<RouteComponentProps> = (props) => {

  const [dataSource, setDataSource] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  useEffect(() => {
    ListDataTemplates().then(value => {
      setDataSource(value);
      setLoading(false);
    })
  }, []);

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }
const handleClick = (record:any) => {
    TempalteDataRegisterDoi(record.template__id).then((value)=>{
        console.log(value); 
        notification['success']({
            message: '已提交申请',
          })
    }).catch(error =>{
        notification['error']({
            message: error.message,
          })
    })
    window.location.href = "/dashboard/#/doi"

}
    return (
      <RoleCheckWrapper
        forbidMessage={<FormattedMessage id='dashboard:my_data_forbid' defaultMessage='您没有上传模板的权限' />}
        requiredRoles={[UserRole.DataUploader]}>
            <div style={{ flexDirection: 'column', width: '100%'}}>
          <Table dataSource={dataSource} loading={loading}  pagination={{
              total: dataSource.length, pageSize: pageSize, current: currentPage,onChange:(current) => {handlePageChange(current)}
          }}>
                <Column title={TEXT('dash:ID', '模板编号')} dataIndex='template__id' key='template__id' />
                <Column title={TEXT('name', '模板名称')} dataIndex='template__title' key='template__title'  />
                <Column title={TEXT('dash:data_count', '数据量')} dataIndex='data__count' key='data__count' />
                <Column title={TEXT('dash:action', '操作')} render={(record) => {
                    return(<Button type='primary' onClick={()=>{handleClick(record)}}>申请DOI</Button>);
                }} />
          </Table>
          </div>
      </RoleCheckWrapper>
    )
}



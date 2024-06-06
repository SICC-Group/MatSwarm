import React, { FC, useEffect, useState } from 'react';

import { Table, Button, Tag, Divider } from 'antd';
import { PaginationConfig } from 'antd/lib/table';

import { RoleRequest } from '../../../apis/session/ListRoleRequests';
import { UserRole, RoleToMsgID } from '../../../apis/define/User';
import { FormattedMessage } from 'react-intl';
import { RoleRequestItemViewer } from '../item_viewer/RoleRequestItemViewer';
import { RefuseRoleRequestModal } from '../modal/RefuseRoleRequestModal';
import { TEXT } from '../../../locale/Text';

import './RoleRequestViewer.less';
export interface RoleRequestViewerProps {
  // 是否显示管理员的内容
  admin?: boolean;
  // 当前页的数据列表
  data: RoleRequest[];
  // 数据总量
  total: number;
  // 每个页面的大小
  pageSize: number;
  // 当前页码
  current: number;

  loading?: boolean;
  onPageChange: (newPage: number) => void;
}

const Column = Table.Column;

export const RoleRequestViewer: FC<RoleRequestViewerProps> = (props) => {
  const handleTableChange = (pagination: PaginationConfig) => {
    props.onPageChange(pagination.current);
  }

  const [innerData, setInnerData] = useState<RoleRequest[]>([]);
  useEffect(() => {
    setInnerData(props.data);
  }, [props.data]);
  const [showViewModal, setShowViewModal] = useState(false);
  const [currentViewRecord, setCurrentViewRecord] = useState<RoleRequest>(null);
  const [showRefuseModal, setShowRefuseModal] = useState(false);
  const handleViewRecord = (record: RoleRequest) => {
    setCurrentViewRecord(record);
    setShowViewModal(true);
  }

  const handleRefuseRecord = (record: RoleRequest) => {
    setCurrentViewRecord(record);
    setShowRefuseModal(true);
  }

  return (
    <>
      <Table onChange={handleTableChange} rowKey={'id'}
        dataSource={innerData} loading={props.loading} pagination={{
          total: props.total, pageSize: props.pageSize, current: props.current
        }}>
        <Column title={TEXT('dash:ticket_id', '工单编号')} dataIndex='id' key='id' />
        <Column title={TEXT('dash:applicant', '申请人')} dataIndex='real_name' key='real_name' />
        <Column title={TEXT('dash:time', '申请时间')} dataIndex='created_at' key='created_at' render={text => new Date(text).toLocaleString()} />
        <Column className='RoleRequestViewer__DescColumn' title={TEXT('dash:description', '说明')} dataIndex='desc' key='desc' />
        <Column title={TEXT('dash:roles', '申请权限')} dataIndex='roles' key='roles' render={(value: UserRole[]) => {
          return value.map((role, index) => (
            <React.Fragment key={role}>
              <Tag style={{ fontSize: '16px' }}>
                <FormattedMessage id={RoleToMsgID(role)} />
              </Tag>
              {(index + 1) % 3 === 0 ? <br /> : null}
            </React.Fragment>

          ));
        }} />
        <Column title={TEXT('dash:action', '操作')} key='action' render={(text, record: RoleRequest) => {
          return (
            <>
              <Button type='default' onClick={() => handleViewRecord(record)}>{TEXT('dash:review', '审核')}</Button>
              <Divider type='vertical'/>
              <Button type='danger' onClick={() => handleRefuseRecord(record)}>{TEXT('dash:refuse', '拒绝')}</Button>
            </>
          )
        }} />
      </Table>
      <RoleRequestItemViewer visible={showViewModal} record={currentViewRecord} onClose={() => setShowViewModal(false) }/>
      <RefuseRoleRequestModal visible={showRefuseModal} record={currentViewRecord} onClose={() => setShowRefuseModal(false)} />
    </>
  )
}

import React, { FC, useEffect, useState } from 'react';
import { Radio } from 'antd';
import { FormattedMessage } from 'react-intl';
import { RouteComponentProps } from "react-router";

import { RoleCheckWrapper } from '../../layout/RoleCheckWrapper';
import { UserRole } from '../../../apis/define/User';
import { RequestStatus, RoleRequest, ListRoleRequests } from '../../../apis/session/ListRoleRequests';
import { RoleRequestViewer } from '../viewer/RoleRequestViewer';
import { TEXT } from '../../../locale/Text';

function PathnameToReviewState(pathname: string): RequestStatus {
  if (pathname.startsWith('/review/user_role/pending')) {
      return RequestStatus.Pending;
  }
  else if (pathname.startsWith('/review/user_role/approved')) {
      return RequestStatus.Granted;
  }
  else if (pathname.startsWith('/review/user_role/disapproved')) {
      return RequestStatus.Refused;
  }
  else {
      return null;
  }
}

export const UserRoleReview: FC<RouteComponentProps> = (props) => {
  const currentState = PathnameToReviewState(props.location.pathname);

  const [currentPage, setCurrentPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [pageSize, setPageSize] = useState(0);
  const [loading, setLoading] = useState(true);
  const [dataSource, setDataSource] = useState<RoleRequest[]>([]);

  useEffect(() => {
    setLoading(true);
    ListRoleRequests(currentState).then(value => {
      setDataSource(value.results);
      setLoading(false);
      setTotal(value.count);
      setPageSize(value.page_size);
      setCurrentPage(1);
    })
  }, [props.location.pathname]);

  const handlePageChange = (page: number) => {
    setLoading(true);
    ListRoleRequests(currentState, page).then(value => {
      setDataSource(value.results);
      setLoading(false);
      setTotal(value.count);
      setPageSize(value.page_size);
      setCurrentPage(page);
    })
  }

  return (
    <RoleCheckWrapper
      forbidMessage={<FormattedMessage id='dashboard:rolereview_forbid' defaultMessage='您没有管理用户的权限' />}
      requiredRoles={[UserRole.UserAdmin]}>
      <div style={{ flexDirection: 'column', width: '100%' }}>
        <div style={{ textAlign: 'center', padding: '16px' }}>
          <Radio.Group size='large' value={currentState} buttonStyle='solid'>
            <Radio.Button value={RequestStatus.Pending} onClick={() => props.history.push('/review/user_role/pending')}>{TEXT('dash:pending', '等待审核')}</Radio.Button>
            <Radio.Button value={RequestStatus.Granted} onClick={() => props.history.push('/review/user_role/approved')}>{TEXT('dash:approved', '审核通过')}</Radio.Button>
            <Radio.Button value={RequestStatus.Refused} onClick={() => props.history.push('/review/user_role/disapproved')}>{TEXT('dash:disapproved', '未通过审核')}</Radio.Button>
            <Radio.Button value={null} onClick={() => props.history.push('/review/user_role/all')}>{TEXT('dash:show_all', '全部')}</Radio.Button>
          </Radio.Group>
        </div>
        <RoleRequestViewer admin
          total={total}
          pageSize={pageSize}
          current={currentPage}
          loading={loading}
          onPageChange={handlePageChange}
          data={dataSource}
        />
      </div>
    </RoleCheckWrapper>
  )
}

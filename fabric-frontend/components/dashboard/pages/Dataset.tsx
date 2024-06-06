import React, { FC, useEffect, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { RouteComponentProps } from "react-router";

import { RoleCheckWrapper } from '../../layout/RoleCheckWrapper';
import { UserRole } from '../../../apis/define/User';
import { DoiListViewer } from '../viewer/DoiListViewer';
import { Dataset } from '../../../apis/define/Dataset';
import { DatasetList } from '../../../apis/data/DatasetList';

export const DoiList: FC<RouteComponentProps> = (props) => {
  const [dataSource, setDataSource] = useState<Dataset[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    setLoading(true);
    DatasetList(1).then(value => {
      setDataSource(value.results);
      setLoading(false);
      setTotal(value.total);
      setPageSize(value.page_size);
      setCurrentPage(value.page);
    })
  }, [props.location.pathname]);

  const handlePageChange = (page: number) => {
    setLoading(true);
    DatasetList(page).then(value => {
      setDataSource(value.results);
      setLoading(false);
      setTotal(value.total);
      setPageSize(value.page_size);
      setCurrentPage(value.page);
    })
  }

  return (
    <RoleCheckWrapper
      forbidMessage={<FormattedMessage id='dashboard:my_data_forbid' defaultMessage='您没有上传模板的权限' />}
      requiredRoles={[UserRole.DataUploader]}>
      <div style={{ flexDirection: 'column', width: '100%' }}>
        <DoiListViewer admin
          total={total}
          pageSize={pageSize}
          page={currentPage}
          loading={loading}
          onPageChange={handlePageChange}
          data={dataSource} />
      </div>

    </RoleCheckWrapper>
  )
}

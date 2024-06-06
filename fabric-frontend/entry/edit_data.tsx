import React, { FC } from 'react';
import ReactDOM from 'react-dom';
import { FormattedMessage } from 'react-intl';

import { UserRole } from '../apis/define/User';
import Urls from '../apis/Urls';
import { Breadcrumb, BreadcrumbItem } from '../components/layout/Breadcrumb';
import { FormPage } from '../components/layout/FormPage';
import { RoleCheckWrapper } from '../components/layout/RoleCheckWrapper';
import { MgeLayout } from '../components/layout/MgeLayout';
import { MenuKey } from '../components/layout/NavMenu';

import { DataEditor } from '../components/data/Editor';

const breadcrumbItems: BreadcrumbItem = 
  {
    title: <FormattedMessage id='data:edit_data' defaultMessage='修改数据' />
  }

const EditDataEntry: FC = () => {
  const dataID = Number( window.location.href.split('/').pop());

  return (
    <MgeLayout
      loginRequired
      selectedMenu={MenuKey.Upload}>
      <Breadcrumb items={[Breadcrumb.MGED,Breadcrumb.MDB,breadcrumbItems]} />
      <FormPage title={<FormattedMessage id='data:edit_data' defaultMessage='修改数据' />}>
        <div style={{margin: '0 56px', display: 'flex', flexDirection: 'column', 'flex': 1}}>
          <RoleCheckWrapper
            forbidMessage={<FormattedMessage id='data:forbid' defaultMessage='您没有上传数据的权限' />}
            requiredRoles={[UserRole.DataUploader]}>
            <DataEditor dataID={dataID}/>
          </RoleCheckWrapper>
        </div>

      </FormPage>
    </MgeLayout>
  );
}

ReactDOM.render(<EditDataEntry />, document.getElementById('wrap'));

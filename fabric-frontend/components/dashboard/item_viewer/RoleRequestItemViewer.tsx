import React, { FC, useState, useEffect } from 'react';
import { Button, notification } from 'antd';

import { RoleRequest } from '../../../apis/session/ListRoleRequests';
import { withModal, WithModal } from '../../../utils/withModal';
import { UserItemViewer } from './UserItemViewer';
import { EditableUserRoleRender } from '../renderers/EditableUserRoleRender';
import { UserInfo, UserRole } from '../../../apis/define/User';
import { GetUser } from '../../../apis/user/Get';

import { CategoryList } from '../../common/CategoryList';
import { PatchPermission } from '../../../apis/user/PatchPermission';
import { TEXT } from '../../../locale/Text';
import { Translate } from '../../../locale/translate';

export interface Props extends WithModal {
  record: RoleRequest;
}

const _RoleRequestItemViewer: FC<Props> = (props) => {
  const [loading, setLoading] = useState(true);
  const [userInfo, setUserInfo] = useState<UserInfo>(null);
  const [newUserRoles, setNewUserRoles] = useState<UserRole[]>([]);
  const [newCategories, setNewCategories] = useState<number[]>([]);

  useEffect(() => {
    setLoading(true);
    GetUser(props.record.created_by).then(value => {
      setUserInfo(value);
      setLoading(false);
      setNewUserRoles(value.roles);
      setNewCategories(value.managed_categories.map(v => v.id));
    })
  }, [props.record.created_by]);

  const handleUserRoleChange = (newRoles: UserRole[]) => {
    setNewUserRoles(newRoles);
  }

  const handleUpdateClick = () => {
    PatchPermission(props.record.created_by, newUserRoles, newCategories, props.record.id).then(() => {
      notification['success']({
        message: Translate('op_success'),
      });
    }).catch((reason: Error) => {
      notification['error']({
        message: reason.message,
      })
    })
  }

  if (loading) {
    return <div></div>
  }
  else return (
    <div>
      <UserItemViewer userInfo={userInfo}/>
      <EditableUserRoleRender roles={newUserRoles} onChange={handleUserRoleChange} />
      <div>
            需要管理的分类：
            <div style={{maxHeight: '320px', overflowY: 'scroll', border: '1px solid #CCC', borderRadius: '4px', padding: '0 16px'}}>
              <CategoryList value={newCategories} onChange={setNewCategories}/>
            </div>
          </div>
      <div style={{textAlign: 'center', padding: '8px'}}>
        <Button onClick={handleUpdateClick}>{TEXT('dash:save', '更新')}</Button>
      </div>
    </div>
  )
}

export const RoleRequestItemViewer = withModal(_RoleRequestItemViewer, TEXT('dash:review', '权限申请审核'));

import React, { FC } from 'react';
import { Checkbox } from 'antd';

import { UserRole, RoleToMsgID } from '../../../apis/define/User';
import { FormattedMessage } from 'react-intl';


export interface Props {
  roles: UserRole[];
  onChange: (newRoles: UserRole[]) => void;
}

const AllRoles = [
  UserRole.DataUploader,
  UserRole.TemplateUploader,
  UserRole.DataAdmin,
  UserRole.TemplateAdmin,
  UserRole.DOIAdmin,
  UserRole.Verified
]

export const EditableUserRoleRender: FC<Props> = (props) => {

  const handleSwitchChange = (toggle: boolean, role: UserRole) => {
    const newRoles = new Set(props.roles);
    if (toggle) newRoles.add(role); else newRoles.delete(role);
    props.onChange(Array.from(newRoles));

  }

  return (
    <>
      修改用户权限：<br />
      {AllRoles.map((value) => {
        return (
          <React.Fragment key={value}>
            <Checkbox 
              checked={props.roles.includes(value)}
              onChange={(e) => handleSwitchChange(e.target.checked, value)}>
              <FormattedMessage id={RoleToMsgID(value)} />
            </Checkbox>
            <br />
          </React.Fragment>
        )
      })}
    </>
  )
}

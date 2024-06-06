import React, { FC } from 'react';
import { Tag } from 'antd';
import { FormattedMessage } from 'react-intl';

import { UserRole, RoleToMsgID } from '../../../apis/define/User';



export interface Props {
  roles: UserRole[];
}

export const UserRoleRender: FC<Props> = (props) => {
  return (
    <>
      {props.roles.length === 0 ? '' : null }
      {props.roles.map((value) => {
        return (
          <React.Fragment key={value}>
            <Tag style={{ fontSize: '16px' }}>
              <FormattedMessage id={RoleToMsgID(value)} />
            </Tag>
          </React.Fragment>
        )
      })}
    </>
  )
}

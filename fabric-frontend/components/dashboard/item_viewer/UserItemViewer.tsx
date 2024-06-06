import React, { FC } from 'react';
import { UserInfo } from '../../../apis/define/User';
import { UserRoleRender } from '../renderers/UserRoleRender';
import { ManagedCategoriesRender } from '../renderers/ManagedCategoriesRender';

export interface Props {
    userInfo: UserInfo;
    showRoles?: boolean;
}

export const UserItemViewer: FC<Props> = (props) => {
    const { userInfo } = props;
    return (
        <div>
            用户名：{userInfo.username} <br />
            姓名：{userInfo.real_name} <br />
            邮箱：{userInfo.email} <br />
            单位：{userInfo.institution} <br />
            {props.showRoles ? (
                <>
                权限：<br />
            <UserRoleRender roles={userInfo.roles} /><br />
            管理的分类：<br />
            <ManagedCategoriesRender categoryies={userInfo.managed_categories} /><br />
            </>
            ) : null}
            
        </div>
    )
}

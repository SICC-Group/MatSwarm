import React from 'react';

import { UserInfo } from '../../apis/define/User';

export interface SessionContextType extends UserInfo {
    logged_in: boolean;
    avatar: string;
    // 是否已经获取了用户信息
    // 页面刚加载时为false，等待auth请求完成后变成true
    fetched: boolean; // 是否已经获取了用户信息
    informUpdate: () => void;
}

export const SessionContext = React.createContext<SessionContextType>({
    logged_in: false,
    managed_categories: [],
    email_verified: false,
    username: '',
    email: '',
    real_name: '',
    institution: '',
    avatar: '',
    roles: [],
    roles_for_acceptance: [],
    notifications: [],
    fetched: false,
    unread_count: 0,
    tel: '',
    sex: '',
    informUpdate: () => { return; },
});

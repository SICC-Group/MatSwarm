import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';

import { Spin } from 'antd';

import { UserRole } from '../../apis/define/User';
import Logout from '../../apis/session/Logout';
import Urls from '../../apis/Urls';
import { SessionContext } from '../context/session';
import { Menu, MenuItem, SubMenuItem } from './MgeMenu';

import './MgeAvatar.less';
import { DOIRegister } from '../dashboard/pages/DOIRegister';

function handleLogout(informUpdate: () => void) {
    return () => Logout().then(informUpdate);
}

interface MgeAvatarProps {
    className?: string;
}

export class MgeAvatar extends Component<MgeAvatarProps> {
    render() {
        return (
            <SessionContext.Consumer>
                {
                    (value) => {
                        if (value.fetched && value.logged_in) {
                            let myData: JSX.Element = null;
                            if (value.roles.indexOf(UserRole.DataUploader) !== -1) {
                                myData = (
                                    <SubMenuItem href='/dashboard/#/data' >
                                        <FormattedMessage id='dash:my_data' defaultMessage='我的数据' />
                                    </SubMenuItem>
                                );
                            }
                            let myTemplate: JSX.Element = null;
                            if ((value.roles.indexOf(UserRole.TemplateUploader) !== -1)||(value.roles.indexOf(UserRole.TemplateAdmin) !== -1)) {
                                myTemplate = (
                                    <SubMenuItem href='/dashboard/#/template' >
                                        <FormattedMessage id='dash:my_template' defaultMessage='我的模板' />
                                    </SubMenuItem>
                                );
                            }
                            let DOIregister: JSX.Element = null;
                            if (value.roles.indexOf(UserRole.DataUploader) !== -1) {
                                DOIregister = (
                                    <SubMenuItem href='/dashboard/#/doi' >
                                        <FormattedMessage id='dash:register_doi' defaultMessage='DOI申请' />
                                    </SubMenuItem>
                                );
                            }
                            let templateAdmin: JSX.Element = null;
                            if (value.roles.indexOf(UserRole.TemplateAdmin) !== -1) {
                                templateAdmin = (
                                    <SubMenuItem href='/dashboard/#/review/template/pending' >
                                        <FormattedMessage id='user:template_review' defaultMessage='审核模板' />
                                    </SubMenuItem>
                                );
                            }
                            let dataAdmin: JSX.Element = null;
                            if (value.roles.indexOf(UserRole.DataAdmin) !== -1) {
                                dataAdmin = (
                                    <SubMenuItem href='/dashboard/#/review/data/pending' >
                                        <FormattedMessage id='user:data_review' defaultMessage='审核数据' />
                                    </SubMenuItem>
                                );
                            }
                            let DOIAdmin: JSX.Element = null;
                            if (value.roles.indexOf(UserRole.DOIAdmin) !== -1) {
                                DOIAdmin = (
                                    <SubMenuItem href='/dashboard/#/review/doi/pending' >
                                        <FormattedMessage id='dash:doi_review' defaultMessage='审核DOI申请' />
                                    </SubMenuItem>
                                );
                            }
                            let userAdmin: JSX.Element = null;
                            if (value.roles.indexOf(UserRole.UserAdmin) !== -1) {
                                userAdmin = (
                                    <SubMenuItem href={Urls.account.user_list} >
                                        <FormattedMessage id='user:user_mgmt' defaultMessage='管理用户' />
                                    </SubMenuItem>
                                );
                            }

                            const overlay = (
                                <>
                                    <SubMenuItem href='/dashboard/#/account/info' >
                                        <FormattedMessage id='dashboard' defaultMessage='控制面板' />
                                    </SubMenuItem>
                                    { myData }
                                    { myTemplate }
                                    { userAdmin }

                                    <SubMenuItem href='/account/uploads/' >
                                        <FormattedMessage id='user:history' defaultMessage='上传历史'/>
                                    </SubMenuItem>                                    
                                    <SubMenuItem onClick={handleLogout(value.informUpdate)}>
                                        <FormattedMessage id='user:logout' defaultMessage='注销'/>
                                    </SubMenuItem>
                                </>
                            );
                            
                            return (
                                <Menu>
                                    <MenuItem overlayStyle={{left: 'unset', width: 160}} overlay={overlay}>
                                        <div className='mge-avatar'>
                                            <span className='mge-avatar__title'>{value.real_name}</span>
                                        </div>
                                    </MenuItem>
                                </Menu>
                            );
                        }
                        else if (value.fetched){
                            return (
                                // <a href={Urls.account.login + `?next=${window.location.pathname}`}>


                                // <a href={Urls.login_mge}>
                                //     <span style={{whiteSpace: 'nowrap'}}>
                                //         <FormattedMessage id='signin' defaultMessage='登录'/> &nbsp;|&nbsp; <FormattedMessage id='signup' defaultMessage='注册'/>
                                //     </span>
                                // </a>

                                <Menu>
                                    <MenuItem overlayStyle={{left: 'unset', width: 160}} >
                                        <div className='mge-avatar'>
                                            <span className='mge-avatar__title'>Org2</span>
                                        </div>
                                    </MenuItem>
                                </Menu>
                            );
                        }
                        else {
                            return (
                                <Spin style={{display: 'flex', alignItems: 'center'}}/>
                            );
                        }
                    }
                }
            </SessionContext.Consumer>
        );
    }
}

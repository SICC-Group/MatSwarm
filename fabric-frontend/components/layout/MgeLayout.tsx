import React, { Component } from 'react';

import { Button, Layout, notification } from 'antd';
import { autobind } from 'core-decorators';
import { FormattedMessage } from 'react-intl';
import MediaQuery from 'react-responsive';

import { Info } from '../../apis/session/Info';
import Urls from '../../apis/Urls';
import { SessionContext, SessionContextType } from '../context/session';
import { MenuKey, NavMenu } from './NavMenu';
import { GenerateUniqueID } from '../../utils/GenerateUniqueID';
import { IntlWrapper } from './IntlWrapper';
import { MgeFooter } from './MgeFooter';
import { MgeHeader } from './MgeHeader';
import { ConfirmNotif } from '../../apis/user/ConfirmNotifications';

import './MgeLayout.less';
import {GetFrontendStatic} from "../../apis/service/FrontendStatic";

const { Content } = Layout;
export interface MgeLayoutProps {
    reloadOnSwitchLocale?: boolean;
    selectedMenu?: MenuKey;
    contentStyle?: React.CSSProperties;
    titleID?: string;
    defaultTitle?: string;
    loginRequired?: boolean;
    indexOnly?: boolean;
    noFooter?: boolean;
}

type State = SessionContextType & { avatarCount: number, logo: string, DBtitle: string};

export class MgeLayout extends Component<MgeLayoutProps, State> {

    constructor(props: any) {
        super(props);
        this.state = {
            logged_in: false,
            username: '',
            real_name: '',
            email: '',
            tel: '',
            sex: '',
            avatar: '',
            roles: [],
            roles_for_acceptance: [],
            notifications: [],
            institution: '',
            fetched: false,
            email_verified: false,
            unread_count: 0,
            informUpdate: this.informUpdate,
            managed_categories: [],
            avatarCount: 0,
            logo:'',
            DBtitle:'',
        };
        // GetFrontendStatic('logo18').then(value => {
        //     this.setState({
        //         logo: value.file,
        //         DBtitle: value.content,
        //     })
        // })
    }

    @autobind
    ConfirmNotifications(key: any){
        console.log(this.state.notifications);
        for(let i = 0; i<this.state.notifications.length; i++){
            ConfirmNotif(this.state.notifications[i].id);
        }
        notification.close(key);
    }

    @autobind
    informUpdate(): void {
        this.setState({
            avatarCount: this.state.avatarCount + 1,
        });
        Info().then((value) => {
            this.setState({...value,
                logged_in: true,
                avatar: `${Urls.api_v1_account.user_avatar(value.username)}?size=large#${this.state.avatarCount}`,
                fetched: true,
            });

            console.log(value.notifications);
            if (value.notifications.length > 0) {
                notification.config({
                    placement: 'bottomRight',
                });
                const key = `open${Date.now()}`;
                notification.open({
                    message: '通告',
                    duration: null,
                    description: (
                        <ol>
                            {
                                value.notifications.map((value_not: any) => {

                                    return (
                                        <li>{value_not.content}</li>
                                    );
                                })
                            }
                            <Button type='primary' onClick={() =>this.ConfirmNotifications(key)}>我已了解 不再显示</Button>
                        </ol>
                    ),
                    key,
                    onClose: close,
                });
            }
        }).catch(() => {
            this.setState({
                logged_in: false,
                fetched: true,
            });
        });
    }

    componentDidMount() {
        this.informUpdate();
    }

    render() {

        let titleWriter: JSX.Element = null;
        if (this.props.titleID) {
            titleWriter = (
                <FormattedMessage key={GenerateUniqueID()} id={this.props.titleID} defaultMessage={this.props.defaultTitle}>
                    {
                        (msg: string) => {
                            document.title = msg;
                            return null;
                        }
                    }
                </FormattedMessage>
            );
        }

        const menu = this.props.indexOnly ? null : <NavMenu selected={this.props.selectedMenu}/>;
        return (
            <IntlWrapper reloadOnSwitch={this.props.reloadOnSwitchLocale}><SessionContext.Provider value={this.state}>
                {titleWriter}
                <SessionContext.Consumer>
                {
                    (value) => {
                        if (value.fetched && !value.logged_in && this.props.loginRequired) {
                            // window.location.href = Urls.account.login + '?next=' + window.location.pathname;
                            // window.location.href = Urls.account.login_18;
                        }
                        return null;
                    }
                }
                </SessionContext.Consumer>
                <Layout style={{minWidth: '700px'}}>
                    <MgeHeader indexOnly={this.props.indexOnly} logo= {this.state.logo} title={this.state.DBtitle}>
                        <div style={{display: 'flex', flexGrow: 1}}>
                            <MediaQuery minWidth={1224}>
                                {menu}
                            </MediaQuery>
                        </div>
                    </MgeHeader>
                    <Content className='MgeLayout__content' style={
                        this.props.contentStyle == null ? {minWidth: '700px'} :
                            Object.assign(this.props.contentStyle, {minWidth: '700px'})
                    }>
                        <MediaQuery maxWidth={1223}>
                            {
                                this.props.indexOnly ? null : (
                                    <div className='MgeLayout__block-menu'>
                                        {menu}                        
                                    </div>
                                )
                            }
                        </MediaQuery>
                        {this.props.children}

                    </Content>
                    {this.props.noFooter ? null : <MgeFooter/>}
                </Layout>
            </SessionContext.Provider></IntlWrapper>
        );
    }
}

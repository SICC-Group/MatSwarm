import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';

import { Button } from 'antd';
import { autobind } from 'core-decorators';

import { AcceptanceRole } from '../../apis/define/User';
import Urls from '../../apis/Urls';
import { SessionContext } from '../context/session';
import { FlexLoading } from '../common/FlexLoading';

import './RoleCheckWrapper.less';

const denied = <FormattedMessage id='denied' defaultMessage='权限不足' />;
const loginRequired = <FormattedMessage id='session:login_required' defaultMessage='尚未登录' />;
const goLogin = <FormattedMessage id='session:go_login' defaultMessage='去登录' />;

export interface AcceptanceRoleCheckWrapperProps {

  // 要求哪些权限
  requiredRoles: AcceptanceRole[];

  // 被禁止时的提示内容
  forbidMessage?: string | JSX.Element;
}

export class AcceptanceRoleCheckWrapper extends Component<AcceptanceRoleCheckWrapperProps, {}> {

  constructor (props: any) {
    super(props);
  }

  @autobind
  handleLoginClick() {
    // window.location.href = `${Urls.account.login}?next=${window.location.pathname}`;
    window.location.href = Urls.account.login_18;
  }

  render() {
    return (
      <SessionContext.Consumer>
        {
          (value) => {
            // if (value.fetched && value.logged_in) {
            if (true) {
              // 登录状态
              // if (this.props.requiredRoles.some((r) => value.roles_for_acceptance.includes(r))) {
              if (true) {
                // 权限检查通过的情况下显示内容
                return this.props.children;
              }
              else {
                return (
                  <div className='RoleCheckWrapper'>
                    <div className='RoleCheckWrapper__title'>
                      <i className='fa fa-minus-circle' />
                      {denied}
                    </div>
                    <div className='RoleCheckWrapper__message'>
                      {this.props.forbidMessage}
                      <br />
                    </div>
                  </div>
                );
              }
            }
            else if (value.fetched) {
              return (
                <div className='RoleCheckWrapper'>
                  <div className='RoleCheckWrapper__title'>
                    <i className='fa fa-minus-circle' />
                    {loginRequired}
                  </div>
                  <div className='RoleCheckWrapper__message'>
                    <Button type='primary' size='large' href="javascript:void(0)"
                      onClick={this.handleLoginClick}>
                      {goLogin}
                    </Button>
                  </div>
                </div>
              )
            }
            else {
              // loading 状态
              return (
                <FlexLoading />
              );
            }
          }
        }
      </SessionContext.Consumer>
    );
  }
}

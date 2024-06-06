import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';

import { Button } from 'antd';
import { autobind } from 'core-decorators';

import { UserRole } from '../../apis/define/User';
import Urls from '../../apis/Urls';
import { SessionContext } from '../context/session';
import { FlexLoading } from '../common/FlexLoading';

import './RoleCheckWrapper.less';
import { RoleRequestModal } from '../common/RoleRequestModal';

const denied = <FormattedMessage id='denied' defaultMessage='权限不足' />;
const loginRequired = <FormattedMessage id='session:login_required' defaultMessage='尚未登录' />;
const goRequest = <FormattedMessage id='click_request' defaultMessage='点击申请' />;
const goLogin = <FormattedMessage id='session:go_login' defaultMessage='去登录' />;

export interface RoleCheckWrapperProps {

  // 要求哪些权限
  requiredRoles: UserRole[];

  // 被禁止时的提示内容
  forbidMessage?: string | JSX.Element;
}

interface State {
  modalVisible: boolean;
}

export class RoleCheckWrapper extends Component<RoleCheckWrapperProps, State> {

  constructor (props: any) {
    super(props);
    this.state = {
      modalVisible: false,
    }
  }

  @autobind
  handleRequestClick() {
    // window.location.href = Urls.ticketing.create_ticket;
    // 申请权限的弹框隐藏
    // this.setState({
    //   modalVisible: true,
    // })
  }

  @autobind
  handleLoginClick() {
    // window.location.href = `${Urls.account.login}?next=${window.location.pathname}`;
    window.location.href = Urls.account.login_18;
  }

  @autobind
  handleModalClose() {
    this.setState({
      modalVisible: false,
    })
  }

  render() {
    return (
      <SessionContext.Consumer>
        {
          (value) => {
            // if (value.fetched && value.logged_in) {
            if (true) {
              // 登录状态
              // if (this.props.requiredRoles.every((r) => value.roles.includes(r))) {
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
                      {/* <FormattedMessage id='permission:request_help'
                        defaultMessage='点击下面的按钮，提交权限申请的反馈' />
                      <br />
                      <FormattedMessage id='permission:request_help2_head'
                        defaultMessage='您可以在' />
                      <a href={Urls.ticketing.list_tickets}>
                        <FormattedMessage id='permission:ticket_list' defaultMessage='反馈列表' />
                      </a>
                      <FormattedMessage id='permission:request_help2_tail'
                        defaultMessage='查看您的申请进度' /> */}
                    </div>
                    <Button type='primary' size='large' href={Urls.NMDMS_site_index}
                      onClick={this.handleRequestClick}>
                      {goRequest}
                    </Button>
                    <RoleRequestModal 
                      exclude={value.roles} defaultChecked={this.props.requiredRoles}
                      visible={this.state.modalVisible} onClose={this.handleModalClose}/>
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
                    {/*<Button type='primary' size='large' href="javascript:void(0)"*/}
                    {/*  onClick={this.handleLoginClick}*/}
                    {/*>*/}
                    {/*  {goLogin}*/}
                    {/*</Button>*/}
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

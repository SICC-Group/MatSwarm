import React, { FC, useState } from 'react';
import { Input, Form, Button, notification } from 'antd';
import { FormComponentProps } from 'antd/lib/form';

import { withSession, WithSession } from '../../context/withSession';
import { UserRole } from '../../../apis/define/User';
import { EmailVerification } from '../../../apis/session/EmailVerification';
import { MgeError } from '../../../apis/Fetch';
import { UpdateUserInfo } from '../../../apis/session/UpdateInfo';
import { RoleRequestModal } from '../../common/RoleRequestModal';

import { AvatarView } from './AvatarView';
import { UserRoleRender } from '../renderers/UserRoleRender';
import { ManagedCategoriesRender } from '../renderers/ManagedCategoriesRender';
import { TEXT } from '../../../locale/Text';
import { Translate as _ } from '../../../locale/translate';

type InjectedProps = FormComponentProps & WithSession;

export interface Props extends InjectedProps {
  real_name: string;
  insitution: string;
  email: string;
}

export const _AccountInfo: FC<Props> = (props) => {

  const { form } = props;
  const formItemLayout = {
    labelCol: { xs: { span: 24 }, sm: { span: 4 } },
    wrapperCol: { xs: { span: 24 }, sm: { span: 20 } }
  }
  const tailFormItemLayout = {
    wrapperCol: {
      xs: { span: 24, offset: 0 },
      sm: { span: 16, offset: 8 },
    },
  };

  const handleSubmit = (e: React.FormEvent<any>) => {
    e.preventDefault();
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        UpdateUserInfo(props.session.username, {
          institution: values['institution'],
          email: values['email'],
          real_name: values['real_name'],
        }).then(() => {
          notification['success']({
            message: _('op_success'),
          })
          props.session.informUpdate();
        }).catch((reason: MgeError) => {
          notification['error']({
            message: reason.message
          })
        })
      }
    });
  }

  const handleSendEmail = () => {
    EmailVerification().then(() => {
      notification['success']({
        message: TEXT('dash:email_sent', '邮件发送成功'),
      })
    }).catch((reason: MgeError) => {
      notification['error']({
        message: reason.message,
      })
    })
  }
  const [requestModalVisible, setRequestModalVisible] = useState(false);
  const handleRoleRequest = () => {
    setRequestModalVisible(true);
  }

  const verified = UserRole.Verified in props.session.roles;
  const sendEmail = <a href='javascript:void(0)' onClick={handleSendEmail}>{TEXT('dash:send_verify_email', '发送验证邮件')}</a>
  const getFieldDecorator = props.form.getFieldDecorator;

  const showAdminCategory = (
    props.session.roles.includes(UserRole.DataAdmin) || props.session.roles.includes(UserRole.TemplateAdmin)
  )

  return (
    <div style={{ display: 'flex', flex: 1, flexDirection: 'row' }}>
      <div style={{ width: '180px', textAlign: 'center', marginTop: '30px' }}>
        <AvatarView informUpdate={props.session.informUpdate} userID={props.session.username} avatarUrl={`${props.session.avatar}`} />
      </div>
      <div style={{ maxWidth: '600px', flex: 1 }}>
        <Form {...formItemLayout} onSubmit={handleSubmit}>
          <Form.Item label={TEXT('dash:username', '用户名')}>
            <span className="ant-form-text">{props.session.username}</span>
          </Form.Item>
          <Form.Item label={TEXT('dash:real_name', '姓名')} >
            {
              getFieldDecorator('real_name', {
                initialValue: props.session.real_name,
                rules: [{ required: true, message: TEXT('dash:name_required', '请输入姓名') }]
              })(<Input />)
            }
          </Form.Item>
          <Form.Item label={TEXT('dash:inst', '单位/机构')} >
            {
              getFieldDecorator('institution', {
                initialValue: props.session.institution,
                rules: [{ required: true, message: TEXT('dash:inst_required', '请输入机构名') }]
              })(<Input />)
            }
          </Form.Item>
          <Form.Item label={TEXT('dash:email', '邮箱')} extra={verified ? null : sendEmail}>
            {
              getFieldDecorator('email', {
                initialValue: props.session.email,
                rules: [
                  { type: 'email', message: TEXT('dash:email_error_format', '邮箱格式不正确') },
                  { required: true, message:TEXT('dash:email_required', '请输入邮箱')}
                ],
              })(<Input addonAfter={verified ? TEXT('dash:verified', '已认证') : TEXT('dash:not_verified', '未认证')} />)
            }
          </Form.Item>
          <Form.Item label={TEXT('dash:roles', '权限')}>
            <div>
              {props.session.roles.length === 0 ? TEXT('dash:verify_email_first', '请先验证你的邮箱') : null}
              <UserRoleRender roles={props.session.roles} />
              {showAdminCategory ? <br/> : null}
              {showAdminCategory ? TEXT('dash:admin_category', '管理的分类') : null}
              {showAdminCategory ? (
                <ManagedCategoriesRender categoryies={props.session.managed_categories}/>
              )
                : null
              }
            </div>
            {/* <div style={{ textAlign: 'right' }}>
              <RoleRequestModal exclude={props.session.roles}
                visible={requestModalVisible} onClose={() => setRequestModalVisible(false)} />
              <Button onClick={handleRoleRequest}>{TEXT('dash:request_new_role', '申请新权限')}</Button>
            </div> */}

          </Form.Item>
          <Form.Item {...tailFormItemLayout}>
            <Button type='primary' size='large' htmlType='submit' loading={!props.session.fetched}>
              {TEXT('dash:save', '保存')}
          </Button>
          </Form.Item>
        </Form>
      </div>
    </div>

  )
}


export const AccountInfo = Form.create({ name: 'account' })(withSession(_AccountInfo));

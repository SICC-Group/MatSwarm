import React, { FC, useState } from 'react';
import { Input, Form, Button, notification, Modal } from 'antd';
import { FormComponentProps } from 'antd/lib/form';

import { UpdatePassword } from '../../../apis/session/UpdateInfo';
import { withSession, WithSession } from '../../context/withSession';
import { MgeError } from '../../../apis/Fetch';
import Urls from '../../../apis/Urls';
import { TEXT } from '../../../locale/Text';

type Injected = FormComponentProps & WithSession;

export interface Props extends Injected {
  old_password: string;
  new_password: string;
}

const _ChangePassword: FC<Props> = (props) => {
  const [confirmDirty, setConfirmDirty] = useState(false);
  
  const { form } = props;
  const formItemLayout = {
    labelCol: { xs: { span: 24 }, sm: { span: 8 }},
    wrapperCol: { xs: { span: 24 }, sm: { span: 16 }}
  }
  const tailFormItemLayout = {
    wrapperCol: {
      xs: { span: 24, offset: 0 },
      sm: { span: 16, offset: 8 },
    },
  };

  const getFieldDecorator = props.form.getFieldDecorator;

  const handleSubmit = (e: React.FormEvent<any>) => {
    e.preventDefault();
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        UpdatePassword(props.session, values['old_password'], values['new_password']).then(() => {
          form.resetFields();
          Modal.confirm({
            content: TEXT('dash:password_change_success', '修改成功，请重新登录'), okText: TEXT('dash:relogin', '重新登录'),
            // onOk: () => window.location.href = Urls.account.login + `?next=${window.location.pathname}`
            onOk: () => window.location.href = Urls.account.login_18
          })
        }).catch((reason: MgeError) => {
          console.log({reason})
          notification['error']({
            message: reason.message
          })
        })
      }
    })
  }

  const compareToFirstPassword = (rule: any, value: any, callback: any) => {
    if (value && value !== form.getFieldValue('new_password')) {
      callback(TEXT('dash:pwd_not_match', '两次输入的密码不一致'));
    } else {
      callback();
    }
  };

  const validateToNextPassword = (rule: any, value: any, callback: any) => {
    if (value && confirmDirty) {
      form.validateFields(['confirm'], { force: true });
    }
    callback();
  }

  const handleConfirmBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setConfirmDirty(confirmDirty || !!value);
  }

  return (
    <div style={{ flexDirection: 'column', maxWidth: '600px', margin: '0 auto', flex: 1 }}>
      <Form {...formItemLayout} onSubmit={handleSubmit}>
        <Form.Item label={TEXT('dash:current_pwd', '当前密码')} >
          {
            getFieldDecorator('old_password', {
              rules: [{required: true, message: TEXT('dash:please_input_current', '请输入当前密码')}, { validator: validateToNextPassword }]
            })(<Input.Password />)
          }
        </Form.Item>
        <Form.Item label={TEXT('dash:new_pwd', '新密码')} hasFeedback>
          {
            getFieldDecorator('new_password', {
              rules: [{required: true, message: TEXT('dash:please_input_new', '请输入新密码')}]
            })(<Input.Password onBlur={handleConfirmBlur}/>)
          }
        </Form.Item>
        <Form.Item label={TEXT('dash:confirm_pwd', '重复新密码')} hasFeedback>
          {
            getFieldDecorator('confirm', {
              rules: [{ validator: compareToFirstPassword}]
            })(<Input.Password />)
          }
        </Form.Item>
        <Form.Item {...tailFormItemLayout}>
          <Button type='primary' htmlType='submit' loading={!props.session.fetched}>
            {TEXT('dash:change', '修改')}
          </Button>
        </Form.Item>
      </Form>
    </div>
  )
}

export const ChangePassword = Form.create({ name: 'change_password' })(withSession(_ChangePassword));

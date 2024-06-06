import React, { FC, useState, useEffect } from 'react';
import { FormattedMessage } from 'react-intl';
import { Button, Modal, Checkbox, Input } from 'antd';


import { UserRole, RoleToMsgID } from '../../apis/define/User';
import { RequestRoles } from '../../apis/session/RequestRoles';
import { CategoryList } from './CategoryList';

const { TextArea } = Input;

export interface Props {
  // 排除掉的权限
  exclude: UserRole[];
  // 默认勾选的权限
  defaultChecked?: UserRole[];
  // 是否可见
  visible?: boolean;

  // 关闭
  onClose: () => void;
}

export const RoleRequestModal: FC<Props> = (props) => {
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);
  const [desc, setDesc] = useState('');
  const [newRoles, setNewRoles] = useState<UserRole[]>([])
  const [categoryList, setCategoryList] = useState<number[]>([]);

  useEffect(() => {
    if (props.defaultChecked) {
      const set = new Set(newRoles);
      for(let i of props.defaultChecked) {
        set.add(i);
      }
      setNewRoles(Array.from(set));
    }
  }, [props.defaultChecked]);

  const roleSet = new Set([
    UserRole.TemplateAdmin, UserRole.TemplateUploader,
    UserRole.DataAdmin, UserRole.DataUploader,
    UserRole.DOIAdmin, UserRole.UserAdmin,
  ]);
  for (let i of props.exclude) {
    if (i !== UserRole.DataAdmin && i !== UserRole.TemplateAdmin)
      roleSet.delete(i);
  }
  const roles = Array.from(roleSet);

  const toggleRole = (role: UserRole, flag: boolean) => {
    const set = new Set(newRoles);
    if (flag) set.add(role); else set.delete(role);
    setNewRoles(Array.from(set));
  }

  const handleSubmit = () => {
    if (newRoles.length === 0) return;
    setLoading(true);
    RequestRoles(newRoles, desc, categoryList).then(() => {
      setLoading(false);
      setDone(true);
    });
  }

  const footer = [
    <Button key='close' onClick={props.onClose} disabled={loading}>
      关闭
    </Button>,
    <Button key='submit' type="primary" onClick={handleSubmit} loading={loading} disabled={desc.trim().length === 0 || newRoles.length === 0}>
      申请
    </Button>
  ]

  const doneFooter = (
    <Button key='close' onClick={props.onClose} disabled={loading}>
      关闭
    </Button>
  )

  if (roles.length === 0) {
    return (
      <Modal
        title={'申请权限'} footer={doneFooter}
        visible={props.visible} onCancel={props.onClose} onOk={props.onClose}>
          您没有可以申请的权限
      </Modal>
    )
  }

  const showCategoryList = newRoles.includes(UserRole.DataAdmin) || newRoles.includes(UserRole.TemplateAdmin);

  if (done) {
    return (
      <Modal
        title={'申请权限'} footer={doneFooter}
        visible={props.visible} onCancel={props.onClose} onOk={props.onClose}>
          权限申请已发送，您可以在反馈列表查看进度
      </Modal>
    )
  }
  else return (
    <Modal
      title={'申请权限'} footer={footer}
      visible={props.visible} onCancel={props.onClose} onOk={props.onClose}>
      <div>
        勾选需要申请的权限，并填写说明：<br />
        <div style={{ textAlign: 'center' }}>
          {
            roles.map((role, index) => {
              return (
                <React.Fragment key={role}>
                  <Checkbox key={role}
                    onChange={(v) => toggleRole(role, v.target.checked)}
                    checked={newRoles.includes(role)} >
                    <FormattedMessage id={RoleToMsgID(role)} />
                  </Checkbox>
                  {(index + 1) % 3 === 0 ? <br /> : null}
                </React.Fragment>
              )
            })
          }
        </div>
      </div>
      {
        showCategoryList ? (
          <div>
            需要管理的分类：
            <div style={{maxHeight: '320px', overflowY: 'scroll', border: '1px solid #CCC', borderRadius: '4px', padding: '0 16px'}}>
              <CategoryList value={categoryList} onChange={setCategoryList}/>
            </div>
          </div>
        ) : null 
      }
      <div style={{ margin: '8px 0' }}>
        说明：
        <div>
          <TextArea placeholder='填写说明' value={desc} onChange={v => setDesc(v.target.value)}/>
        </div>
      </div>
    </Modal>
  )
}

import React, { FC, useState } from 'react';
import { Checkbox, Button, notification } from 'antd';

import { WithModal, withModal } from '../../../utils/withModal';
import { RefuseRoleRequest } from '../../../apis/user/RefuseRoleRequest';
import { RoleRequest } from '../../../apis/session/ListRoleRequests';
import { TEXT } from '../../../locale/Text';

export interface Props extends WithModal {
  record: RoleRequest;
}

const reasons = [
  '不符合申请创建模板权限要求',
  '不符合申请用户管理权限要求',
  '不符合申请模板管理权限要求',
  '不符合申请数据管理模板权限要求',
  '不符合申请DOI管理限要求'
]

const RefuseRoleRequestView: FC<Props> = (props) => {

  const [reasonList, setReasonList] = useState<string[]>([]);

  const toggleReason = (reason: string, value: boolean) => {
    const set = new Set(reasonList);
    if (value) set.add(reason); else set.delete(reason);
    setReasonList(Array.from(set));
  }

  const handleButtonClick = () => {
    RefuseRoleRequest(props.record.id, reasonList.join(',')).then(() => {
      notification['success']({
        message: TEXT('op_success', '操作成功')
      })
    }).catch((reason: Error) => {
      notification['error']({
        message: reason.message,
      })
    })
  }

  return (
    <div>
      {TEXT('dash:choose_reason', '请选择拒绝理由：')}<br />
      {reasons.map((value) => {
        return (
          <React.Fragment key={value}>
            <Checkbox checked={reasonList.includes(value)}
              onChange={(e) => toggleReason(value, e.target.checked)}>{value}</Checkbox>
            <br />
          </React.Fragment>
        )
      })}
      <div style={{ textAlign: 'center', margin: '16px 0 -8px 0' }}>
        <Button disabled={reasonList.length === 0} type='danger' onClick={handleButtonClick}>{TEXT('dash:refuse_and_close', '拒绝并关闭申请')}</Button>
      </div>
    </div>
  )
}

export const RefuseRoleRequestModal = withModal(RefuseRoleRequestView, TEXT('dash:review', '审核'));

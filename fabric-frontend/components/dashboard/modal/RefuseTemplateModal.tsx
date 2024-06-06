import React, { FC, useState } from 'react';
import { Checkbox, Button, notification, Input } from 'antd';

import { WithModal, withModal } from '../../../utils/withModal';
import { TemplatesReview } from '../../../apis/define/TemplateReview';
import { RefuseTemplate } from '../../../apis/template/ReviewTemplate';
import { TEXT } from '../../../locale/Text';

export interface Props extends WithModal {
  record: TemplatesReview;
}

const reasons = [
  '缺少元数据信息',
  '计算、实验条件不完整',
  '性能相关信息不完整',
  '模板标题命名不规范',
  '模板引用信息不全',
  '模板收集、审核人信息不全'
]

const RefuseTemplateView: FC<Props> = (props) => {

  const [reasonList, setReasonList] = useState<string[]>([]);
  const [other, setOther] = useState('');

  const toggleReason = (reason: string, value: boolean) => {
    const set = new Set(reasonList);
    if (value) set.add(reason); else set.delete(reason);
    setReasonList(Array.from(set));
  }

  const handleButtonClick = () => {
    const finalReason = (other.trim().length === 0 ? reasonList : [...reasonList, other])
    RefuseTemplate(props.record.id, finalReason.join(';')).then(() => {
      notification['success']({
        message: TEXT('op_success', '操作成功'),
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
      {TEXT('dash:other', '其他原因：')}
      <Input value={other} onChange={(e) => setOther(e.target.value)} />

      <div style={{ textAlign: 'center', margin: '16px 0 -8px 0' }}>
        <Button disabled={reasonList.length === 0 && other.trim().length === 0} type='danger' onClick={handleButtonClick}>{TEXT('dash:refuse_data', '不通过数据')}</Button>
      </div>
    </div>
  )
}

export const RefuseTemplateModal = withModal(RefuseTemplateView, TEXT('dash:review', '审核'));

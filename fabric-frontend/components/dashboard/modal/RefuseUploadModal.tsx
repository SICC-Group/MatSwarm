import React, { FC, useState } from 'react';
import { Checkbox, Button, notification, Input } from 'antd';

import { WithModal, withModal } from '../../../utils/withModal';
import { UploadHistory } from '../../../apis/define/Upload';
import { RefuseUpload,RefuseUpload1 } from '../../../apis/uploads/Review';
import { TEXT } from '../../../locale/Text';
import { GetUploadHistory } from '../../../apis/uploads/Get';
export interface Props extends WithModal {
  record: UploadHistory;
  record_multi_id ?: any[];
  informUpdate : () => void
}

const reasons = [
  '缺少元数据信息',
  '计算、实验条件不完整',
  '性能相关信息不完整',
  '数据标题命名不规范',
  '数据引用信息不全',
  '数据收集、审核人信息不全'
]

const RefuseUploadView: FC<Props> = (props) => {

  const [reasonList, setReasonList] = useState<string[]>([]);
  const [other, setOther] = useState('');

  const toggleReason = (reason: string, value: boolean) => {
    const set = new Set(reasonList);
    if (value) set.add(reason); else set.delete(reason);
    setReasonList(Array.from(set));
  }

  const handleButtonClick = () => {
    const finalReason = (other.trim().length === 0 ? reasonList : [...reasonList, other])
      if (props.record_multi_id.length === 0){
          if(props.record.platform_belong === 1){
            GetUploadHistory(props.record.id).then((result) => {
                result.meta_id_list.data_list.map((value,index)=>{
                    RefuseUpload1(value.id, finalReason.join(';')).then(res=> { //大科学装置数据撤回
                        if(res.msg === '调用成功'){
                            if(index === result.meta_id_list.data_list.length-1){
                                RefuseUpload(props.record.id, finalReason.join(';')).then(() => {
                                    GetUploadHistory(props.record.id).then((result) => {
                                        Object.assign(props.record, result); //更新数据状态
                                        notification['success']({
                                          message: TEXT('op_success', '操作成功')
                                        })
                                        props.informUpdate();
                                      })
                                }).catch((reason: Error) => {
                                    notification['error']({
                                        message: reason.message,
                                    })
                                })
                            }
                        }
                        else{
                            notification['error']({
                            message: res.msg,
                            })
                        }                     
                    }
                    )
                })
              })
          }
          else{
            RefuseUpload(props.record.id, finalReason.join(';')).then(() => {
                GetUploadHistory(props.record.id).then((result) => {
                    Object.assign(props.record, result); //更新数据状态
                    notification['success']({
                      message: TEXT('op_success', '操作成功')
                    })
                    props.informUpdate();
                  })
            }).catch((reason: Error) => {
                notification['error']({
                    message: reason.message,
                })
            })
          }
      }
      else {
          props.record_multi_id.map(item=>{
            GetUploadHistory(item).then((result) => {
                if(result.platform_belong === 1){  //大科学装置数据撤回
                    result.meta_id_list.data_list.map((value,index)=>{
                        RefuseUpload1(value.id, finalReason.join(';')).then(res => { //大科学装置数据撤回
                            if(res.msg === '调用成功'){
                                if(index === result.meta_id_list.data_list.length-1){
                                RefuseUpload(item, finalReason.join(';')).then(() => {
                                    GetUploadHistory(item).then((result) => {
                                        Object.assign(props.record, result);
                                        notification['success']({
                                          message: TEXT('op_success', '操作成功')
                                        })
                                        props.informUpdate();
                                      })
                                }).catch((reason: Error) => {
                                    notification['error']({
                                        message: reason.message,
                                    })
                                })
                            }
                            }
                            else{
                                notification['error']({
                                    message: res.msg,
                                    })
                            }
                        })
                    })
                }
                else{
                    RefuseUpload(item, finalReason.join(';')).then(() => {
                        GetUploadHistory(item).then((result) => {
                            Object.assign(props.record, result);
                            notification['success']({
                              message: TEXT('op_success', '操作成功')
                            })
                            props.informUpdate();
                          })
                    }).catch((reason: Error) => {
                        notification['error']({
                            message: reason.message,
                        })
                    })
                }
              })
          })
      }
      props.onClose()
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

export const RefuseUploadModal = withModal(RefuseUploadView, TEXT('dash:review', '审核'));

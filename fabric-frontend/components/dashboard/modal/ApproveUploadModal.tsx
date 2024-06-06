/*
* 通过审核确认弹框，将通过审核的点击事件也从UploadHistoryAction移到该文件下
* @author: hanc
* */

import React, { FC, useState } from 'react';
import { Checkbox, Button, notification, Input } from 'antd';

import { WithModal, withModal } from '../../../utils/withModal';
import { UploadHistory } from '../../../apis/define/Upload';

import { TEXT } from '../../../locale/Text';
import {PassUpload} from "../../../apis/uploads/Review";
import {GetUploadHistory} from "../../../apis/uploads/Get";

export interface Props extends WithModal {
  record: UploadHistory;
  record_multi_id ?: any[];
  informUpdate : () => void
}


const ApproveUploadView: FC<Props> = (props) => {


  const handleButtonClick = () => {
    if (props.record_multi_id.length === 0){
      PassUpload(props.record.id).then(() => {
        GetUploadHistory(props.record.id).then((result) => {
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
    else {
      props.record_multi_id.map(record_id=>{
        PassUpload(record_id).then(() => {
          GetUploadHistory(record_id).then((result) => {
            Object.assign(record_id, result);
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
      })
    }
    props.onClose();      // 点击后关闭拒绝理由弹窗
  }

  return (
      <div>
        {TEXT('dash:confirm_approve', '确认通过审核吗？')}<br />

      <div style={{ textAlign: 'center', margin: '16px 0 -8px 0' }}>
        <Button type='primary' onClick={handleButtonClick}>{TEXT('dash:approve_confirm', '确认')}</Button>
        <Button type='danger' style = {{marginLeft: '16px' }} onClick={props.onClose}>{TEXT('dash:approve_not_confirm', '取消')}</Button>
      </div>
    </div>
  )
}

export const ApproveUploadModal = withModal(ApproveUploadView, TEXT('dash:approve', '通过审核'));

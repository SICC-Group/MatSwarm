import React, { FC, useState } from 'react';
import { Button, Divider, notification } from 'antd';

import { ReviewState } from '../../../apis/define/ReviewState';
import { PassUpload } from '../../../apis/uploads/Review';
import { UploadHistory } from '../../../apis/define/Upload';
import { GetUploadHistory } from '../../../apis/uploads/Get';
import { Cart } from '../../../utils/ShoppingCart';
import { TEXT } from '../../../locale/Text';

export interface Props {
  record: UploadHistory;
  admin?: boolean;
  onView: (record: UploadHistory) => void;
  onRefuse: (record: UploadHistory) => void;
  onApprove: (record: UploadHistory) => void;
  onWithdraw:(record:UploadHistory)=>void;
  informUpdate: () => void;
}

export const UploadHistoryAction: FC<Props> = (props) => {
  const {record, admin, onView} = props;
  // const [yesLoading, setYesLoading] = useState(false);
  const [addDataLoading, setAddDataLoading] = useState(false);

  // const handleYesClick = () => {
  //   setYesLoading(true);
  //   PassUpload(record.id).then(() => {
  //     GetUploadHistory(record.id).then((result) => {
  //       Object.assign(record, result);
  //       notification['success']({
  //         message: TEXT('op_success', '操作成功')
  //       })
  //       props.informUpdate();
  //       setYesLoading(false);
  //     })
  //
  //   }).catch((reason: Error) => {
  //     notification['error']({
  //       message: reason.message,
  //     })
  //   })
  // }

  // const yesButton = <Button size='small' type='primary' loading={yesLoading} onClick={handleYesClick}>{TEXT('dash:approve', '通过')}</Button>;
  const yesButton = <Button size='small' type='primary' onClick={() => props.onApprove(record)}>{TEXT('dash:approve', '通过')}</Button>;
  const noButton = <Button size='small' type='danger' onClick={() => props.onRefuse(record)}>{TEXT('dash:disapprove', '拒绝')}</Button>;
  const withdrawButton = <Button size='small' type='danger' onClick={() => props.onWithdraw(record)}>{TEXT('dash:withdraw', '撤回审核')}</Button>
  const handleViewButtonClick = () => {
    onView(record);
  }

  const handleAddData = () => {
    setAddDataLoading(true);
    GetUploadHistory(record.id).then(value => {
      value.meta_id_list.data_list.forEach((value) => {
        Cart.Instance.AddData(value.id, value.title, value.tid);
      })
      setAddDataLoading(false);
    })
  }

  return (
    <span>
      
      {admin && !(record.review_state == ReviewState.Approved || record.review_state == ReviewState.Disapproved )  ? yesButton : null}
      {admin && !(record.review_state == ReviewState.Approved || record.review_state == ReviewState.Disapproved ) ? <Divider type="vertical" /> : null}
      {admin && !(record.review_state == ReviewState.Approved || record.review_state == ReviewState.Disapproved) ? noButton : null}
      {/*{admin && (record.review_state == ReviewState.Disapproved) ? <Divider type="vertical" /> : null}*/}
      {admin && !(record.review_state == ReviewState.Pending) && (record.platform_belong === 0)   ? withdrawButton : null}
      {admin && !(record.review_state == ReviewState.Pending) && (record.platform_belong === 0)   ? <Divider type="vertical" />: null}
      <Button size='small' onClick={handleViewButtonClick}>{TEXT('dash:view_data_list', '查看数据')}</Button>
      <Divider type="vertical" />
      <Button size='small' onClick={handleAddData} loading={addDataLoading}>
        <i className='fa fa-plus' aria-hidden='true' />
      </Button>
    </span>
  )
}

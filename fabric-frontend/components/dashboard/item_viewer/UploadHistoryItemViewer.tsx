import React, { FC, useState, useEffect } from 'react';
import { Modal, Button } from 'antd';

import { GetUploadHistory } from '../../../apis/uploads/Get';
import { Data } from '../../../apis/define/Data';
import { UploadHistory } from '../../../apis/define/Upload';
import Urls from '../../../apis/Urls';
import { FlexLoading } from '../../common/FlexLoading';
import { TEXT } from '../../../locale/Text';


export interface Props {
  record: UploadHistory;
  admin?: boolean;
  visible?: boolean;
  onClose: () => void;
}

export const UploadHistoryItemViewer: FC<Props> = (props) => {
  const [loading, setLoading] = useState(true);
  const [list, setList] = useState<Data.SlimMeta[]>([]);
  const [Public,setPublic] = useState(false);
  const [Source,setSource] = useState<string>(null);
  useEffect(() => {
    if (props.record && props.visible) {
      console.log(props.record)
      setLoading(true);
      GetUploadHistory(props.record.id).then((result) => {
        if (result.meta_id_list.data_list.length === 1) {
          window.open(Urls.storage.show_data(result.meta_id_list.data_list[0].id));
          props.onClose();
        }
        setList(result.meta_id_list.data_list);
        setPublic(result.meta_id_list.public);
        setSource(props.record.source);
        setLoading(false);
      })
    }

  }, [props.record, props.visible]);

  return (
    <Modal
      title='数据列表'
      footer={[
        <div>
        {Source == null?null:
        <Button  href={Source} target='_blank' disabled={(Public === true)?false:true} type="primary">
        下载
        </Button>}

        <Button key="submit" type="primary" onClick={props.onClose}>
          关闭
        </Button></div>
      ]}
      visible={props.visible} onCancel={props.onClose} onOk={props.onClose}>
      {
        <div style={{ height: '50vh', overflowY: 'scroll' }}>
          {loading ? (<FlexLoading />) : (list.length === 0 ? (Public ? (<div>数据为空</div>): (<div>含有未公开数据</div>)): list.map((item) => {
            return (
              <div key={item.id}>
                <a target='_blank' href={Urls.storage.show_data(item.id)}>{item.id} / {item.title}</a>
              </div>
            )
          }))}
        </div>
      }
    </Modal >
  )
}

import React, { FC, useState } from 'react';
import { Upload, Modal, Icon } from 'antd';
import { UploadFile, UploadChangeParam } from 'antd/lib/upload/interface';

import { InputFieldProps } from '../Props';
import { ImageField } from '../../../../apis/define/Field';
import Urls from '../../../../apis/Urls';

export const ImageInputFieldContent: FC<InputFieldProps<ImageField>> = (props) => {
  const { parent, name, informUpdate, field } = props;
  

  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewImage, setPreviewImage] = useState('');

  const handlePreview = (file: UploadFile) => {
    setPreviewImage(file.url || file.thumbUrl);
    setPreviewVisible(true);
  }

  const handlePreviewCancel = () => {
    setPreviewVisible(false);
  }
  const handleChange = (info: UploadChangeParam<UploadFile>) => {
    // change toJSON method
    const list = info.fileList.map((value, index) => {
      (value as any).toJSON = function() {
       if(this.status)
        {
          if (this.status === 'done') {
            return this.response.data[0];
          } else {
            // throw new Error('上传未完成');
            return 'Uploading';
          }
        }
        else
        {
          return this.url
        }
      }
      return value;
    })
    parent[name] = list;
    
    informUpdate();
  }

  let object: string[] = parent[name] || [];
  console.log(object);
  const fileList: UploadFile[] = object.map((value) => {
    if ((value as any)['uid'] != null) {
      return value as any;
    }
    const result: UploadFile = {
      uid: value,
      url: value,
      size: undefined,
      type: undefined,
      name: value,
    }
    return result;
  })

  const uploadButton = (
    <div>
        <Icon type="plus" />
        <div className="ant-upload-text">上传</div>
    </div>
  )
  return (
    <div>
      <Upload action={Urls.api_v1_storage.data_content_file}
        name='files[]' data={{ type:'image' }}
        listType="picture-card"
        onChange={handleChange}
        fileList={fileList}
        onPreview={handlePreview}>
        {(!field.allowMulti && fileList.length > 0) ? null : uploadButton }
      </Upload>
      <Modal visible={previewVisible} footer={null} onCancel={handlePreviewCancel}>
        <img style={{ width: '100%' }} src={previewImage} />
      </Modal>
    </div>
  )
}

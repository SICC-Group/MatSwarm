import React, { FC, useState } from 'react';
import { Button, Avatar, Upload } from 'antd';
import { RcFile } from 'antd/lib/upload';

import { EditAvatarModal } from '../modal/EditAvatarModal';
import { TEXT } from '../../../locale/Text';

export interface Props {
  avatarUrl: string;
  userID: string;
  informUpdate: () => void;
}

export const AvatarView: FC<Props> = (props) => {
  const [avatarModalVisible, setAvatarModalVisible] = useState(false);
  const [file, setFile] = useState<RcFile>(null);


  const handleBeforeUpload = (file: RcFile, FileList: File[]) => {
    setFile(file);
    setAvatarModalVisible(true);
    return false;
  }

  const handleOnClose = () => {
    setAvatarModalVisible(false);
    props.informUpdate();
  }

  return (
    <>
      <Avatar src={`${props.avatarUrl}`} size={120} />
      <Upload beforeUpload={handleBeforeUpload} 
        fileList={file ? [file]: null}
        showUploadList={false} accept='image/*'>
        <Button style={{ display: 'block', margin: '16px auto' }}>{TEXT('dash:select_pic', '选择图片')}</Button>
      </Upload>
      <EditAvatarModal
        userID={props.userID}
        file={file}
        onClose={handleOnClose} 
        visible={avatarModalVisible} />
    </>
  )
}


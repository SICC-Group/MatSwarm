import React, { FC, useState, useRef } from 'react';

import AvatarEditor from 'react-avatar-editor';
import { Modal, Slider, notification } from 'antd';

import { UploadAvatar } from '../../../apis/session/UploadAvatar';
import { MgeError } from '../../../apis/Fetch';
import { TEXT } from '../../../locale/Text';

export interface Props {
  file?: File;
  visible?: boolean;
  onClose: () => void;
  userID: string;
}

const CanvasToBlob = (canvas: HTMLCanvasElement) => {
  // if (!HTMLCanvasElement.prototype.toBlob) {
    let binStr = atob(canvas.toDataURL().split(',')[1]);
    let len = binStr.length;
    let arr = new Uint8Array(len);
    for(let i = 0; i < len; ++i) arr[i] = binStr.charCodeAt(i);
    return new Blob([arr], { type: 'image/png' });
  // }
  // else {
  //   return canvas.toBlob()
  // }
}

export const EditAvatarModal: FC<Props> = (props) => {
  const [scale, setScale] = useState(1);
  const editor = useRef<AvatarEditor>(null);


  const handleOk = () => {
    const img = editor.current.getImageScaledToCanvas();
    UploadAvatar(props.userID, CanvasToBlob(img)).then(() => {
      props.onClose();
    }).catch((reason: MgeError) => {
      notification['error']({
        message: reason.message,
      })
    })
  }
  return (
    <Modal 
      onCancel={props.onClose}
      onOk={handleOk}
      okText={TEXT('dash:upload', '上传')}
      visible={props.visible}
      cancelText={TEXT('close', '关闭')}
      style={{textAlign: 'center'}}
      title={TEXT('dash:upload_avatar', '上传头像')}>
      <AvatarEditor ref={editor}
        image={props.file}
        width={180}
        height={180}
        borderRadius={90}
        color={[255, 255, 255, 0.3]} // RGBA
        scale={scale}
        rotate={0}
      />
      <div>
        <Slider step={0.001} value={scale} min={1} max={2}  onChange={v => setScale(v as number)}/>
      </div>
    </Modal>
  )
}

import React, { FC, useState } from 'react';
import { Button, Modal, Upload,notification } from 'antd';
import { UploadChangeParam } from 'antd/lib/upload';

import { SubHeader } from './SubHeader';

import { TemplateExportFileType as FileType, ExportTemplate } from '../../apis/template/Export';

import Urls from '../../apis/Urls';
import { FormattedMessage } from 'react-intl';
const { confirm } = Modal;
export interface FileUploaderProps {
  className?: string;
  style?: React.CSSProperties;
  templateID: number;
  categoryID: number;
}

export const FileUploader: FC<FileUploaderProps> = ({ className, style, templateID }) => {
  const [fileType, setFileType] = useState<FileType>(null);
  const [downloadModalVisible, setDownloadModalVisible] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState<string>(null);

  const handleClick = (type: FileType) => {
    setFileType(type);
    ExportTemplate(templateID, type).then(value => {
      setDownloadUrl(value);
      setDownloadModalVisible(true);
    })
  }
  const handleDownloadModelCancel = () => {
    setDownloadUrl(null);
    setDownloadModalVisible(false);
  }

  const handleUploadChange = (info: UploadChangeParam) => {
    const status = info.file.status;
    const response = info.file.response;
    if (status === 'done') {
      confirm({
        title: <FormattedMessage id='data:import_task_added' defaultMessage='格式校验任务已添加' />,
        content: (
          <div>
            <p><FormattedMessage id='data:import_task_added_detail' defaultMessage='已将校验任务加入任务列表，您可以点击确定按钮查看任务进度' /></p>
          </div>
        ),
        okText: <FormattedMessage id='data:go_to_task' defaultMessage='前往任务列表' />,
        cancelText:<FormattedMessage id='close' defaultMessage='关闭'/>,
        onOk() {
          window.location.href = Urls.task.index;
        },
        onCancel(){}
      })
    }
    if (status === 'error') {
      notification['error']({
          message: response.extra.err_detail
      })
  }
  }

  const handleCheckChange = (info: UploadChangeParam) => {
    const status = info.file.status;
    if (status === 'done') {
      confirm({
        title: <FormattedMessage id='data:import_task_added' defaultMessage='导入任务已添加' />,
        content: (
          <div>
            <p><FormattedMessage id='data:import_task_added_detail' defaultMessage='已将数据导入加入任务列表，您可以点击确定按钮查看任务进度' /></p>
          </div>
        ),
        okText: <FormattedMessage id='data:go_to_task' defaultMessage='前往任务列表' />,
        cancelText:<FormattedMessage id='close' defaultMessage='关闭'/>,
        onOk() {
          window.location.href = Urls.task.index;
        },
        onCancel(){}
      })
    }
  }

  return (
    <div className={`${className || ''}`} style={style}>
      <SubHeader title={<FormattedMessage id='data:choose_file_type' defaultMessage='选择文件类型' />} />
      <div style={{ textAlign: 'center' }}>
        <Button.Group size='large'>
          <Button type={fileType === FileType.Excel ? 'primary' : 'default'} onClick={() => handleClick(FileType.Excel)}>Excel</Button>
          <Button type={fileType === FileType.JSON ? 'primary' : 'default'} onClick={() => handleClick(FileType.JSON)}>JSON</Button>
          <Button type={fileType === FileType.XML ? 'primary' : 'default'} onClick={() => handleClick(FileType.XML)}>XML</Button>
        </Button.Group>
      </div>
      <Modal centered
        onCancel={handleDownloadModelCancel}
        visible={downloadModalVisible} title={<FormattedMessage id='data:download_file_template' defaultMessage='下载文件模板' />}
        cancelText={<FormattedMessage id='cancel' defaultMessage='取消' />}
        okText={<FormattedMessage id='close' defaultMessage='关闭' />}
        onOk={handleDownloadModelCancel}>
        <FormattedMessage id='data:template_file_generated' defaultMessage='模板文件已成功生成。您可以' />
        <a href={downloadUrl} download>
          <FormattedMessage id='data:click_here' defaultMessage='点击此处' />
        </a>
        <FormattedMessage id='data:to_download_file' defaultMessage='下载文件。' />
        <FormattedMessage id='data:upload_after_fill' defaultMessage='填写好数据后点击下面的按钮提交文件。' />
      </Modal>

      <SubHeader title={<FormattedMessage id='data:fill_and_upload' defaultMessage='填写后上传' />} />
      <div style={{ textAlign: 'center', padding: '12px 0' }}>
        <Upload.Dragger name='file' action={Urls.api_v1_storage.uploaded_file} onChange={handleUploadChange}>
          <p className="ant-upload-text">
            <FormattedMessage id='data:drag_file_here' defaultMessage='将填写好的文件拖入此处，或直接点此上传' />
          </p>
        </Upload.Dragger>
      </div>

      <SubHeader title={
        <div>
          <div style={{float: 'left'}}><FormattedMessage id='data:fill_and_check' defaultMessage='格式校验接口' /> </div>
          <h5 style={{color: 'red'}}>(仅用于校验数据格式，不存入系统)</h5>
        </div>
      } />
      <div style={{ textAlign: 'center', padding: '12px 0' }}>
        <Upload.Dragger name='file' action={Urls.api_v1_storage.check_file} onChange={handleUploadChange}>
          <p className="ant-upload-text">
            <FormattedMessage id='data:drag_file_here_check' defaultMessage='将格式校验的文件拖入此处  (仅用于校验数据格式，不存入系统)' />
          </p>
        </Upload.Dragger>
      </div>
    </div>
  );
}

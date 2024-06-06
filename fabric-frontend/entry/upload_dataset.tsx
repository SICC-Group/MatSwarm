import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { Upload, Button, message } from 'antd';
// import { UploadOutlined } from '@ant-design/icons';
// import axios from 'axios';
import { FLApiFetch } from '../apis/Fetch';
import { FormattedMessage } from 'react-intl';

const { Dragger } = Upload;

// TypeScript 类型定义：定义上传文件的状态类型
interface FileStatus {
    file: File;
    uploading: boolean;
}

const FileUploadPage: React.FC = () => {
    const [fileList, setFileList] = useState<any[]>([]);
    const [uploading, setUploading] = useState(false);

    // 文件改变处理函数
    const handleChange = (info: any) => {
        const { status } = info.file;
        if (status !== 'uploading') {
            console.log(info.file, info.fileList);
        }
        if (status === 'done') {
            message.success(`${info.file.name} file uploaded successfully.`);
        } else if (status === 'error') {
            message.error(`${info.file.name} file upload failed.`);
        }
        setFileList(info.fileList.filter((file: any) => !!file.status));
    };

    // 文件上传函数
    const handleUpload = async () => {

        const formData = new FormData();
        fileList.forEach(file => {
            formData.append('files[]', file.originFileObj);
        });

        setUploading(true);

        FLApiFetch('http://localhost:8000/api/v2/storage/dataset_csv/', 'POST', formData)
    };

    return (
        <div style={{ padding: 16 }}>
            <Upload.Dragger name='file' action={'http://127.0.0.1:8000/api/v2/storage/dataset_csv/'} >
                <p className="ant-upload-text">
                    <FormattedMessage id='data:drag_file_here' defaultMessage='将填写好的文件拖入此处，或直接点此上传' />
                </p>
            </Upload.Dragger>
        </div>
    );
};

export default FileUploadPage;
ReactDOM.render(<FileUploadPage />, document.getElementById('wrap'));
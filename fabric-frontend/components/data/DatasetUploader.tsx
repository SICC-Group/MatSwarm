import React, { FC, useState, useEffect } from 'react';
import { FormattedMessage } from 'react-intl';
import { Divider, Button, notification, Modal, Upload } from 'antd';
const { confirm } = Modal;
import { UploadChangeParam } from 'antd/lib/upload';
import { UploadProps } from 'antd/es/upload/interface';


import { CommitData } from '../../apis/data/Commit';

import { AnyField } from '../../apis/define/Field';
import { GetTemplate } from '../../apis/template/Get';
import { FlexLoading } from '../common/FlexLoading';
import { InputFieldRender } from './fields/content/render';
import { Translate as _T } from '../../locale/translate';
import { MgeError } from '../../apis/Fetch';
import Urls from '../../apis/Urls';

import { Meta } from './Meta';
import { Data } from '../../apis/define/Data';

import { FLApiFetch } from '../../apis/Fetch';

export interface DatasetUploaderProps {
    className?: string;
    style?: React.CSSProperties;
    templateID: number;
    categoryID: number;
    editMode?: boolean;
    dataID?: number;
}

export const DatasetUploader: FC<DatasetUploaderProps> = (props) => {
    const { templateID, className, style } = props;

    const [meta, setMeta] = useState<Data.MetaBase>({
        title: '', doi: '', reference: '', keywords: [],
        abstract: '', methods: new Set(), project: undefined, subject: undefined,
        source: Data.Source.SelfProduct, tid: templateID,

        public_range: 0, public_date: 0, contributor: '', institution: '',

    });

    const [template, setTemplate] = useState<AnyField[]>([]);
    const [templateMain, setTemplateMain] = useState<any>(null)
    const [fileurl, setFileurl] = useState<string>('')


    useEffect(() => {
        GetTemplate(templateID).then((value) => {
            setTemplate(value.content);
            setTemplateMain(value)
            setContent({});
            setMeta({
                title: '', doi: '', reference: '', keywords: [],
                abstract: '', methods: new Set(), project: undefined, subject: undefined,
                source: Data.Source.SelfProduct, tid: templateID,

                public_range: 0, public_date: 0, contributor: '', institution: '',
            })
        });
    }, [templateID]);


    const informUpdate = () => {
        setMeta(Object.assign({}, meta));
    }

    const [content, setContent] = useState<any>({});

    const informContentUpdate = () => {
        setContent(Object.assign({}, content));
    }

    const showSuccess = (dataID: number) => {
        Modal.success({
            title: _T('data_commit_success'),
            content: <a href={Urls.storage.show_data(dataID)}>
                {_T('data:view_data')}
            </a>
        })
    }

    const leavlConfirm = (e: BeforeUnloadEvent) => {
        let confirmationMessage = _T("leave_confirm");

        (e || window.event).returnValue = confirmationMessage;
        return confirmationMessage;
    }

    const openNotification = (error: any) => {

        let text = '';

        if ('id' in error) {
            text = _T(error.id);
        }
        else if (error instanceof MgeError) {
            text = `${error.message}: ${error.detail}`;
        }

        notification['error']({
            message: _T('error'),
            description: text,
            onClick: () => {
                console.log('Notification Clicked!');
            },
        });
    };

    useEffect(() => {
        window.addEventListener("beforeunload", leavlConfirm);
        return () => {
            window.removeEventListener("beforeunload", leavlConfirm);
        }
    }, [])

    const handleCommitClick = () => {
        CommitData(meta, content, template, templateMain).then((value) => {
            showSuccess(value);
        }).catch(error => {
            openNotification(error);
        });
    }


    const customUpload = ({ file, onSuccess, onError }: any) => {
        // 你可以在这里执行自定义上传逻辑，比如通过fetch或者axios发送请求
        const formData = new FormData();
        console.log(file)
        formData.append('file', file);

        FLApiFetch('http://127.0.0.1:8000/api/v1/storage/file/data/content', 'POST', formData).then((value) => {
            setFileurl(value.data);
        })

    };



    const handleUploadChange = (info: UploadChangeParam) => {
        const status = info.file.status;
        const response = info.file.response;
        if (status === 'done') {
            confirm({
                title: <FormattedMessage id='Dataset_uploaded' defaultMessage='数据集上传成功' />,
                content: (
                    <div>
                        <p><FormattedMessage id='Dataset_uploaded_detailed' defaultMessage='数据集上传成功，请将以下url填写至数据内容的url字段' /></p>
                        <p>{fileurl}</p>
                    </div>
                ),
                cancelText: <FormattedMessage id='close' defaultMessage='关闭' />,
                onCancel() { }
            })
        }
        if (status === 'error') {
            notification['error']({
                message: response.extra.err_detail
            })
        }
    }

    return (
        <div className={`${className || ''}`} style={style}>
            <p style={{ padding: '12px 0' }}>
                <FormattedMessage id='data:star_required' defaultMessage='所有带星号的字段都为必填项目' />
            </p>
            <Divider>
                <FormattedMessage id='metadata' defaultMessage='元数据' />
            </Divider>
            <Meta meta={meta} informUpdate={informUpdate} />
            <Divider>
                <FormattedMessage id='Datasetfile' defaultMessage='数据集文件' />
            </Divider>
            <Upload.Dragger onChange={handleUploadChange} customRequest ={customUpload}>
                <p className="ant-upload-text">
                    <FormattedMessage id='data:drag_file_here' defaultMessage='将填写好的文件拖入此处，或直接点此上传' />
                </p>
            </Upload.Dragger>
            <Divider>
                <FormattedMessage id='data:data_content' defaultMessage='数据内容' />
            </Divider>
            {
                (template.length === 0 ? <FlexLoading /> : <div>{InputFieldRender(template, informContentUpdate, content)}</div>)
            }
            <Divider />
            <div style={{ textAlign: 'center', paddingBottom: '16px' }}>
                <Button size='large' type='primary' onClick={handleCommitClick} style={{ minWidth: '120px' }}>
                    <FormattedMessage id='submit' defaultMessage='提交' />
                </Button>
            </div>
        </div>
    );
}

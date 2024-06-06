import React, { FC, useState, useEffect } from 'react';
import { FormattedMessage } from 'react-intl';
import { Divider, Button, notification, Modal } from 'antd';

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

export interface FormUploaderProps {
  className?: string;
  style?: React.CSSProperties;
  templateID: number;
  categoryID: number;
  editMode?: boolean;
  dataID?: number;
}

export const FormUploader: FC<FormUploaderProps> = (props) => {
  const { templateID, className, style } = props;

  const [meta, setMeta] = useState<Data.MetaBase>({
    title: '', doi: '', reference: '', keywords: [],
    abstract: '', methods: new Set(), project: undefined, subject: undefined,
    source: Data.Source.SelfProduct, tid: templateID,

    public_range: 0, public_date: 0, contributor: '', institution: '',

  });

  const [template, setTemplate] = useState<AnyField[]>([]);
  const [templateMain, setTemplateMain] = useState<any>(null)

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

  return (
    <div className={`${className || ''}`} style={style}>
      <p style={{ padding: '12px 0' }}>
        <FormattedMessage id='data:star_required' defaultMessage='所有带星号的字段都为必填项目' />
      </p>
      <Divider>
        <FormattedMessage id='metadata' defaultMessage='元数据' />
      </Divider>
      <Meta meta={meta} informUpdate={informUpdate}/>
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

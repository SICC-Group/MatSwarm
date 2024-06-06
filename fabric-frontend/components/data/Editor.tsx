import React, { FC, useState, useEffect } from 'react';
import { Divider, Button, notification, Modal } from 'antd';

import { FlexLoading } from '../common/FlexLoading';
import { InputFieldRender } from './fields/content/render';
import { Translate as _T } from '../../locale/translate';
import { MgeError } from '../../apis/Fetch';
import Urls from '../../apis/Urls';
import { FormattedMessage } from 'react-intl';
import { Meta } from './Meta';
import { GetData } from '../../apis/data/Get';
import { Data } from '../../apis/define/Data';
import { PatchData } from '../../apis/data/Commit';
import { Template } from '../../apis/define/Template';

export interface Props {
  className?: string;
  style?: React.CSSProperties;
  dataID: number;
}

export const DataEditor: FC<Props> = (props) => {
  const { className, style, dataID } = props;

  const [meta, setMeta] = useState<Data.MetaBase>({
    title: '', doi: '', reference: '', keywords: [],
    abstract: '', methods: new Set(), project: undefined, subject: undefined,
    source: Data.Source.SelfProduct, tid: 0,

    public_range: 0, public_date: 0, contributor: '', institution: '',
  });
  const [content, setContent] = useState<any>({});

  const [template, setTemplate] = useState<Template.Content>([]);

  useEffect(() => {
    GetData(dataID).then((result) => {
      setTemplate(result.template.content);
      setMeta(result.meta);
      setContent(result.content);
    });
  }, [dataID]);


  const informUpdate = () => {
    setMeta(Object.assign({}, meta));
  }

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
    PatchData(dataID, meta, content, template).then((value) => {
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
      <Meta meta={meta} informUpdate={informUpdate} is_edit={true} />
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

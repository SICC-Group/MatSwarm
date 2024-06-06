import React, { FC, useState, useEffect } from 'react';
import { Modal, Pagination, Input, Button} from 'antd';
import {FormattedMessage} from "react-intl";

import './ChooseTemplateModal.less';
import { ModalProps } from 'antd/lib/modal';
import { ListAllTemplates } from '../../apis/template/ListTemplates';
import { FlexLoading } from '../common/FlexLoading';
import { TemplatesReview } from '../../apis/define/TemplateReview';
import { RawTemplateContentToTemplateContent } from '../../apis/template/Get';
import { AnyField } from '../../apis/define/Field';


export interface Props extends Omit<ModalProps, 'onOk'> {
  informLoad: (content: AnyField[]) => void;
}

export const ChooseTemplateModal: FC<Props> = (props) => {

  const [loading, setLoading] = useState(false);

  const [tid, setTid] = useState(0);
  const [tRawContent, setTRawContent]= useState<any | null>(null)

  const [currentPage, setCurrentPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [pageSize, setPageSize] = useState(0);

  const [content, setContent] = useState<TemplatesReview[]>([]);
  const [query, setQuery] = useState<string>('');

  useEffect(() => {
    setLoading(true);
    ListAllTemplates(currentPage).then(value => {
      setTotal(value.count);
      // setCurrentPage(0);
      setPageSize(value.page_size);
      setLoading(false);
      setContent(value.results);
    })
  }, []);

  const changeListTemplates = (currentPage: number, query_c: string) => {
    ListAllTemplates(currentPage, query_c).then(value => {
      setTotal(value.count);
      setCurrentPage(currentPage);
      setPageSize(value.page_size);
      setLoading(false);
      setContent(value.results);
    })
  }
  
  const columnSearch = () => {
    changeListTemplates(1, query);
  }
  const columnReset = () => {
    setQuery('');
    changeListTemplates(1, '');
  }

  const handleSelectTemplate = (t: TemplatesReview) => {
    setTid(t.id);
    setTRawContent(t.content);
  }

  const handleOk = () => {
    const content = RawTemplateContentToTemplateContent(tRawContent);
    props.informLoad(content);
  }

  return (
    <Modal {...props}
      title={<FormattedMessage id='template:import' defaultMessage='模板导入' />}
      cancelText={<FormattedMessage id='cancel' defaultMessage='取消' /> }
      okText={<FormattedMessage id='template:import_selected' defaultMessage='导入选中模板' />}
      onOk={handleOk}
      okButtonProps={{ disabled: tid === 0 }}>
      {loading ? <FlexLoading style={{height: '320px'}}/> : (
        <>
          <div>
            <Input
              style={{ width: 150, marginBottom: 8 }}
              value={query}
              onChange={e => setQuery(e.target.value)}
            />
            <Button
              type="primary"
              icon="search"
              size="small"
              style={{ width: 70, margin: "0 8px" }}
              onClick={columnSearch}
            >
              <FormattedMessage id='search' defaultMessage='查找'/>
              </Button>
            <Button onClick={columnReset} size='small' style={{ width: 70 }}>
              <FormattedMessage id='reset' defaultMessage='重置' />
            </Button>
          </div>
          <div style={{height: '320px', overflowY: 'scroll'}}>
            {
              content && content.map((value) => {
                return (
                  <div key={value.id}
                    onClick={() => handleSelectTemplate(value)}
                    className={`ChooseTemplateModal__TemplateItem ${value.id === tid ? 'selected': ''}`}>
                    {value.title}
                  </div>
                )
              })
            }
          </div>
          
          <Pagination
            pageSize={pageSize}
            current={currentPage}
            onChange={(page) => changeListTemplates(page, query)}
            total={total} />
        </>

      )}
    </Modal>
  )
}

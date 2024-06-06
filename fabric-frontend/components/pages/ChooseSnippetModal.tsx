import React, { FC, useState, useEffect } from 'react';
import { Modal, Pagination, Input, Button} from 'antd';
import './ChooseTemplateModal.less';
import { ModalProps } from 'antd/lib/modal';
import { get_snippets } from '../../apis/template/ListSnippets';
import { FlexLoading } from '../common/FlexLoading';
import { RawTemplateContentToTemplateContent } from '../../apis/template/Get';
import { AnyField } from '../../apis/define/Field';


export interface Props extends Omit<ModalProps, 'onOk'> {
  informLoad: (content: AnyField[]) => void;
}

export const ChooseSnippetModal: FC<Props> = (props) => {

  const [loading, setLoading] = useState(false);
  const [tid, setTid] = useState(0);
  const [tRawContent, setTRawContent]= useState<any | null>(null)
  const [currentPage, setCurrentPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [pageSize, setPageSize] = useState(20);
  const [content, setContent] = useState<any>([]);

  useEffect(() => {
    setLoading(true);
    get_snippets(1).then(value => {
      setLoading(false);
      setContent(value.results);
      setCurrentPage(1);
      setTotal(value.total);
    })
  }, []);

  const handlePageChange = (currentPage: number) => {
    get_snippets(currentPage).then(value => {
      setTotal(value.total);
      setCurrentPage(currentPage);
      setLoading(false);
      setContent(value.results);
    })
  }

  const handleSelectTemplate = (t:any) => {
    setTid(t.id);
    setTRawContent(t.content);
  }

  const handleOk = () => {
    const content = RawTemplateContentToTemplateContent(tRawContent);
    props.informLoad(content);
  }

  return (
    <Modal {...props}
      title='模板片段导入'
      cancelText='取消'
      okText='导入选中模板片段'
      onOk={handleOk}
      okButtonProps={{ disabled: tid === 0 }}>
      {loading ? <FlexLoading style={{height: '320px'}}/> : (
        <>
          <div style={{height: '320px', overflowY: 'scroll'}}>
            {
              content && content.map((value:any) => {
                return (
                  <div key={value.id}
                    onClick={() => handleSelectTemplate(value)}
                    className={`ChooseTemplateModal__TemplateItem ${value.id === tid ? 'selected': ''}`}>
                    {value.snippet_name}
                  </div>
                )
              })
            }
          </div>
          
          <Pagination
            pageSize={pageSize}
            current={currentPage}
            onChange={(page) => handlePageChange(page)}
            total={total} />
        </>

      )}
    </Modal>
  )
}

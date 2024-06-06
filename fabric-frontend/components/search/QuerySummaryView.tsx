import React, { FC, useState, useEffect } from 'react';
import { Table, PageHeader, notification, Button } from 'antd';

import { QuerySummaryItem, QueryTemplateItem, GetQueryTemplate, QueryTemplateDetail } from '../../apis/search/v2/Query';
import { Link, RouteComponentProps, withRouter } from 'react-router-dom';
import { FieldTreeView } from './FieldTreeView';
import { DataDetailList, DetailColumn } from './DataDetailList';
import { FieldType } from '../../apis/define/FieldType';
import { Template } from '../../apis/define/Template';
import { LoadingModal } from '../common/LoadingModal';
import { FormattedMessage } from 'react-intl';


interface Props extends RouteComponentProps {
  summary: QuerySummaryItem[];
  loading?: boolean;
  init?: boolean;
  templateID?: number;
  queryID?: string;
  onAddTemplate: (tid: number) => void;
  onRemoveTemplate: (tid: number) => void;
  onAddData: (id: number | number[]) => void;
  onRemoveData: (id: number | number[]) => void;
}

// 数据展开成模板的列表
interface InnerSummary extends QueryTemplateItem {
  category_id: number;
  category_name: string;
  span: number;
}

function TransformQuerySummary(summary: QuerySummaryItem[]): InnerSummary[] {
  let result: InnerSummary[] = [];
  summary.forEach((value) => {
    const temp: InnerSummary[] = value.templates.map((x, index) => ({
      id: x.id, name: x.name, url: x.url, download: x.download,
      count_at_least: x.count_at_least,
      span: index === 0 ? value.templates.length : 0,
      category_id: value.id, category_name: value.name,
    }))
    result = result.concat(temp);
  })
  return result;
}
const { Column } = Table;

const _QuerySummaryView: FC<Props> = (props) => {

  // 总览视图用到的信息
  const [innerSummary, setInnerSummary] = useState<InnerSummary[]>([]);

  const [detail, setDetail] = useState<QueryTemplateDetail | null>(null);

  const [cols, setCols] = useState<DetailColumn[]>([
    { fullPath: ['title'], type: FieldType.String, isMeta: true },
    { fullPath: ['realname'], type: FieldType.String, isMeta: true },
    { fullPath: ['abstract'], type: FieldType.String, isMeta: true },
    { fullPath: ['doi'], type: FieldType.String, isMeta: true },
    { fullPath: ['project'], type: FieldType.String, isMeta: true },
    { fullPath: ['reference'], type: FieldType.String, isMeta: true },
    { fullPath: ['subject'], type: FieldType.String, isMeta: true },
  ]);

  const [detailLoading, setDetailLoading] = useState(true);

  const [data, setData] = useState<string[]>(null);
  const [meta, setMeta] = useState<string[]>(null)

  useEffect(() => {
    setInnerSummary(TransformQuerySummary(props.summary));
  }, [props.summary])
  
  const handleCommit = (meta: string[], data: string[], template: Template.Content) => {
    const metaCols: DetailColumn[] = meta.map(v => ({ fullPath: [v], type: FieldType.String, isMeta: true }))
    const dataCols: DetailColumn[] = data.map(value => {
      return {
        fullPath: value.split('.'),
        type: Template.GetFieldByPathString(template, value).type as any,
        isMeta: false,
      }
    });
    const cols = metaCols.concat(dataCols);
    setDetailLoading(true);
    setCols(cols);
    setData(data);
    setMeta(meta);
    GetQueryTemplate(props.queryID, props.templateID, {
      return_data: data,
      return_meta: meta,
    }).then((value) => {
      setDetail(value);
      setDetailLoading(false);
    })
  }

  useEffect(() => {
    if (props.templateID != null) {
      setDetailLoading(true);
      GetQueryTemplate(props.queryID, props.templateID, {
      }).then((value) => {
        setDetail(value);
        setDetailLoading(false);
      })
    }
  }, [props.templateID]);

  const handleAddData = (id: number | number[]) => {
    props.onAddData(id);
    const newDetail = {...detail};
    newDetail.data = [...detail.data];
    if (typeof id === 'number') {
      for (let i of newDetail.data) {
        if (i.data.id === id) {
          i.download = true;
          setDetail(newDetail);
          return;
        }
      }
    } else {
      for (let i of newDetail.data) {
        for (let j = 0; j < id.length; j++) {
          if (i.data.id === id[j]) {
            i.download = true;
            setDetail(newDetail);
          }
        }
      }
       return;
    }
  }
    const handleRemoveData = (id: number | number []) => {
      props.onRemoveData(id);
      const newDetail = { ...detail };
      newDetail.data = [...detail.data];
      if (typeof id === 'number'){
        for (let i of newDetail.data) {
          if (i.data.id === id) {
            i.download = false;
            setDetail(newDetail);
            return;
          }
        }
      }
      else {
        for (let i of newDetail.data) {
          for (let j = 0; j < id.length; j++){
            if (i.data.id === id[j]) {
              i.download = false;
              setDetail(newDetail);      
            }
          }
        }
        return;
      }
    }

  const handlePageChange = (newPage: number) => {
    setDetailLoading(true);
    if (data == null && meta == null){
      GetQueryTemplate(props.queryID, props.templateID, {
        page: newPage
      }).then((value) => {
        setDetail(value);
        setDetailLoading(false);
      })
    }
    else {
      GetQueryTemplate(props.queryID, props.templateID, {
        page: newPage,
        return_data: data,
        return_meta: meta,
      }).then((value) => {
        setDetail(value);
        setDetailLoading(false);
      })
    }
  }

  if (props.templateID != null) {
    return (
      <div style={{flexGrow: 1, display: 'flex', flexDirection: 'column'}}>
        <LoadingModal loading={detailLoading}/>
        <div style={{ flexGrow: 1, display: 'flex', flexDirection: 'row'}}>
          <div style={{flexGrow: 1, marginRight: '6px', overflowX: 'scroll', backgroundColor: '#FFF'}}>
          <PageHeader 
          style={{flexGrow: 0 }}
          backIcon={<i className="fa fa-arrow-left" aria-hidden="true"></i>} onBack={() => { props.history.goBack() }} title={<FormattedMessage id='back' defaultMessage='返回'/>}/>
            {detailLoading ? <div style={{minHeight: '800px', flexGrow: 1}}/> :<DataDetailList
              onAddData={handleAddData}
              onRemoveData={handleRemoveData}
              onPageChange={handlePageChange}
              columns={cols}
              data={detail!.data} 
              count={detail!.total} 
              page={detail!.page} 
              page_size={detail!.page_size}/>}
          </div>
          <div style={{marginLeft: '6px', flexGrow: 0, flexShrink: 0, flexBasis: '240px', background: '#FFF', height: '480px', overflow: 'hidden'}}>
            <FieldTreeView
              templateID={props.templateID} onCommit={handleCommit}/>
          </div>
        </div>
      </div>
    )
  }
  else {
    return (
      <Table
        style={{ backgroundColor: '#FFF' }}
        bordered dataSource={innerSummary} rowKey='id' pagination={false}>
        <Column title={<FormattedMessage id='category' defaultMessage='材料类别'/>} dataIndex='category_name' render={(text, record: InnerSummary) => {
          return {
            children: text,
            props: {
              rowSpan: record.span,
            }
          }
        }} />
        <Column title={<FormattedMessage id={'dataShow:template_name'} defaultMessage='模板名称'/>} dataIndex='name' />
        <Column title={<FormattedMessage id={'dash:data_count'}  defaultMessage='数据量'/>} dataIndex='count_at_least' render={(text, record: InnerSummary) => {
          return <Link to={`/${props.queryID}/${record.id}`}>{text}</Link>
        }} />
        <Column title={<FormattedMessage id={'option'} defaultMessage='操作' />} render={(_, record: InnerSummary) => {
          return (
            <Button type={record.download ? 'primary' : 'default'} 
              onClick={() => record.download ? props.onRemoveTemplate(record.id) : props.onAddTemplate(record.id)}>
              {record.download ? <FormattedMessage id='Already in download list' defaultMessage='已在下载列表中'/>: <FormattedMessage id='Add to download list' defaultMessage='添加到下载列表'/>}
            </Button>
          )
        }}/>
      </Table>
    )
  }
}

export const QuerySummaryView = withRouter(_QuerySummaryView);

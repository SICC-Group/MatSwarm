import React, { FC, useState, useEffect } from 'react';
import { Table, PageHeader, notification, Button } from 'antd';

import { QuerySummaryItem, QueryTemplateItem, GetQueryTemplate, QueryTemplateDetail,GetQueryDataList,CreateFullTextQuery } from '../../apis/search/v2/Query';
import { Link, RouteComponentProps, withRouter } from 'react-router-dom';
import { FieldTreeView } from './FieldTreeView';
import { DataDetailList, DetailColumn } from './DataDetailList';
import { FieldType } from '../../apis/define/FieldType';
import { Template } from '../../apis/define/Template';
import { LoadingModal } from '../common/LoadingModal';
import { MgeError } from '../../apis/Fetch';
import { FormattedMessage } from 'react-intl';


interface Props extends RouteComponentProps {
  loading?: boolean;
  init?: boolean;
  onAddTemplate: (tid: number) => void;
  onRemoveTemplate: (tid: number) => void;
  onAddData: (id: number | number[]) => void;
  onRemoveData: (id: number | number[]) => void;
  id:number;
}

// 数据展开成模板的列表
interface InnerSummary extends QueryTemplateItem {
  category_id: number;
  category_name: string;
  span: number;
}

const { Column } = Table;

const _QueryDataView: FC<Props> = (props) => {
  const str = window.location.pathname; 
  // 总览视图用到的信息

  const [detail, setDetail] = useState<QueryTemplateDetail | null>(null);
  const [temId,settemId]  = useState<number>();
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
    GetQueryDataList(props.id,{}).then((value) => {
      setDetail(value);
      settemId(value.data[0].data.template)
      setDetailLoading(false);
    })
  }

  useEffect(() => {
      GetQueryDataList(props.id,{}).then((value) => {
        setDetail(value);
        settemId(value.data[0].data.template)
        setDetailLoading(false);
      })
  }, []);

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
      GetQueryDataList(props.id,{
        page: newPage,
      }).then((value) => {
        setDetail(value);
        settemId(value.data[0].data.template)
        setDetailLoading(false);
      })
    }
    else {
      GetQueryDataList(props.id,{
        page: newPage,
        return_data: data,
        return_meta: meta,
      }).then((value) => {
        setDetail(value);
        setDetailLoading(false);
      })
    }
  }

    return (
      <div style={{flexGrow: 1, display: 'flex', flexDirection: 'column'}}>
        <div style={{ flexGrow: 1, display: 'flex', flexDirection: 'row'}}>
          <div style={{flexGrow: 1, marginRight: '6px', overflowX: 'scroll', backgroundColor: '#FFF'}}>
          <PageHeader 
          style={{flexGrow: 0 }}
          backIcon={<i className="fa fa-arrow-left" aria-hidden="true"></i>} onBack={() => { window.location.href="/search/" }} title={<FormattedMessage id='back' defaultMessage='返回'/>}/>
            {detailLoading ? <div style={{minHeight: '800px', flexGrow: 1}}/> :
            <DataDetailList
              onAddData={handleAddData}
              onRemoveData={handleRemoveData}
              onPageChange={handlePageChange}
              columns={cols}
              data={detail!.data} 
              count={detail!.total} 
              page={detail!.page} 
              page_size={detail!.page_size}/>
              }
          </div>
          <div style={{marginLeft: '6px', flexGrow: 0, flexShrink: 0, flexBasis: '240px', background: '#FFF', height: '480px', overflow: 'hidden'}}>
                <FieldTreeView
                templateID={temId} onCommit={handleCommit}/>
            </div>
        </div>
      </div>
    )
}

export const QueryDataView = withRouter(_QueryDataView);


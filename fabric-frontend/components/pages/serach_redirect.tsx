import React, { FC, useState, useEffect } from 'react';
import { RouteComponentProps, withRouter } from 'react-router';
import { Tag, Modal, Spin, Input, Select } from 'antd';
import { QueryDataView } from '../search/QueryDataView';
import { RenderTypeView, RenderType } from '../search/RenderTypeView';
import { Search } from '../../apis/define/search';
import { Query, CreateFullTextQuery, CreateMetaDataQuery, GetQuery, PatchQueryDownload, PatchQuery, PutQuery, Summary,GetQueryDataList,QueryTemplateDetail } from '../../apis/search/v2/Query';
import Urls from '../../apis/Urls';
import { Container } from '../layout/Container';
import { FilterView } from '../search/FilterView';
import { SaveSearchResult } from '../../utils/SavedSearch';
import { LoadingModal } from '../common/LoadingModal';
import { FormattedMessage } from 'react-intl';
const Option = Select.Option;

export interface Props extends RouteComponentProps {

}

const _SearchRedirectPage: FC<Props> = (props) => {
  const { history } = props;

  const [searchText, setSearchText] = useState('');
  const [searchType, setSearchType] = useState<Search.MetaType>(Search.MetaType.Text);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState<Query | null>(null);
  const [textModified, setTextModified] = useState(false);
  const [queryid,setqueryId]=useState<number>(null);
  const [dataloading,setDataLoading] = useState<boolean>(true);
  const handleSearchTypeChange = (value: Search.MetaType) => {
    setSearchType(value);
    setTextModified(true);
  }

  const searchTypeSelect = (
    <Select style={{ width: 120 }} value={searchType} onChange={handleSearchTypeChange}>
      <Option value={Search.MetaType.Text}><FormattedMessage id='Full-Text Search' defaultMessage='全文检索'></FormattedMessage></Option>
      <Option value={Search.MetaType.Title}><FormattedMessage id='data:title' defaultMessage='标题' /></Option>
      <Option value={Search.MetaType.DOI}>DOI</Option>
      <Option value={Search.MetaType.Abstract}>摘要</Option>
      <Option value={Search.MetaType.Author}>作者</Option>
      <Option value={Search.MetaType.Keywords}>关键词</Option>
    </Select>
  )

  const handleResult = (result: Query) => {
    setQuery(result);
    setTextModified(false);
    if (props.location.pathname.endsWith('list')) {
      history.push(`/${result.id}/list`)
    }
    else {
      history.push(`/${result.id}`)
    }

    setLoading(false);
  }

  const handleOnSearch = (value: string) => {
    value = value.trim();
    if (value.length === 0) return;
    setLoading(true);
    if (textModified) {
      if (searchType === Search.MetaType.Text) {
        CreateFullTextQuery(value).then(handleResult);
      }
      else {
        CreateMetaDataQuery(searchType, value).then(handleResult);
      }
    }
    else {
      if (searchType === Search.MetaType.Text) {
        PutQuery(query.id, {
          text: value, data: null, meta: null
        }).then(handleResult);
      }
      else {
        PutQuery(query.id, {
          meta: { and: [{ field: searchType, val: value, op: Search.Operator.StrContain }] }
        }).then(handleResult);
      }
    }
  }

  const handleRenderTypeChange = (t: RenderType) => {
    if (query == null) { return; }
    if (t === RenderType.Table) {
      // 列表视图
      history.push(`/${query.id}`)
    }
    else {
      // 简单视图
      history.push(`/${query.id}/list`)
    }
  }

  const handleAdvSearchClick = () => {
    window.open(Urls.search.expr);
  }

  useEffect(() => {
    let urlmat =  window.location.href.split('/')
    CreateFullTextQuery(urlmat[urlmat.length-1]).then((result)=>{
      setqueryId(result.id);
      setQuery(result);
      setTextModified(false);
      setDataLoading(false);
    })
  }, []);

  const handleAddData = (id: number | number[]) => {
    SaveSearchResult(queryid, searchText);
    if (typeof id === 'number'){
      PatchQueryDownload(queryid, { download: { data: { include: [id] } } }).then((result) => {
        const newQuery = Query.copy(query);
        for (let i of newQuery.q.data) {
          if (i.data.id === id) {
            i.download = true;
            setQuery(newQuery);
            return;
          }
        }
      })
    }
    else { // 一次全选中多个数据时
      PatchQueryDownload(queryid, { download: { data: { include: id } } }).then((result) => {
        const newQuery = Query.copy(query);
        for (let i of newQuery.q.data) {
          for (let j = 0; j < id.length ; j++){
            if (i.data.id === id[j]) {
              i.download = true;
              setQuery(newQuery);
            }
          }
        }
        return;
      })
    }
  }

  const handleRemoveData = (id: number | number[]) => {
    if (typeof id === 'number'){
      PatchQueryDownload(queryid, { download: { data: { exclude: [id] } } }).then((result) => {
        const newQuery = Query.copy(query);
        for (let i of newQuery.q.data) {
          if (i.data.id === id) {
            i.download = false;
            setQuery(newQuery);
            return;
          }
        }
      })
    }
    else {
      PatchQueryDownload(queryid, { download: { data: { exclude: id } } }).then((result) => {
        const newQuery = Query.copy(query);
        for (let i of newQuery.q.data) {
          for (let j = 0 ;j < id.length; j++){
            if (i.data.id === id[j]) {
              i.download = false;
              setQuery(newQuery);
            }
          }
        }
        return;
      })
    }
  }

  const handleSearchTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTextModified(true);
    setSearchText(e.target.value)
  }

  const handleAddTemplate = (tid: number) => {
    SaveSearchResult(queryid, searchText);
    PatchQueryDownload(query.id, { download: { template: { include: [tid] } } }).then((result) => {
      const newQuery = Query.copy(query);
      for (let i of newQuery.q.summary.category) {
        for (let t of i.templates) {
          if (t.id === tid) {
            t.download = true;
            setQuery(newQuery);
            return;
          }
        }
      }
    })
  }

  const handleRemoveTemplate = (tid: number) => {
    PatchQueryDownload(queryid, { download: { template: { exclude: [tid] } } }).then((result) => {
      const newQuery = Query.copy(query);
      for (let i of newQuery.q.summary.category) {
        for (let t of i.templates) {
          if (t.id === tid) {
            t.download = false;
            setQuery(newQuery);
            return;
          }
        }
      }
    })
  }

  const renderType = (props.location.pathname.endsWith('list') ? RenderType.List : RenderType.Table);
  return (
    <>
    <LoadingModal loading={loading} />
      <div style={{ backgroundColor: '#FFF', flexGrow: 0 }}>
        <Container style={{ marginBottom: 0 }}>
          <Input.Search
            onSearch={handleOnSearch} onChange={handleSearchTextChange} value={searchText}
            style={{ marginTop: query == null ? '20vh' : '48px', transition: 'margin-top 0.5s ease' }}
            enterButton={<FormattedMessage id='search' defaultMessage='搜索' />} size='large' addonBefore={searchTypeSelect} />
          <div style={{ textAlign: 'right', padding: '8px 0' }}>
            <Tag color="#108ee9" onClick={handleAdvSearchClick}
              style={{ cursor: 'pointer', marginRight: 0 }}><FormattedMessage id='help:adv_search' defaultMessage='高级检索' /></Tag>
          </div>
        </Container>
      </div>
      <div style={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        <Container style={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
            <div style={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
              {dataloading ? null:
                <QueryDataView
                  onAddData={handleAddData}
                  onRemoveData={handleRemoveData}
                  onAddTemplate={handleAddTemplate}
                  onRemoveTemplate={handleRemoveTemplate}
                  loading={false} init={query == null}
                  id={queryid}
                />
              }
              </div>
          
        </Container>

      </div>
      
    </>
  );
}

export const SearchRedirectPage = withRouter(_SearchRedirectPage);


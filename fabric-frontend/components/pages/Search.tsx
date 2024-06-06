import React, { FC, useState, useEffect } from 'react';
import { RouteComponentProps, withRouter } from 'react-router';
import { Tag, Input, Select, Menu } from 'antd';

import { SearchResultList } from '../search/SearchResultList';
import { QuerySummaryView } from '../search/QuerySummaryView';
import { RenderTypeView, RenderType } from '../search/RenderTypeView';
import { Search } from '../../apis/define/search';
import { Query, CreateFullTextQuery, CreateMetaDataQuery, GetQuery, PatchQueryDownload, PatchQuery, PutQuery, Summary } from '../../apis/search/v2/Query';
import Urls from '../../apis/Urls';
import { Container } from '../layout/Container';

import { LoadingModal } from '../common/LoadingModal';
import { FilterView } from '../search/FilterView';
import { SaveSearchResult } from '../../utils/SavedSearch';
import {ExprSearchResult} from "../search/ExprSearchResult";
import { FormattedMessage } from 'react-intl';
import { VerifyVO } from '../../entry/mpt';

const Option = Select.Option;

export interface Props extends RouteComponentProps {

}

const _SearchPage: FC<Props> = (props) => {
  const { history } = props;

  const [searchText, setSearchText] = useState('');
  const [searchType, setSearchType] = useState<Search.MetaType>(Search.MetaType.Text);
  const [loading, setLoading] = useState(false);



  const [query, setQuery] = useState<Query | null>(null);


  const [textModified, setTextModified] = useState(false);
  const [currentMenu, setCurrentMenu] = useState('1');
  const [isExpr, setIsExpr] = useState(false); // 是否为高级搜索结果页面
  const [isMulti, setIsMulti] = useState(false); // 是否需要返回南大通用搜索结果

  const handleSearchTypeChange = (value: Search.MetaType) => {
    setSearchType(value);
    setTextModified(true);
  }

  const searchTypeSelect = (
    <Select style={{ width: 120 }} value={searchType} onChange={handleSearchTypeChange}>
      <Option value={Search.MetaType.Text}><FormattedMessage id='Full-Text Search' defaultMessage='全文检索'></FormattedMessage></Option>
      <Option value={Search.MetaType.Title}><FormattedMessage id='data:title' defaultMessage='标题' /></Option>
      <Option value={Search.MetaType.DOI}>DOI</Option>
      <Option value={Search.MetaType.Abstract}><FormattedMessage id='data:abstract' defaultMessage='摘要' /></Option>
      <Option value={Search.MetaType.Author}><FormattedMessage id='author' defaultMessage='作者' /></Option>
      <Option value={Search.MetaType.Keywords}><FormattedMessage id='dataShow:keywords' defaultMessage='关键词' /></Option>
    </Select>
  )



  const handleResult = (result: Query) => {
    console.log("test")
    console.log(result.clientVO)
    VerifyVO(result.clientVO)
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

  const handleImgSearchClick = () => {
    window.open(Urls.image_search.index);
  }
  const handleAdvSearchClick = () => {
    window.open(Urls.search.expr);
  }

  const templateID = (props.match.params as any).template_id as string | null;
  const queryID = (props.match.params as any).query_id as string | null;
  useEffect(() => {
    if (window.location.pathname.split('/')[1] === 'expr_result'){
      setIsExpr(true);
      const temp = window.location.search.split('=')[1];
      if (temp.indexOf('false') >= 0 ) {setIsMulti(false);}
      else {setIsMulti(true); }
    }
    else {
      setIsExpr(false);
    }
  }, []);
  useEffect(() => {
    if (queryID != null && query == null) {
      setLoading(true);
      GetQuery(queryID, {}).then((result) => {
        setQuery(result);
        setTextModified(false);
        if (result.q.value.text != null) {
          setSearchType(Search.MetaType.Text);
          setSearchText(result.q.value.text);
        }
        else {
          try {
            setSearchType((result.q.value.meta as any).and[0].field);
            setSearchText((result.q.value.meta as any).and[0].val)
          }
          catch{

          }
        }
        setLoading(false);
      });
    }
  }, [queryID]);

  const handleAddData = (id: number | number[]) => {
    SaveSearchResult(query.id, searchText);
    if (typeof id === 'number'){
      PatchQueryDownload(query.id, { download: { data: { include: [id] } } }).then((result) => {
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
      PatchQueryDownload(query.id, { download: { data: { include: id } } }).then((result) => {
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
      PatchQueryDownload(query.id, { download: { data: { exclude: [id] } } }).then((result) => {
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
      PatchQueryDownload(query.id, { download: { data: { exclude: id } } }).then((result) => {
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

  const handlePageChange = (newPage: number) => {
    setLoading(true);
    GetQuery(String(query.id), { page: newPage }).then(handleResult).then(() => {
      window.scrollTo({ top: 0 })
    });
  }

  const handleUpdateCondition = (cond: Search.Condition.And) => {
    setLoading(true);
    if (searchType === Search.MetaType.Text) {
      PutQuery(query.id, {
        text: searchText, data: null, meta: { and: [cond] }
      }).then(handleResult);
    }
    else {
      let finalCond = cond.and.concat([{ field: searchType, val: searchText, op: Search.Operator.StrContain }]);
      PutQuery(query.id, {
        meta: { and: finalCond}
      }).then(handleResult);
    }
  }

  const handleAddTemplate = (tid: number) => {
    SaveSearchResult(query.id, searchText);
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
    PatchQueryDownload(query.id, { download: { template: { exclude: [tid] } } }).then((result) => {
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

  const renderType = (templateID === 'list' ? RenderType.List : RenderType.Table);
  return (
    <>
      <LoadingModal loading={loading} />
      <div style={{ backgroundColor: '#FFF', flexGrow: 0 }}>
        {
          isMulti === true ?
              <Menu selectedKeys={[currentMenu]} mode='horizontal' style={{padding: '0px 83px'}}>
                <Menu.Item key={'0'} onClick={() => {setCurrentMenu('0')}}>
                  异构搜索
                </Menu.Item>
                <Menu.Item key={'1'} onClick={() => {setCurrentMenu('1')}}>
                  全文检索
                </Menu.Item>
              </Menu>
              : null
        }
        {
          isExpr === true ? null :
              <Container style={{ marginBottom: 0 }}>
                <Input.Search
                    onSearch={handleOnSearch} onChange={handleSearchTextChange} value={searchText}
                    style={{ marginTop: query == null ? '20vh' : '48px', transition: 'margin-top 0.5s ease' }}
                    enterButton={<FormattedMessage id='search' defaultMessage='搜索' />} size='large' addonBefore={searchTypeSelect} />
                <div style={{ textAlign: 'right', padding: '8px 0' }}>
                  {/* <Tag color="#108ee9" onClick={handleImgSearchClick}
              style={{ cursor: 'pointer' }} >图片检索</Tag> */}
                  <Tag color="#108ee9" onClick={handleAdvSearchClick}
                       style={{ cursor: 'pointer', marginRight: 0 }}><FormattedMessage id='help:adv_search' defaultMessage='高级检索' /></Tag>
                </div>
                {query == null ? null : (<div style={{ margin: '8px 0' }}>
                  <RenderTypeView value={renderType} onChange={handleRenderTypeChange} />
                </div>)}
              </Container>
        }

      </div>
      {
        isMulti === true && currentMenu === '0'? <ExprSearchResult query={query.q.value}/> :
            <div style={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
              <Container style={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                {query == null ? null : <FilterView summary={query.q.summary} updateCondition={handleUpdateCondition} />}
                {query == null ? null : (
                    <div style={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                      {renderType === RenderType.List ?
                          <SearchResultList
                              onAddData={handleAddData}
                              onRemoveData={handleRemoveData}
                              onPageChange={handlePageChange}
                              count={query.q.total}
                              page={query.q.page}
                              page_size={query.q.page_size}
                              data={query.q.data} /> :
                          <QuerySummaryView
                              onAddData={handleAddData}
                              onRemoveData={handleRemoveData}
                              onAddTemplate={handleAddTemplate}
                              onRemoveTemplate={handleRemoveTemplate}
                              templateID={templateID == null ? null : Number(templateID)}
                              loading={loading} init={query == null}
                              queryID={queryID}
                              summary={query.q.summary.category} />}
                    </div>
                )}
              </Container>

            </div>
      }
    </>
  );
}

export const SearchPage = withRouter(_SearchPage);


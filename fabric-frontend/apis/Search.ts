// import * as $ from 'jquery';

import { FieldType } from '../apis/define/FieldType';
import { Search } from '../apis/define/search';
import Urls from './Urls';
import JsonApiFetch from './Fetch';

export enum GroupSearchSortType {
  TemplateTitle = 't-title',
  TemplateCount = 't-count',
}

export enum SearchSortType {
  DataTitle = 'd-title',
  DataTime = 'd-time',
  DataDOI = 'd-doi',
  DataAuthor = 'd-author',
  DataDownlaods = 'd-downloads',
  DataViews = 'd-views',
  DataScore = 'd-score',
}

export enum SearchOrderType {
  Descending = 'desc',
  Ascending = 'asc',
}

export enum ConditionType{
  Field = 'field', And = 'and', Or = 'or',
}

export interface DataMeta {
  id: number;
  title: string;
  category: string;
  category_id: number;
  source: string;
  tid: number;
  keywords: string[];
  doi: string;
  score: number;
  downloads: number;
  views: number;
  abstract: string;
  purpose?: string;
  author: string;
  add_time: string;
  project: string;
  reference: string;
}

export interface SearchResult  {
  page_count: number;
  page_num: number;
  total_count: number;
  result: DataMeta[];
}

export interface SearchConfig {
  q: { meta?: Search.Condition.Any, data?: Search.Condition.Any, text?: string };
  // meta?: Search.Condition.Any;
  // data?: Search.Condition.Any;
  page?: number;
  order?: SearchOrderType;
  tid?: number;
  sort?: SearchSortType;
  // callback: (data: SearchResult) => void;
}

export async function RawSearch(config: SearchConfig) {
  return JsonApiFetch<SearchResult>(Urls.api_v1_search.query, 'POST', config);
}

export function FieldTypeToOperatorList(type: FieldType, required?: boolean): Search.Operator[] {
  if (required == null) {
    required = false;
  }
  const ret: Search.Operator[] = [];

  if (type === FieldType.String || type === FieldType.Choice) {
    ret.push(
      Search.Operator.Equal, 
      Search.Operator.NotEqual,
      Search.Operator.StrBeginWith,
      Search.Operator.StrContain,
      Search.Operator.StrEndWith,
      Search.Operator.StrNotBeginWith,
      Search.Operator.StrNotCotain,
      Search.Operator.StrNotEndWith,
      // SearchOperator.In,
      // SearchOperator.NotIn,
    );
  }
  else if (type === FieldType.Number) {
    ret.push(
      Search.Operator.Equal,
      Search.Operator.NotEqual,
      Search.Operator.Greater,
      Search.Operator.GreaterOrEqual,
      Search.Operator.Less,
      Search.Operator.LessOrEqual,
      // SearchOperator.In,
      // SearchOperator.NotIn,
    );
  }
  else if (type === FieldType.Table || type === FieldType.Array) {
    ret.push(
      Search.Operator.T_All,
      Search.Operator.T_AllNot,
      Search.Operator.T_Exist,
      // SearchOperator.T_N,
    );
  }
  else if (type === FieldType.Container || type === FieldType.Generator || type === FieldType.Image || type === FieldType.File) {
    // do nothing
  }
  else {
    throw new Error('Invalid field type');
  }

  if (!required) {
    ret.push(Search.Operator.Null, Search.Operator.NotNull);
  }

  return ret;
}

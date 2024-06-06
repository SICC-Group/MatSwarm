import { Search } from '../../define/search';
import JsonApiFetch, { RestApiFetch,RestApiFetchV2 } from '../../Fetch';
import Urls from '../../Urls';
import { JoinParameters } from '../../../utils/JoinParameters';


export interface DataQuery {
  tid: number;
  q: Search.Condition.Any;
}

export interface QueryConfig {
  meta?: Search.Condition.Any;
  text?: string;
  data?: DataQuery[];
  sort?: { [x: string]: 'desc' | 'asc' };
}

export interface Summary {
  category: QuerySummaryItem[];
  keywords: Array<{doc_count: number, key: string}>;
  realname: Array<{doc_count: number, key: string}>;
}

export interface Query {
  id: number;
  username: string;
  q: {
    value: QueryConfig;
    summary: Summary;
    page: number;
    page_size: number;
    total: number;
    data: QueryResultItem[];
  }
  clientVO: any;
}

export namespace Query {
  export function copy(q: Query): Query {
    return {
      id: q.id,
      username: q.username,
      clientVO: q.clientVO,
      q: {
        value: { ...q.q.value},
        summary: {
          category: [...q.q.summary.category],
          realname: [...q.q.summary.realname],
          keywords: [...q.q.summary.keywords],
        },
        page: q.q.page,
        page_size: q.q.page_size,
        total: q.q.total,
        data: [...q.q.data]
      }
    }
  }
}

export const TemplateList = [2346, 2345, 2363, 2348, 2349, 2350, 2364, 2351, 2365, 2369, 2432,
2370, 2371, 2352, 2353, 2354, 2355, 2356, 2357, 2358, 2359, 2360, 2425, 2361, 2220,
  2219, 2216, 2217, 2218, 2426, 2383, 2366, 2429, 2362, 2430, 2428, 2427, 2431, 2472,
2477, 2476, 2525, 2474, 2502, 2473];

// 模板ID若为TemplateList中的，需要向南大通用接口发起检索
export async function CreateConvertQuery(config: QueryConfig){
  return RestApiFetch(Urls.api_v2_search.convert_query_list, 'POST', {q: config});
}

export async function CreateQuery(config: QueryConfig) {
  // return RestApiFetch<Query>(Urls.api_v2_search.query_list, 'POST', { q: config });
  return RestApiFetch<Query>('http://localhost:9001' + Urls.api_v2_search.query_list, 'POST', { q: config });
}

export async function PatchQuery(id: number, config: QueryConfig) {
  return RestApiFetch<Query>(Urls.api_v2_search.query_total(String(id)), 'PATCH', { q: config })
}

export async function PutQuery(id: number, config: QueryConfig) {
  return RestApiFetch<Query>(Urls.api_v2_search.query_total(String(id)), 'PUT', { q: config })
}

export interface QueryTemplateItem {
  id: number;
  name: string;
  url: string;
  count_at_least: number;
  download: boolean;
}

export interface QuerySummaryItem {
  id: number;
  name: string;
  count_at_least: number;
  templates: QueryTemplateItem[];
}

export interface QueryResultData {
  title: string;
  methods: string[];
  project: string;
  subject: string;
  id: number;
  category: number;
  category_name: string;
  template: number;
  template_name: string;
  user: string;
  realname: string;
  importing: boolean;
  score: number;
  downloads: number;
  views: number;
  add_time: string;
  is_public: boolean;
  review_state: 'pending' | 'approved' | 'disapproved',
  summary: string;
  abstract: string;
  doi: string;
  source: string;
  reference: string;
}

export interface QueryResultItem {
  data: QueryResultData;
  download: boolean;
  score: number;
}

export interface GetQueryParam {
  page?: number;
  page_size?: number;
  // base64
  return_meta?: string[] | string;
  // base64
  return_data?: string[] | string;
}

export async function GetQuery(id: string, param: GetQueryParam) {
  let url = JoinParameters(Urls.api_v2_search.query_total(id), param);
  url = 'http://localhost:9001/api/v2/search/query/?q_id=' + id;
  return RestApiFetch<Query>(url, 'GET');
}

export interface DataDetailItem {
  data: {
    // 数据的id
    id: number | string;
    // 模板的id
    template: number;
    // 数据的内容
    // 只包含必要的字段，比如只有容器A下面的B字段，那么content就是{ 'A': { 'B': 123 } }
    content: any;
    [x: string]: string | number;
  }

  // 是否在下载列表中
  download: boolean;
  // 数据的评分
  score: number;
}

export interface QueryTemplateDetail {
  page: number;
  page_size: number;
  total: number;
  data: DataDetailItem[];
}

export async function GetQueryTemplate(id: string, template_id: number, param: GetQueryParam) {
  let url = Urls.api_v2_search.query_template_detail(id, template_id);
  url = JoinParameters(url, param);
  url = 'http://localhost:9001/api/v2/search/query/?q_id=' + id + '&t_id=' + template_id;
  return RestApiFetch<QueryTemplateDetail>(url, 'GET');
}

export async function GetQueryDataList(id:number,param:GetQueryParam) {    //for川大
  let urlmat =  window.location.href.split('/')
  let url = Urls.api_v2_search.query_datails(id,urlmat[urlmat.length-1],);
  url = JoinParameters(url, param);
  return RestApiFetchV2<QueryTemplateDetail>(url,'GET')
}

export interface QueryDownloadItem {
    title: string;
    id: number;
    template: number;
  }

export interface QueryDownload {
  download: {
    data: {
      include: QueryDownloadItem[],
      exclude: QueryDownloadItem[],
    },
    template: {
      include: QueryDownloadItem[],
      exclude: QueryDownloadItem[],
    }
  }
}

export async function GetQueryDownload(id: number) {
  return RestApiFetch<QueryDownload>(Urls.api_v2_search.query_download(id));
}

export interface PartialQueryDownload {
  download: {
    data?: {
      include?: number[],
      exclude?: number[],
    },
    template?: {
      include?: number[],
      exclude?: number[],
    }
  }

}

export async function PatchQueryDownload(id: number, data: PartialQueryDownload) {
  return RestApiFetch<QueryDownload>(Urls.api_v2_search.query_download(id), 'PATCH', data);
}

export async function AddDataToQueryDownload(queryID: number, dataID: number) {
  return PatchQueryDownload(queryID, { download: { data: { include: [dataID] } } });
}

export async function RemoveDataFromQueryDownload(queryID: number, dataID: number) {
  return PatchQueryDownload(queryID, { download: { data: { exclude: [dataID] } } });
}


export async function PutQueryDownload(id: number, data: QueryDownload) {
  return RestApiFetch<QueryDownload>(Urls.api_v2_search.query_download(id), 'PUT', data);
}

export async function CreateFullTextQuery(text: string) {
  return CreateQuery({ text });
}

export async function CreateMetaDataQuery(type: Search.MetaType, value: string) {
  return CreateQuery({
    meta: { and: [{ field: type, val: value, op: Search.Operator.StrContain }] }
  });
}

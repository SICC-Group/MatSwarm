import { JsonApiFetch } from '../Fetch';
import Urls from '../Urls';
import * as Url from "url";
import { Template } from '../define/Template';

export interface DataList {
    results: [];
    total: number;
    page: number;
    page_size: number;
}

export interface TemplateDataList {
    results: [];
    total: number;
    page: number;
    page_size: number;
}

export async function MyDataList(page: number, DOI?:boolean, all: boolean = false, total?: number,subject:string=''): Promise<DataList> {
  let page_size = 10
  if (all) {
    page_size = total;
    }
    const parameters = "page=" + page + "&private=true"  + "&per_page=" + page_size  + "&doi=" + DOI + "&subject=" + subject;
    const url = `${Urls.api_v1_storage.data_metas}?${parameters}`;
    const result = await JsonApiFetch<DataList>(url);
    return result;
}

export async function TemplateDataList(template_id:string, page_size: number,
                                       page: number, user_email: string[], DOI?: boolean): Promise<TemplateDataList>{
  let parameters = "template_id="+ Number(template_id) + "&page_size=" + page_size + "&page=" + page + "&user_emails=" + user_email
  if (DOI != null) {
    parameters = parameters + '&doi_exist=' + DOI
  }
  const url = `${Urls.api_v1_storage.template_data}?${parameters}`
  const result = await JsonApiFetch<TemplateDataList>(url);
  return result;
}

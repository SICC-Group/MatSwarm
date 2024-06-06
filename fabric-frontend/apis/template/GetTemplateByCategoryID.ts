import { Template } from '../define/Template';
import JsonApiFetch from '../Fetch';
import Urls from '../Urls';

export interface GetTemplateByCatetoryIDRet {
  templates: Template.Info[];
  total: number;
}

export async function GetTemplateByCatetoryID(categoryID: number, methodID ?: number): Promise<GetTemplateByCatetoryIDRet> {
  if (methodID != null) {
    const url = `${Urls.api_v1_storage.templates}?category=${categoryID}&meta_only=true&per_page=100&method=${methodID}`;
    return JsonApiFetch<Promise<GetTemplateByCatetoryIDRet>>('http://localhost:9001'+url);
  }
  else
  {
    const url = `${Urls.api_v1_storage.templates}?category=${categoryID}&meta_only=true&per_page=100`;
    return JsonApiFetch<Promise<GetTemplateByCatetoryIDRet>>('http://localhost:9001'+url);
  }

}

import JsonApiFetch from '../Fetch';
import Urls from '../Urls';

export interface Result {
  acceptance_id: number;
  project_id: string;
  subjects_id: string[];
}

export async function GetSubjectList(is_expert: boolean, isLeader: boolean) {
  let url = '';
  if (is_expert) { url = Urls.api_cert.evaluation_filter; }
  else if (isLeader) { url = Urls.api_cert.acceptance_filter; }
  return JsonApiFetch(url, 'GET');
}

export async function GetTemplateList(acceptance_id: number, is_expert: boolean, isLeader: boolean) {
  let url = '';
  if (is_expert) {
    url = Urls.api_cert.evaluation_filter + '?acceptance_id=' + acceptance_id;
  }
  else if (isLeader){
    url = Urls.api_cert.acceptance_filter + '?acceptance_id=' + acceptance_id;
  }
  return JsonApiFetch(url, 'GET');
}

export function GetDataList(acceptance_id: string, tid?: string, category_id?: string, subject_id ?: string, per_page ?: number, page ?: number){
  let url = Urls.api_cert.evaluation_data + '?acceptance_id=' + Number(acceptance_id) ;
  if (tid !== '') {
    url = url + '&tid=' + Number(tid);
  }
  if (category_id !== '') {
    url = url + '&category_id=' + Number(category_id);
  }
  if (page != null) {
    url = url + '&per_page=' + per_page + '&page=' + page;
  }
  if (subject_id !== '') {
    url = url + '&subject_id=' + subject_id;
  }
  return JsonApiFetch(url);
}

function GetCategoryTree(category: string, result: any, id: number){
  const temp = category.split('.');
  let str = temp[0];
  if (temp.length > 1) {
    temp.shift();
    if (result.hasOwnProperty(str)){
      result[str].push(GetCategoryTree(temp.join('.'), {}, id));
    }
    else {
      result[str] = [];
      result[str].push(GetCategoryTree(temp.join('.'), {}, id));
    }
  }
  else {
    result[str] = {category_id: String(id)};
  }
  return result;
}

export function GetCategory(origin_data: any[]){
  const category_str: string[] = [];
  const category: any[] = [];
  origin_data.map((value, index) => {// 先提取外层
    const temp = {
      path: value.category_full_path,
      category_id: value.category_id,
    };
    if (!category_str.includes(value.category_full_path)){
      category_str.push(value.category_full_path);
      category.push(temp);
    }
  });
  let category_list = {};
  category.map((item) => {
    GetCategoryTree(item.path, category_list, item.category_id);
  });
  return category_list;
}

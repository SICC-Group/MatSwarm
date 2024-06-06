import Urls from '../Urls';
import JsonApiFetch from '../Fetch';
import { Project, ProjectAll } from '../define/Project';

export interface Result {
  results: Project[];
  page: number;
  page_size: number;
  total: number;
}

export async function GetProjectList(page: number, page_size: number ): Promise<Project[]> {
    return JsonApiFetch(Urls.api_v1_storage.get_material_projects);
}

// 只获取项目名称和id的api，用于选择项目的下拉框
export async function GetProjectAllList(): Promise<ProjectAll[]> {
  return JsonApiFetch(Urls.api_v1_storage.get_projects_all);
}
//获取用户创建的项目列表
export async function GetProjectListTest(total: boolean, page: number, page_size: number ){
  const url = '/api/v1.1/storage/projects/' + '?total=' + total+ '&page=' + page + '&page_size=' + page_size;
    const result = await JsonApiFetch<Result>(url, 'GET');
    return result;
}

export async function SearchGetProjectList(username: string , page: number, page_size: number) {
  const url = Urls.api_v1_1_storage.material_project_query;
  return await JsonApiFetch<Result>(url + '?query=' + username + '&page=' + page + '&page_size=' + page_size, 'GET');
}

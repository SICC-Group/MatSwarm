import {ReviewState} from '../define/ReviewState';
import {Task} from '../define/Task';
import {RestApiFetch, JsonApiFetch} from '../Fetch';
import Urls from '../Urls';

export type Result = Task.Full;

export function GetTaskList(state: ReviewState, page ?: number, pagesize ?: number){
  const url = Urls.api_v1_task.task_list;
  return RestApiFetch(url + '?state=' + state + '&page=' + page + '&page_size=' + pagesize)
}

export function TaskImportVerify(id: number){
  const url = Urls.api_v1_task.task_importVerify(id);
  return RestApiFetch(url, 'POST');
}

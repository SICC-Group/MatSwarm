import Urls from '../Urls';
import {JsonApiFetch} from '../Fetch';

// 删除任务
export function DeleteTask(id: number){
  const url = Urls.api_v1_task.one_task(id);
  return JsonApiFetch(url, 'DELETE');
}
;

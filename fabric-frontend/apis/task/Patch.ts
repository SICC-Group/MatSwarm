import Urls from '../Urls';
import {JsonApiFetch} from '../Fetch';

// 修改任务
export function PendingTask(id: number){
  const url = Urls.api_v1_task.one_task(id);
  const data = {
    state : "PENDING" ,
  }
  return JsonApiFetch(url, 'PATCH', data);
};

// 取消任务
export function CancelTask(id: number){
  const url = Urls.api_v1_task.one_task(id);
  const data = {
    state : "REVOKED" ,
  }
  return JsonApiFetch(url, 'PATCH', data);
};


